import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, Dialog, Card, List } from 'antd-mobile';
import { MoreOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
//
import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
//
import { hideAccount } from '@argentx/packages/extension/src/shared/account/store';
//
import { openBlockExplorerAddress, useBlockExplorerTitle } from '@argentx/packages/extension/src/ui/services/blockExplorer.service';
//

const AccountGrooupArror = styled.div`
    width:50px;
    text-align: center;
    align-content: center;
`;

const StyledPopoverMenu = styled(Popover.Menu)`
    text-align:right;
    .adm-popover-menu-item-text{
        padding: 6px 20px 6px 0;
    }
`;
const StyledMoreOutline = styled(MoreOutline)`
    font-size:20px;
    transform: rotate(90deg);
`;

const StyledListItem = styled(List.Item)`
    font-size:12px;
    color:#999;
`;

const AccountSettingCom: FC<any> = ({ account }: any) => {
    const navigate = useNavigate();
    const currentNetwork = useCurrentNetwork();
    const blockExplorerTitle = useBlockExplorerTitle();

    const handleClick = (item: any) => {
        console.log(account);
        if (item.key === '2') {
            openBlockExplorerAddress(currentNetwork, account.address);
        } else if (item.key === '3') {
            Dialog.show({
                content: (
                    <Card title='Hide Account'>
                        <List style={{ '--border-inner': '0px', '--border-bottom': '0px', '--border-top': '0px' }}>
                            <StyledListItem>You are about to hide the following account:</StyledListItem>
                            <List.Item style={{ wordBreak: 'break-all' }}>{account.address}</List.Item>
                            <StyledListItem>You will be able to unhide the account from the account list screen.</StyledListItem>
                        </List>
                    </Card>
                ),
                actions: [[
                    {
                        key: 'cancel',
                        text: 'Cancel',
                        className: 'adm-button-default adm-button-shape-default',
                        onClick: () => { Dialog.clear(); }
                    },
                    {
                        key: 'hide',
                        text: 'Hide',
                        onClick: async () => {
                            await hideAccount({
                                address: account.address,
                                networkId: account.networkId
                            });
                            Dialog.clear();
                            return navigate('/account/list');
                        }
                    }
                ]]
            });
        } else if (item.key === '4') {
            navigate('/account/export_private_key');
        }
    };
    return (
        <AccountGrooupArror>
            <StyledPopoverMenu
                actions={[
                    { key: '1', text: 'Profile', disabled: true },
                    { key: '2', text: `View On ${blockExplorerTitle}` },
                    { key: '3', text: 'Hide account' },
                    { key: '4', text: 'Export key to other' }
                ]}
                onAction={handleClick}
                trigger='click'
                placement='bottom-end'
            >
                <StyledMoreOutline />
            </StyledPopoverMenu>
        </AccountGrooupArror>
    );
};

export default AccountSettingCom;
