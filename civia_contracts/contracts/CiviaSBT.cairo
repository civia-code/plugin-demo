%lang starknet

from starkware.starknet.common.syscalls import get_caller_address

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.uint256 import (Uint256, uint256_eq)
from starkware.cairo.common.math import assert_not_zero, assert_not_equal
from starkware.cairo.common.bool import TRUE, FALSE

from openzeppelin.access.ownable.library import Ownable
from openzeppelin.security.pausable.library import Pausable
from openzeppelin.token.erc721.library import ERC721



@storage_var
func _tokenMap(account: felt) -> (tokenId: Uint256) {
}

@storage_var
func _tokenIdCount() -> (id: felt) {
}

@storage_var
func _mgr() -> (mgr: felt) {
}



//
// Constructor
//

@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    name: felt, symbol: felt, owner: felt, mgr: felt
) {
    ERC721.initializer(name, symbol);
    Ownable.initializer(owner);
    _tokenIdCount.write(0);
    _mgr.write(mgr);
    return ();
}

func assert_only_mgr{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
        let (mgr) = _mgr.read();
        let (caller) = get_caller_address();
        with_attr error_message("caller is not the mgr") {
            assert mgr = caller;
        }
        return ();
}

//
// Getters
//

@view
func name{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (name: felt) {
    return ERC721.name();
}

@view
func symbol{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (symbol: felt) {
    return ERC721.symbol();
}

@view
func balanceOf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(owner: felt) -> (
    balance: Uint256
) {
    return ERC721.balance_of(owner);
}

@view
func ownerOf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(tokenId: Uint256) -> (
    owner: felt
) {
    return ERC721.owner_of(tokenId);
}

@view
func tokenIdOf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(account: felt) -> (
    tokenId: Uint256
) {
    return _tokenMap.read(account);
}

// @view
// func getApproved{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
//     tokenId: Uint256
// ) -> (approved: felt) {
//     return ERC721.get_approved(tokenId);
// }

// @view
// func isApprovedForAll{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
//     owner: felt, operator: felt
// ) -> (isApproved: felt) {
//     let (isApproved: felt) = ERC721.is_approved_for_all(owner, operator);
//     return (isApproved=isApproved);
// }

@view
func tokenURI{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    tokenId: Uint256
) -> (tokenURI: felt) {
    let (tokenURI: felt) = ERC721.token_uri(tokenId);
    return (tokenURI=tokenURI);
}

@view
func owner{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (owner: felt) {
    return Ownable.owner();
}

@view
func paused{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (paused: felt) {
    return Pausable.is_paused();
}

//
// Externals
//

// @external
// func approve{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
//     to: felt, tokenId: Uint256
// ) {
//     Pausable.assert_not_paused();
//     ERC721.approve(to, tokenId);
//     return ();
// }

// @external
// func setApprovalForAll{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
//     operator: felt, approved: felt
// ) {
//     Pausable.assert_not_paused();
//     ERC721.set_approval_for_all(operator, approved);
//     return ();
// }

// @external
// func transferFrom{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
//     from_: felt, to: felt, tokenId: Uint256
// ) {
//     Pausable.assert_not_paused();
//     ERC721.transfer_from(from_, to, tokenId);
//     return ();
// }

// @external
// func safeTransferFrom{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
//     from_: felt, to: felt, tokenId: Uint256, data_len: felt, data: felt*
// ) {
//     Pausable.assert_not_paused();
//     ERC721.safe_transfer_from(from_, to, tokenId, data_len, data);
//     return ();
// }



@external
func setTokenURI{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    tokenId: Uint256, tokenURI: felt
) {
    Ownable.assert_only_owner();
    ERC721._set_token_uri(tokenId, tokenURI);
    return ();
}

@external
func transferOwnership{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    newOwner: felt
) {
    Ownable.transfer_ownership(newOwner);
    return ();
}

@external
func renounceOwnership{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    Ownable.renounce_ownership();
    return ();
}

@external
func pause{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    Ownable.assert_only_owner();
    Pausable._pause();
    return ();
}

@external
func unpause{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    Ownable.assert_only_owner();
    Pausable._unpause();
    return ();
}

// @external
// func burn{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(tokenId: Uint256) {
//     //ERC721.assert_only_token_owner(tokenId);
//     assert_only_mgr();

//     let (account) = ERC721.owner_of(tokenId);
//     _tokenMap.write(account,0);

//     ERC721._burn(tokenId);
//     return ();
// }

@external
func mint{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    to: felt
) {
    alloc_locals;
    Pausable.assert_not_paused();
    //Ownable.assert_only_owner();
    assert_only_mgr();

    let (local tokenId: Uint256) = _tokenMap.read(to); 

    let (is_id_equal_to_zero) = uint256_eq(tokenId, Uint256(0, 0));

    with_attr error_message("SBT already exists") {
        assert is_id_equal_to_zero = 1;
    }

    let (tokenIdCount) = _tokenIdCount.read();

    _tokenIdCount.write(tokenIdCount + 1);
    _tokenMap.write(to,Uint256(tokenIdCount + 1,0));

    ERC721._mint(to, Uint256(tokenIdCount + 1,0));
    return ();
}

@external
func burn{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(account: felt) {
    alloc_locals;
    assert_only_mgr();

    let (local tokenId: Uint256) = _tokenMap.read(account);
    let (is_id_equal_to_zero) = uint256_eq(tokenId, Uint256(0, 0));
    with_attr error_message("account not have sbt") {
        assert is_id_equal_to_zero = 0;
    }
    _tokenMap.write(account,Uint256(0,0));
    ERC721._burn(tokenId);
    return ();
}
