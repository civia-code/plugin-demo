import { FC, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, Button, List, CapsuleTabs, Input, Empty, Image } from 'antd-mobile';
import { CloseCircleOutline } from 'antd-mobile-icons';
import { BigNumber } from 'ethers';
import styled from 'styled-components';
//
import useProxySendTransaction from '@src/hooks/useTransaction';
//
import AddressPanelCom from '@src/pages/commponents/address_panel';
//
import { AddressBookContact } from '@argentx/packages/extension/src/shared/addressBook';
//
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { getAccountName, useAccountMetadata } from '@argentx/packages/extension/src/ui/features/accounts/accountMetadata.state';
import { getNetworkAccountImageUrl } from '@argentx/packages/extension/src/ui/features/accounts/accounts.service';

import { getUint256CalldataFromBN } from '@argentx/packages/extension/src/ui/services/transactions';

const StyledListItem2 = styled(List.Item)`
    border: 1px solid #eee;
    margin: 12px 20px;
    padding: 0 10px 0 20px;
    border-radius: 3px;
`;

const StyledItemWrapper = styled.div`
    position:relative;
    display:flex;
    align-items: center;
    >div{
        vertical-align: middle;
       

        &:nth-of-type(1){
            width:100%;
        }
        &:nth-of-type(2){
            
        }
    }
`;

const StyledMax = styled.div`
    display: flex;

    Button{
        border-radius: 25px;
        min-width:25px;
        height:100%;
        color:#fff;
        padding:0 5px;
        margin:0 5px;
    }
`;

const NftSendCom: FC<any> = ({ contractAddress, nftDetail }) => {
    const account = useSelectedAccount();
    const navigate = useNavigate();
    const { sendTransaction: proxySendTransaction } = useProxySendTransaction();
    const [address, setAddress] = useState<string|undefined>();
    const [addressBookRecipient, setAddressBookRecipient] = useState<Account | AddressBookContact | undefined>();

    const { accountNames } = useAccountMetadata();

    const accountName = useMemo(
        () =>
            addressBookRecipient
                ? 'name' in addressBookRecipient
                    ? addressBookRecipient.name
                    : getAccountName(addressBookRecipient, accountNames)
                : undefined,
        [accountNames, addressBookRecipient]
    );

    const handleSendClick = async () => {
        const res = await proxySendTransaction({
            to: contractAddress,
            method: 'transferFrom',
            calldata: {
                from_: account!.address,
                to: address! || addressBookRecipient?.address!,
                tokenId: getUint256CalldataFromBN(BigNumber.from(nftDetail.token_id))
            }
        });
        console.log(res);
        navigate('/dapp');
    };

    return (
        <>
            {
                addressBookRecipient && accountName ? (

                    <StyledListItem2 prefix={
                        <Image
                            src={getNetworkAccountImageUrl({
                                accountName,
                                accountAddress: addressBookRecipient.address,
                                networkId: addressBookRecipient.networkId,
                                backgroundColor: (addressBookRecipient as Account).hidden ? '333332' : undefined
                            })}
                            style={{ borderRadius: 12 }}
                            fit='cover'
                            width={24}
                            height={24}
                        />
                    }>
                        <StyledItemWrapper>
                            <div>
                                <div>{accountName}</div>
                                <div style={{ fontSize: 12 }}>{formatTruncatedAddress(addressBookRecipient.address)}</div>
                            </div>
                            <div onClick={() => { setAddressBookRecipient(undefined); }}>
                                <CloseCircleOutline />
                            </div>
                        </StyledItemWrapper>
                    </StyledListItem2>

                ) : (
                    <StyledListItem2>
                        <StyledItemWrapper>
                            <div>
                                <Input value={address} onChange={(val) => { setAddress(val); }} placeholder={'Recipient\'s address'} />
                            </div>
                            <div>
                                <StyledMax>
                                    <div>
                                        <Popover
                                            trigger='click'
                                            content={<AddressPanelCom onChange={(account: Account) => {
                                                setAddress(undefined);
                                                setAddressBookRecipient(account);
                                            }}
                                            />}
                                        >
                                            <Button color='primary'>@</Button>
                                        </Popover>
                                    </div>
                                </StyledMax>
                            </div>
                        </StyledItemWrapper>
                    </StyledListItem2>
                )
            }
            <List.Item>
                <Button color='primary' onClick={handleSendClick} block disabled={!(addressBookRecipient || address)} style={{ borderRadius: '20px', padding: '10px 12px' }}>Next</Button>
            </List.Item>
        </>
    );
};

export default NftSendCom;
