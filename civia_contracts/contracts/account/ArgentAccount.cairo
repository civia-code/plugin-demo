%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin, SignatureBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.memcpy import memcpy
from starkware.cairo.common.math import assert_not_zero
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.bool import TRUE, FALSE
from starkware.starknet.common.syscalls import (
    get_tx_info,
    library_call,
    get_contract_address,
)

from contracts.utils.calls import (
    CallArray,
    execute_call_array,
)

from contracts.account.library import (
    ArgentModel,
    assert_only_self,
    assert_correct_tx_version,
    assert_non_reentrant,
    assert_initialized,
    assert_no_self_call,
)

from starkware.cairo.common.signature import (
    verify_ecdsa_signature,
)

    
/////////////////////
// CONSTANTS
/////////////////////

const NAME = 'CiviaAccount';
const VERSION = '0.2.3';

/////////////////////
// EVENTS
/////////////////////

@event
func account_created(account: felt, key: felt) {
}

@event
func transaction_executed(hash: felt, response_len: felt, response: felt*) {
}

/////////////////////
// ACCOUNT INTERFACE
/////////////////////

@external
func __validate__{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    ecdsa_ptr: SignatureBuiltin*,
    range_check_ptr
} (
    call_array_len: felt,
    call_array: CallArray*,
    calldata_len: felt,
    calldata: felt*
) {
    alloc_locals;

    // make sure the account is initialized
    assert_initialized();

    // get the tx info
    let (tx_info) = get_tx_info();

    // block transaction with version != 1 or QUERY
    assert_correct_tx_version(tx_info.version);

    if (call_array_len == 1) {
        if (call_array[0].to == tx_info.account_contract_address) {
            // a * b == 0 --> a == 0 OR b == 0
            tempvar signer_condition = (call_array[0].selector - ArgentModel.TRIGGER_REPLACE_GUARDIAN_SELECTOR) * (call_array[0].selector - ArgentModel.REPLACE_GUARDIAN_WITH_SIGN_SELECTOR) * (call_array[0].selector - ArgentModel.REPLACE_GUARDIAN_WITHOUT_SIGN_SELECTOR);
            if (signer_condition == 0) {
                // validate signer signature
                ArgentModel.validate_signer_signature(
                    tx_info.transaction_hash, tx_info.signature_len, tx_info.signature
                );
                return ();
            }

            //tempvar escape_owner_condition = (call_array[0].selector - ArgentModel.TRIGGER_ESCAPE_OWNER_SELECTOR) * (call_array[0].selector - ArgentModel.ESCAPE_OWNER_SELECTOR);
            tempvar escape_signer_condition = call_array[0].selector - ArgentModel.ESCAPE_SIGNER_SELECTOR;
            if (escape_signer_condition == 0) {
                return ();
            }

            with_attr error_message("argent: forbidden call") {
                assert_not_zero(call_array[0].selector - ArgentModel.EXECUTE_AFTER_UPGRADE_SELECTOR);
            } 
        }
    } else {
        // make sure no call is to the account
        assert_no_self_call(tx_info.account_contract_address, call_array_len, call_array);
    }
    // validate signer and guardian signatures
    ArgentModel.validate_signer_signature(tx_info.transaction_hash, tx_info.signature_len, tx_info.signature);

    return ();
}

@external
@raw_output
func __execute__{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    ecdsa_ptr: SignatureBuiltin*,
    range_check_ptr
} (
    call_array_len: felt,
    call_array: CallArray*,
    calldata_len: felt,
    calldata: felt*
) -> (
    retdata_size: felt, retdata: felt*
) {
    alloc_locals;
    
    // no reentrant call to prevent signature reutilization
    assert_non_reentrant();

    // execute calls
    let (retdata_len, retdata) = execute_call_array(call_array_len, call_array, calldata_len, calldata);

    // emit event
    let (tx_info) = get_tx_info();
    transaction_executed.emit(
        hash=tx_info.transaction_hash, response_len=retdata_len, response=retdata
    );
    return (retdata_size=retdata_len, retdata=retdata);
}

@external
func __validate_declare__{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    ecdsa_ptr: SignatureBuiltin*,
    range_check_ptr
} (
    class_hash: felt
) {
    alloc_locals;
    // get the tx info
    let (tx_info) = get_tx_info();
    // validate signatures
    ArgentModel.validate_signer_signature(tx_info.transaction_hash, tx_info.signature_len, tx_info.signature);
    return ();
}


@raw_input
@external
func __validate_deploy__{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    ecdsa_ptr: SignatureBuiltin*,
    range_check_ptr
} (selector: felt, calldata_size: felt, calldata: felt*) {
    alloc_locals;
    // get the tx info
    let (tx_info) = get_tx_info();
    // validate signatures
    ArgentModel.validate_signer_signature(tx_info.transaction_hash, tx_info.signature_len, tx_info.signature);
    return ();
}

@view
func isValidSignature{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr
}(hash: felt, sig_len: felt, sig: felt*) -> (isValid: felt) {
    let (isValid) = ArgentModel.is_valid_signature(hash, sig_len, sig);
    return (isValid=isValid);
}

@view
func supportsInterface{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    interfaceId: felt
) -> (success: felt) {
    let (success) =  ArgentModel.supports_interface(interfaceId);
    return (success=success);
}

/////////////////////
// EXTERNAL FUNCTIONS
/////////////////////

@external
func initialize{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    signer: felt
) {
    ArgentModel.initialize(signer);
    let (self) = get_contract_address();
    account_created.emit(account=self, key=signer);
    return ();
}

@external
func upgrade{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    implementation: felt, calldata_len: felt, calldata: felt*
) -> (retdata_len: felt, retdata: felt*) {
    ArgentModel.upgrade(implementation);

    if (calldata_len == 0) {
        let (retdata: felt*) = alloc();
        return (retdata_len=0, retdata=retdata);
    } else {
        let (retdata_size: felt, retdata: felt*) = library_call(
            class_hash=implementation,
            function_selector=ArgentModel.EXECUTE_AFTER_UPGRADE_SELECTOR,
            calldata_size=calldata_len,
            calldata=calldata,
        );
        return (retdata_len=retdata_size, retdata=retdata);
    }
}

@external
func execute_after_upgrade{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    call_array_len: felt, call_array: CallArray*, calldata_len: felt, calldata: felt*
) -> (retdata_len: felt, retdata: felt*) {
    alloc_locals;
    // only self
    assert_only_self();
    // only calls to external contract
    let (self) = get_contract_address();
    assert_no_self_call(self, call_array_len, call_array);
    // execute calls
    let (retdata_len, retdata) = execute_call_array(call_array_len, call_array, calldata_len, calldata);
    return (retdata_len=retdata_len, retdata=retdata);
}

@external
func addGuardians{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
     guardian_ptr_len: felt, guardian_ptr: felt*
) {
    ArgentModel.add_guardians(guardian_ptr_len, guardian_ptr);
    return ();
}

@external
func cancelEscapeSigner{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    ArgentModel.cancel_escape_signer();
    return ();
}

@external
func escapeSigner{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr}(escape_info_ptr_len: felt, escape_info_ptr: felt*) {
    ArgentModel.escape_signer(escape_info_ptr_len, escape_info_ptr);
    return ();
}

@external
func triggerReplaceGuardian{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr}(old_guardian: felt, new_guardian: felt) {
    ArgentModel.trigger_replace_guardian(old_guardian, new_guardian);
    return ();
}

@external
func replaceGuardianWithSign{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr}(replace_info_ptr_len: felt, replace_info_ptr: felt*) {
    ArgentModel.replace_guardian_with_sign(replace_info_ptr_len, replace_info_ptr);
    return ();
}

@external
func replaceGuardianWithoutSign{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr}() {
    ArgentModel.replace_guardian_without_sign();
    return ();
}

/////////////////////
// VIEW FUNCTIONS
/////////////////////

@view
func getSigner{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    signer: felt
) {
    let (res) = ArgentModel.get_signer();
    return (signer=res);
}

@view
func getGuardianSize{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    size: felt
) {
    let (size) = ArgentModel.get_guardian_size();
    return (size=size);
}

@view
func getEscapeSigner{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    guardian1: felt, guardian2: felt, new_signer: felt
) {
    let (guardian1, guardian2, new_signer) = ArgentModel.get_escape_signer();
    return (guardian1=guardian1, guardian2=guardian2, new_signer=new_signer);
}

@view
func getReplaceGuardian{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    replaceTime: felt, replaceId: felt, oldGuardian: felt, newGuardian: felt
) {
    let (replaceTime, replaceId, oldGuardian, newGuardian) = ArgentModel.get_replace_guardian();
    return (replaceTime=replaceTime, replaceId=replaceId, oldGuardian=oldGuardian, newGuardian=newGuardian);
}

@view
func getVersion() -> (version: felt) {
    return (version=VERSION);
}

@view
func getName() -> (name: felt) {
    return (name=NAME);
}

// TMP: Remove when isValidSignature() is widely used 
@view
func is_valid_signature{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, ecdsa_ptr: SignatureBuiltin*, range_check_ptr
}(hash: felt, sig_len: felt, sig: felt*) -> (is_valid: felt) {
    let (is_valid) = ArgentModel.is_valid_signature(hash, sig_len, sig);
    return (is_valid=is_valid);
}
