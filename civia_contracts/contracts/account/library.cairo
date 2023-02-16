%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin, SignatureBuiltin
from starkware.cairo.common.signature import verify_ecdsa_signature
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.memcpy import memcpy
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.math import assert_not_zero, assert_le, assert_nn, assert_not_equal
from starkware.starknet.common.syscalls import (
    library_call,
    call_contract,
    get_tx_info,
    get_contract_address,
    get_caller_address,
    get_block_timestamp,
)
from starkware.cairo.common.bool import TRUE, FALSE

from contracts.upgrade.Upgradable import _set_implementation

from contracts.utils.calls import CallArray

const SUPPORTS_INTERFACE_SELECTOR = 1184015894760294494673613438913361435336722154500302038630992932234692784845;
const ERC165_ACCOUNT_INTERFACE_ID = 0x3943f10f;
const ERC165_ACCOUNT_INTERFACE_ID_OLD = 0xf10dbd44; // this is needed to upgrade to this version

const TRANSACTION_VERSION = 1;
const QUERY_VERSION = 2**128 + TRANSACTION_VERSION;

/////////////////////
// STRUCTS
/////////////////////

struct EscapeSigner {
    guardian1: felt,
    guardian2: felt,
    new_signer: felt,
}

struct ReplaceGuardian {
    replace_time: felt,
    replace_id: felt,
    old_guardian: felt,
    new_guardian: felt,
}

/////////////////////
// EVENTS
/////////////////////
@event
func replace_guardian_triggered(replace_time: felt, replace_id: felt, old_guardian: felt, new_guardian: felt) {
}

@event
func guardian_replaced(old_guardian: felt, new_guardian: felt) {
}


@event
func escape_signer_canceled() {
}

@event
func signer_escaped(new_signer: felt) {
}

@event
func account_upgraded(new_implementation: felt) {
}

/////////////////////
// STORAGE VARIABLES
/////////////////////

@storage_var
func _signer() -> (res: felt) {
}

@storage_var
func _guardian() -> (res: felt) {
}

@storage_var
func _guardian_backup() -> (res: felt) {
}

@storage_var
func _escape_signer() -> (res: EscapeSigner) {
}

@storage_var
func _replace_guardian() -> (res: ReplaceGuardian) {
}

@storage_var
func _replace_id() -> (id: felt) {
}

@storage_var
func _guardians(account: felt) -> (valid: felt) {
}

@storage_var
func _guardian_size() -> (size: felt) {
}

/////////////////////
// INTERNAL FUNCTIONS
/////////////////////

func assert_only_self{syscall_ptr: felt*}() -> () {
    let (self) = get_contract_address();
    let (caller_address) = get_caller_address();
    with_attr error_message("civia: only self") {
        assert self = caller_address;
    }
    return ();
}

func assert_initialized{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    let (signer) = _signer.read();
    with_attr error_message("civia: account not initialized") {
        assert_not_zero(signer);
    }
    return ();
}

func assert_non_reentrant{syscall_ptr: felt*}() -> () {
    let (caller) = get_caller_address();
    with_attr error_message("civia: no reentrant call") {
        assert caller = 0;
    }
    return ();
}

func assert_correct_tx_version{syscall_ptr: felt*}(tx_version: felt) -> () {
    with_attr error_message("civia: invalid tx version") {
        assert (tx_version - TRANSACTION_VERSION) * (tx_version - QUERY_VERSION) = 0;
    }
    return ();
}


func assert_no_self_call(self: felt, call_array_len: felt, call_array: CallArray*) {
    if (call_array_len == 0) {
        return ();
    }
    assert_not_zero(call_array[0].to - self);
    assert_no_self_call(self, call_array_len - 1, call_array + CallArray.SIZE);
    return ();
}

@contract_interface
namespace IAccount {
    func is_valid_signature(hash: felt, sig_len: felt, sig: felt*) -> (is_valid: felt){
    }
}

namespace ArgentModel {

    const CHANGE_SIGNER_SELECTOR = 174572128530328568741270994650351248940644050288235239638974755381225723145;
    const CHANGE_GUARDIAN_SELECTOR = 1296071702357547150019664216025682391016361613613945351022196390148584441374;
    const TRIGGER_ESCAPE_GUARDIAN_SELECTOR = 145954635736934016296422259475449005649670140213177066015821444644082814628;
    const TRIGGER_ESCAPE_SIGNER_SELECTOR = 440853473255486090032829492468113410146539319637824817002531798290796877036;
    const ESCAPE_GUARDIAN_SELECTOR = 510756951529079116816142749077704776910668567546043821008232923043034641617;
    const ESCAPE_SIGNER_SELECTOR = 1455116469465411075152303383382102930902943882042348163899277328605146981359;
    const CANCEL_ESCAPE_SELECTOR = 1387988583969094862956788899343599960070518480842441785602446058600435897039;
    const EXECUTE_AFTER_UPGRADE_SELECTOR = 738349667340360233096752603318170676063569407717437256101137432051386874767;

    const TRIGGER_ESCAPE_OWNER_SELECTOR = 1632769945331189618548649458400984384299649732138021114011251887834866043955;
    const ESCAPE_OWNER_SELECTOR = 400294111809876126615011803367712862701236946577276255329338731864091873546;
    const TRIGGER_REPLACE_GUARDIAN_SELECTOR = 587509579880210249349960076044887450019347205144675414432059786672684259224;
    const REPLACE_GUARDIAN_WITH_SIGN_SELECTOR = 386348482867425117404626749675940243387788773606246333381512408025298675071;
    const REPLACE_GUARDIAN_WITHOUT_SIGN_SELECTOR = 991582592931135211571178979585780574310361219705583354792714659416848377707;

    const ESCAPE_SECURITY_PERIOD = 7 * 24 * 60 * 60;  // 7 days

    const ESCAPE_TYPE_GUARDIAN = 1;
    const ESCAPE_TYPE_SIGNER = 2;

    /////////////////////
    // WRITE FUNCTIONS
    /////////////////////

    func initialize{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        signer: felt
    ) {
        // check that we are not already initialized
        let (current_signer) = _signer.read();
        with_attr error_message("civia: already initialized") {
            assert current_signer = 0;
        }
        // check that the target signer is not zero
        with_attr error_message("civia: signer cannot be null") {
            assert_not_zero(signer);
        }
        // initialize the contract
        _signer.write(signer);
        return ();
    }

    func upgrade{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        implementation: felt
    ) {
        // only called via execute
        assert_only_self();
        // make sure the target is an account
        with_attr error_message("civia: invalid implementation") {
            let (calldata: felt*) = alloc();
            assert calldata[0] = ERC165_ACCOUNT_INTERFACE_ID;
            let (retdata_size: felt, retdata: felt*) = library_call(
                class_hash=implementation,
                function_selector=SUPPORTS_INTERFACE_SELECTOR,
                calldata_size=1,
                calldata=calldata,
            );
            assert retdata_size = 1;
            assert [retdata] = TRUE;
        }
        // change implementation
        _set_implementation(implementation);
        account_upgraded.emit(new_implementation=implementation);
        return ();
    }

    func _add_guardians{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        current_index: felt, guardian_ptr_len: felt, guardian_ptr: felt*
    ) {
        if (current_index == guardian_ptr_len) {
            return ();
        }
        let guardian = guardian_ptr[current_index];
        let (is_guardian) = _guardians.read(guardian);
        with_attr error_message("civia: this account is already a guardian") {
            assert is_guardian=0;
        }
        _guardians.write(guardian,1);
        return _add_guardians(current_index+1,guardian_ptr_len,guardian_ptr);
    }

    func add_guardians{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        guardian_ptr_len: felt, guardian_ptr: felt*
    ) {
        alloc_locals;

        assert_only_self();

        let (guardian_size) = _guardian_size.read();
        let new_guardian_size = guardian_size + guardian_ptr_len;
        local len_ok;
        if(new_guardian_size==1){
            len_ok = TRUE;
        }
        // if(new_guardian_size==2){
        //     len_ok = TRUE;
        // }
        if(new_guardian_size==3){
            len_ok = TRUE;
        }
        with_attr error_message("civia: guardian size error") {
            assert len_ok=TRUE;
        }

        _guardian_size.write(new_guardian_size);
        _add_guardians(0, guardian_ptr_len, guardian_ptr);
        return ();
    }

    func cancel_escape_signer{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
        // only called via execute
        assert_only_self();

        // validate there is an active escape
        let (current_escape) = _escape_signer.read();
        with_attr error_message("civia: no active escape") {
            assert_not_zero(current_escape.new_signer);
        }

        // clear escape
        let new_escape: EscapeSigner = EscapeSigner(0, 0, 0);
        _escape_signer.write(new_escape);
        escape_signer_canceled.emit();
        return ();
    }

    func escape_signer{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr}(
        info_ptr_len: felt, info_ptr: felt*
    ) {
        alloc_locals;

        with_attr error_message("civia: escape info error") {
            assert info_ptr_len=6;
        }

        let new_signer = info_ptr[1];
        let guardian = info_ptr[2];
        with_attr error_message("civia: new signer error") {
            assert_not_zero(new_signer);
        }

        let (is_guardian) = _guardians.read(guardian);
        with_attr error_message("civia: guardian error") {
            assert_not_zero(is_guardian);
        }

        let ( current_escape: EscapeSigner) = _escape_signer.read();
        if(current_escape.new_signer!=0){
            with_attr error_message("civia: new signer error") {
                assert new_signer = current_escape.new_signer;
            }
        }

        let (self) = get_contract_address();

        let (message) = hash2{hash_ptr=pedersen_ptr}(
            x=self, y=new_signer
        );

        let (sig_array : felt*) = alloc();
        assert sig_array[0] = info_ptr[4];
        assert sig_array[1] = info_ptr[5];

        let(is_valid_signature) = IAccount.is_valid_signature(contract_address=guardian, hash=message, sig_len=2, sig=sig_array);
        with_attr error_message("civia: signature invalid") {
            assert_not_zero(is_valid_signature);
        }
        let (guardian_size) = _guardian_size.read();
        let empty_escape: EscapeSigner = EscapeSigner(0, 0, 0);
        if(current_escape.guardian1==0){
            if(guardian_size==1){
                _escape_signer.write(empty_escape);
                _signer.write(new_signer);
                signer_escaped.emit(new_signer=new_signer);
                return ();
            } else{
                let new_escape: EscapeSigner = EscapeSigner(guardian, 0, new_signer);
                _escape_signer.write(new_escape);
                return ();
            }
        } else {
            _escape_signer.write(empty_escape);
            _signer.write(new_signer);
            signer_escaped.emit(new_signer=new_signer);
            return ();
        }
    }

    func trigger_replace_guardian{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr}(old_guardian: felt, new_guardian: felt) {
        let (is_guardian) = _guardians.read(old_guardian);
        with_attr error_message("civia: old guardian error") {
            assert_not_zero(is_guardian);
        }

        with_attr error_message("civia: new guardian error") {
            assert_not_zero(new_guardian);
        }

        with_attr error_message("civia: replace info error") {
            assert_not_equal(old_guardian, new_guardian);
        }

        let (block_timestamp) = get_block_timestamp();
        let (replace_id) = _replace_id.read();
        _replace_id.write(replace_id+1);

        let new_replace: ReplaceGuardian = ReplaceGuardian(block_timestamp, replace_id+1, old_guardian, new_guardian);
        _replace_guardian.write(new_replace);
        replace_guardian_triggered.emit(replace_time=block_timestamp, replace_id=replace_id+1, old_guardian=old_guardian, new_guardian=new_guardian);
        return ();
    }

    func replace_guardian_with_sign{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr}(info_ptr_len: felt, info_ptr: felt*) {
        alloc_locals;

        with_attr error_message("civia: replace info error") {
            assert info_ptr_len=6;
        }

        let (current_replace: ReplaceGuardian) = _replace_guardian.read();
        with_attr error_message("civia: replace id error") {
            assert current_replace.replace_id = info_ptr[0];
        }

        let (message) = hash2{hash_ptr=pedersen_ptr}(
            x=current_replace.replace_id, y=current_replace.new_guardian
        );

        let (sig_array : felt*) = alloc();
        //local sig_array: felt*;
        assert sig_array[0] = info_ptr[4];
        assert sig_array[1] = info_ptr[5];

        let guardian = info_ptr[2];
        let (is_guardian: felt) = _guardians.read(guardian);
        with_attr error_message("civia: guardian error") {
            assert_not_zero(is_guardian);
        }

        let(is_valid) = IAccount.is_valid_signature(contract_address=guardian, hash=message, sig_len=2, sig=sig_array);
        with_attr error_message("signature invalid") {
            assert_not_zero(is_valid);
        }

        let new_replace: ReplaceGuardian = ReplaceGuardian(0, 0, 0, 0);
        _replace_guardian.write(new_replace);

        _guardians.write(current_replace.old_guardian, 0);
        _guardians.write(current_replace.new_guardian, 1);

        guardian_replaced.emit(old_guardian=current_replace.old_guardian, new_guardian=current_replace.new_guardian);
        return ();
    }

    func replace_guardian_without_sign{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr}() {
        alloc_locals;

        let (current_replace) = _replace_guardian.read();
        with_attr error_message("civia: no replace") {
            assert_not_zero(current_replace.replace_id);
        }

        local timeoutTmsp = current_replace.replace_time + ESCAPE_SECURITY_PERIOD;
        let (block_timestamp) = get_block_timestamp();
        with_attr error_message("civia: replace not timeout") {
            assert_le(timeoutTmsp, block_timestamp);
        }

        let new_replace: ReplaceGuardian = ReplaceGuardian(0, 0, 0, 0);
        _replace_guardian.write(new_replace);

        _guardians.write(current_replace.old_guardian, 0);
        _guardians.write(current_replace.new_guardian, 1);

        guardian_replaced.emit(old_guardian=current_replace.old_guardian, new_guardian=current_replace.new_guardian);
        return ();
    }

    /////////////////////
    // VIEW FUNCTIONS
    /////////////////////

    func is_valid_signature{
        syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr
    }(hash: felt, sig_len: felt, sig: felt*) -> (is_valid: felt) {
        alloc_locals;

        let (is_signer_sig_valid) = validate_signer_signature(hash, sig_len, sig);

        return (is_valid=is_signer_sig_valid);
    }

    func supports_interface{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        interface_id: felt
    ) -> (success: felt) {
        // 165
        if (interface_id == 0x01ffc9a7) {
            return (TRUE,);
        }
        // IAccount
        if (interface_id == ERC165_ACCOUNT_INTERFACE_ID) {
            return (TRUE,);
        }
        // Old IAccount
        if (interface_id == ERC165_ACCOUNT_INTERFACE_ID_OLD) {
            return (TRUE,);
        }
        return (FALSE,);
    }

    func get_signer{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
        signer: felt
    ) {
        let (res) = _signer.read();
        return (signer=res);
    }

    func get_escape_signer{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
        guardian1: felt, guardian2: felt, new_signer: felt
    ) {
        let (res) = _escape_signer.read();
        return (guardian1=res.guardian1, guardian2=res.guardian2, new_signer=res.new_signer);
    }

    func get_replace_guardian{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
        replace_time: felt, replace_id: felt, old_guardian: felt, new_guardian: felt
    ) {
        let (res) = _replace_guardian.read();
        return (replace_time=res.replace_time, replace_id=res.replace_id, old_guardian=res.old_guardian, new_guardian=res.new_guardian);
    }

    func get_guardian_size{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
        size: felt
    ) {
        let (size) = _guardian_size.read();
        return (size=size);
    }

    func validate_signer_signature{
        syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr
    }(message: felt, signatures_len: felt, signatures: felt*) -> (is_valid: felt) {
        with_attr error_message("civia: signer signature invalid") {
            assert_nn(signatures_len - 2);
            let (signer) = _signer.read();
            verify_ecdsa_signature(
                message=message, public_key=signer, signature_r=signatures[0], signature_s=signatures[1]
            );
        }
        return (is_valid=TRUE);
    }
}
