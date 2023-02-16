import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CapsuleTabs, List, Empty, Image, Button } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import styled from 'styled-components';

import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import { useAddressBook } from '@argentx/packages/extension/src/ui/services/addressBook';
//
import {
    getAccountName,
    useAccountMetadata
} from '@argentx/packages/extension/src/ui/features/accounts/accountMetadata.state';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { getNetworkAccountImageUrl } from '@argentx/packages/extension/src/ui/features/accounts/accounts.service';

const StyledButton = styled(Button)`
    margin: 20px auto;
    display: block;
    border:1px solid #efefef;
    border-radius:100%;
    overflow:hidden;
`;

const StyleListBody = styled.div`
    max-height: 230px;
    overflow: scroll;
    overflow-x:hidden;
    scroll-behavior: smooth;
    ::-webkit-scrollbar {
        display: none;
    }
`;

const AddressPanelCom: FC<any> = ({ onChange }) => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;

    const { id: currentNetworkId } = useCurrentNetwork();
    const addressBook = useAddressBook(account?.networkId || currentNetworkId);
    const { accountNames } = useAccountMetadata();

    const handleAddressClick = (item: any, type: number) => {
        onChange && onChange(item);
    };

    return (
        <div>
            <CapsuleTabs defaultActiveKey='1'>
                <CapsuleTabs.Tab title='Address' key='1'>
                    <StyleListBody>
                        <List style={{ '--border-top': '0px' }}>

                            {
                                addressBook.contacts.length ? addressBook.contacts.map((item, index) => (
                                    <List.Item key={index}
                                        prefix={
                                            <Image
                                                src={getNetworkAccountImageUrl({
                                                    accountName: item.name,
                                                    accountAddress: item.address,
                                                    networkId: item.networkId
                                                })}
                                                style={{ borderRadius: 12 }}
                                                fit='cover'
                                                width={24}
                                                height={24}
                                            />
                                        }
                                        description={formatTruncatedAddress(item.address)} clickable onClick={() => { handleAddressClick(item, 1); }} arrow={false}>{item.name}</List.Item>
                                )) : <Empty />
                            }
                        </List>
                        <StyledButton onClick={() => { navigate('/settings/address_book'); }}><AddOutline /></StyledButton>
                    </StyleListBody>
                </CapsuleTabs.Tab>
                <CapsuleTabs.Tab title='My accounts' key='2'>
                    <StyleListBody>
                        <List style={{ '--border-top': '0px' }}>

                            {
                                addressBook.userAccounts.length ? addressBook.userAccounts.map((item, index) => (
                                    <List.Item key={index}
                                        prefix={
                                            <Image
                                                src={getNetworkAccountImageUrl({
                                                    accountName: getAccountName(item, accountNames),
                                                    accountAddress: item.address,
                                                    networkId: item.networkId
                                                })}
                                                style={{ borderRadius: 12 }}
                                                fit='cover'
                                                width={24}
                                                height={24}
                                            />
                                        }
                                        description={formatTruncatedAddress(item.address)} clickable onClick={() => { handleAddressClick(item, 1); }} arrow={false}>{getAccountName(item, accountNames)}</List.Item>
                                )) : <Empty />
                            }

                        </List>
                    </StyleListBody>
                </CapsuleTabs.Tab>
            </CapsuleTabs>
        </div>
    );
};

export default AddressPanelCom;
