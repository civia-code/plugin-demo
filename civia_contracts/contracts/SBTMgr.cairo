%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin, BitwiseBuiltin
from starkware.starknet.common.syscalls import get_caller_address, deploy, get_contract_address
from starkware.cairo.common.uint256 import (Uint256, uint256_eq)
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.math import assert_not_zero, assert_not_equal
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le, is_le_felt
from starkware.cairo.common.bool import TRUE, FALSE



@contract_interface
namespace ISBT {
    func mint(to: felt) {
    }

    func burn(account: felt) {
    }

    func tokenIdOf(account: felt) -> (tokenId: Uint256){
    }
}

//
// Storage
//

// @dev Array of all sbt
@storage_var
func _index_sbt_map(index: felt) -> (address: felt) {
}

// @dev SBT address for sbt of `account`
@storage_var
func _account_sbt_map(account: felt) -> (sbt: felt) {
}

@storage_var
func _sbt_account_map(sbt: felt) -> (account: felt) {
}

// @dev Total sbt
@storage_var
func _num_of_sbt() -> (num: felt) {
}

@storage_var
func _sbt_contract_class_hash() -> (class_hash: felt) {
}

@storage_var
func _account_follows(account: felt, index: felt) -> (sbt_owner: felt) {
}

@storage_var
func _num_of_account_follows(account: felt) -> (num: felt) {
}

@storage_var
func _sbt_fans(sbt_owner: felt, index: felt) -> (account: felt) {
}

@storage_var
func _num_of_sbt_fans(sbt_owner: felt) -> (num: felt) {
}

@storage_var
func _account_id_map(account: felt) -> (id: felt) {
}

@storage_var
func _id_account_map(id: felt) -> (account: felt) {
}

@storage_var
func _nick_name_map(account: felt) -> (nick_name: felt) {
}

@event
func sbt_created(account: felt, sbt_address: felt, total_sbt: felt) {
}

@event
func sbt_follow(from_address: felt, sbt_owner: felt, sbt_address: felt){
}

@event
func sbt_unfollow(from_address: felt, sbt_owner: felt, sbt_address: felt){
}

@event
func id_created(account: felt, id: felt) {
}

@event
func nick_name_changed(account: felt, nick_name: felt) {
}


//
// Constructor
//

// @notice Contract constructor
// @param fee_to Initial fee recipient
@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    sbt_contract_class_hash: felt
) {
    with_attr error_message("Mgr: SBT Contract Class Hash can not be zero") {
        assert_not_zero(sbt_contract_class_hash);
    }

    _sbt_contract_class_hash.write(sbt_contract_class_hash);
    _num_of_sbt.write(0);
    return ();
}

//
// Getters
//

// @notice Get sbt address for the sbt of `account`
// @param account Address of user
// @return sbt Address
@view
func get_sbt{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    account: felt
) -> (sbt: felt) {
    return _account_sbt_map.read(account);
}


// @notice Get the number of sbt
// @return num_of_sbt
@view
func get_num_of_sbt{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    num_of_sbt: felt
) {
    let (num_of_sbt) = _num_of_sbt.read();
    return (num_of_sbt,);
}

// @notice Get the class hash of the SBT contract which is deployed for each sbt.
// @return class_hash
@view
func get_sbt_contract_class_hash{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    ) -> (class_hash: felt) {
    return _sbt_contract_class_hash.read();
}

@view
func account_id{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(account: felt) -> (
    id: felt
) {
    return _account_id_map.read(account);
}

@view
func id_account{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(id: felt) -> (
    account: felt
) {
    return _id_account_map.read(id);
}

@view
func nick_name_of_account{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(account: felt) -> (
    nick_name: felt
) {
    return _nick_name_map.read(account);
}

@view
func nick_name_of_id{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(id: felt) -> (
    nick_name: felt
) {
    let (account) = _id_account_map.read(id);
    return _nick_name_map.read(account);
}

@external
func create_sbt{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, bitwise_ptr: BitwiseBuiltin*, range_check_ptr
}(account: felt, nick_name: felt) -> (sbt: felt) {
    alloc_locals;
    with_attr error_message("Mgr::create_sbt::account must be non zero") {
        assert_not_zero(account);
    }

    let (existing_sbt) = _account_sbt_map.read(account);
    with_attr error_message("Mgr::create_sbt::sbt already exists for user") {
        assert existing_sbt = 0;
    }
    let (class_hash: felt) = _sbt_contract_class_hash.read();

    let (contract_address: felt) = get_contract_address();

    tempvar pedersen_ptr = pedersen_ptr;

    let (salt) = hash2{hash_ptr=pedersen_ptr}(account,0);

    let constructor_calldata: felt* = alloc();

    assert [constructor_calldata] = 'Civia SBT';
    assert [constructor_calldata + 1] = 'SBT';
    assert [constructor_calldata + 2] = account;
    assert [constructor_calldata + 3] = contract_address;

    let (sbt: felt) = deploy(
        class_hash=class_hash,
        contract_address_salt=salt,
        constructor_calldata_size=4,
        constructor_calldata=constructor_calldata,
        deploy_from_zero=0,
    );

    _account_sbt_map.write(account, sbt);
    _sbt_account_map.write(sbt, account);
    let (num_sbt) = _num_of_sbt.read();
    _index_sbt_map.write(num_sbt + 1, sbt);
    _num_of_sbt.write(num_sbt + 1);

    sbt_created.emit(account=account, sbt_address=sbt, total_sbt=num_sbt + 1);

    let num_of_id = num_sbt + 100001;
    _account_id_map.write(account,num_of_id);
    _id_account_map.write(num_of_id,account);
    _nick_name_map.write(account, nick_name);
    id_created.emit(account, num_of_id);
    nick_name_changed.emit(account, nick_name);

    return (sbt=sbt);
}

@external
func follow{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(sbt_owner: felt) {
    let (sbt_addr) = get_sbt(sbt_owner);
    with_attr error_message("Mgr: sbt owner have no sbt") {
        assert_not_zero(sbt_addr);
    }
    let (caller) = get_caller_address();

    let (num) = _num_of_account_follows.read(caller);
    _account_follows.write(caller,num,sbt_owner);
    _num_of_account_follows.write(caller,num+1);

    let (num2) = _num_of_sbt_fans.read(sbt_owner);
    _sbt_fans.write(sbt_owner,num2,caller);
    _num_of_sbt_fans.write(sbt_owner,num2+1);

    ISBT.mint(contract_address=sbt_addr, to=caller);
    sbt_follow.emit(from_address=caller, sbt_owner=sbt_owner, sbt_address=sbt_addr);
    return ();
}

@external
func unfollow{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(sbt_owner: felt) {
    let (sbt_addr) = get_sbt(sbt_owner);
    with_attr error_message("Mgr: sbt owner have no sbt") {
        assert_not_zero(sbt_addr);
    }
    let (caller) = get_caller_address();
    ISBT.burn(contract_address=sbt_addr, account=caller);
    sbt_unfollow.emit(from_address=caller, sbt_owner=sbt_owner, sbt_address=sbt_addr);
    return ();
}

@external
func set_nick_name{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(nick_name: felt) {
    let (caller) = get_caller_address();
    _nick_name_map.write(caller, nick_name);
    nick_name_changed.emit(caller, nick_name);
    return ();
}

@view
func get_all_follows{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(account: felt) -> (
    addrs_len: felt, addrs: felt*, ids_len: felt, ids: felt*, nick_names_len: felt, nick_names: felt*
) {
    alloc_locals;
    let (num) = _num_of_account_follows.read(account);
    let (local addrs: felt*) = alloc();
    let (local ids: felt*) = alloc();
    let (local nick_names: felt*) = alloc();
    _build_all_follows_array(account, 0, num, addrs, ids, nick_names);
    return (num, addrs, num, ids, num, nick_names);
}

func _build_all_follows_array{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    account: felt, current_index: felt, num: felt, addrs: felt*, ids: felt*, nick_names: felt*
) -> (addrs: felt*, ids: felt*, nick_names: felt*) {
    alloc_locals;
    if (current_index == num) {
        return (addrs,ids,nick_names);
    }
    let (sbt_owner) = _account_follows.read(account,current_index);
    let (sbt_addr) = get_sbt(sbt_owner);
    let (tokenId) = ISBT.tokenIdOf(contract_address=sbt_addr, account=account);
    let (id) = _account_id_map.read(sbt_owner);
    let (nick_name) = _nick_name_map.read(sbt_owner);

    let (is_id_equal_to_zero) = uint256_eq(tokenId, Uint256(0, 0));
    if(is_id_equal_to_zero==1){
        assert [addrs] = 0;
    } else {
        assert [addrs] = sbt_owner;
    }
    assert [ids] = id;
    assert [nick_names] = nick_name;
    return _build_all_follows_array(account,current_index + 1, num, addrs + 1, ids + 1, nick_names + 1);
}

@view
func get_all_fans{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(sbt_owner: felt) -> (
    addrs_len: felt, addrs: felt*, ids_len: felt, ids: felt*, nick_names_len: felt, nick_names: felt*
) {
    alloc_locals;
    let (num) = _num_of_sbt_fans.read(sbt_owner);
    let (sbt_addr) = get_sbt(sbt_owner);
    let (local addrs: felt*) = alloc();
    let (local ids: felt*) = alloc();
    let (local nick_names: felt*) = alloc();
    _build_all_fans_array(sbt_addr, sbt_owner, 0, num, addrs, ids, nick_names);
    return (num, addrs, num, ids, num, nick_names);
}

func _build_all_fans_array{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    sbt_addr: felt,sbt_owner: felt, current_index: felt, num: felt, addrs: felt*, ids: felt*, nick_names: felt*
) -> (addrs: felt*, ids: felt*, nick_names: felt*) {
    alloc_locals;
    if (current_index == num) {
        return (addrs,ids,nick_names);
    }
    let (account) = _sbt_fans.read(sbt_owner,current_index);
    let (tokenId) = ISBT.tokenIdOf(contract_address=sbt_addr, account=account);
    let (id) = _account_id_map.read(account);
    let (nick_name) = _nick_name_map.read(account);
    
    let (is_id_equal_to_zero) = uint256_eq(tokenId, Uint256(0, 0));
    if(is_id_equal_to_zero==1){
        assert [addrs] = 0;
    } else {
        assert [addrs] = account;
    }
    assert [ids] = id;
    assert [nick_names] = nick_name;

    return _build_all_fans_array(sbt_addr,sbt_owner,current_index + 1, num, addrs + 1, ids + 1, nick_names + 1);
}

@view
func get_all_accounts{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(begin_index: felt, end_index: felt) -> (
    addrs_len: felt, addrs: felt*, ids_len: felt, ids: felt*, nick_names_len: felt, nick_names: felt*
) {
    alloc_locals;
    let page_size = end_index - begin_index;
    let (local addrs: felt*) = alloc();
    let (local ids: felt*) = alloc();
    let (local nick_names: felt*) = alloc();
    _build_all_accounts_array(begin_index, end_index, addrs, ids, nick_names);
    return (page_size, addrs, page_size, ids, page_size, nick_names);
}

func _build_all_accounts_array{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
   current_index: felt, end_index: felt, addrs: felt*, ids: felt*, nick_names: felt*
) -> (addrs: felt*, ids: felt*, nick_names: felt*) {
    alloc_locals;
    if (current_index == end_index) {
        return (addrs,ids,nick_names);
    }
    let (sbt) = _index_sbt_map.read(current_index);
    let (account) = _sbt_account_map.read(sbt);
    let (id) = _account_id_map.read(account);
    let (nick_name) = _nick_name_map.read(account);
    
    assert [addrs] = account;
    assert [ids] = id;
    assert [nick_names] = nick_name;
    return _build_all_accounts_array(current_index + 1, end_index, addrs + 1, ids + 1, nick_names + 1);
}
