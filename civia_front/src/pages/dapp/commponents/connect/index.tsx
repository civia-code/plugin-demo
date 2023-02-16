import { FC, useState, useMemo, useCallback } from 'react';
import { Button, Card, Image, Grid, List } from 'antd-mobile';
import { CheckOutline, LinkOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
//
import { useDappDisplayAttributes } from '@argentx/packages/extension/src/ui/features/actions/connectDapp/useDappDisplayAttributes';
//
import { BaseWalletAccount } from '@argentx/packages/extension/src/shared/wallet.model';
import { accountsEqual } from '@argentx/packages/extension/src/shared/wallet.service';
import { useIsPreauthorized } from '@argentx/packages/extension/src/shared/preAuthorizations';
import { waitForMessage } from '@argentx/packages/extension/src/shared/messages';
//
import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { useAccounts, useSelectedAccountStore } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { getAccountName, useAccountMetadata } from '@argentx/packages/extension/src/ui/features/accounts/accountMetadata.state';
import { connectAccount } from '@argentx/packages/extension/src/ui/services/backgroundAccounts';
import { approveAction, rejectAction } from '@argentx/packages/extension/src/ui/services/backgroundActions';
import { EXTENSION_IS_POPUP } from '@argentx/packages/extension/src/ui/features/browser/constants';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { getNetworkAccountImageUrl } from '@argentx/packages/extension/src/ui/features/accounts/accounts.service';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledAccountItem = styled.div`
    display: flex;
    font-size:12px;
    width:150px;
    overflow:hidden;
    margin-right:50px;
    text-overflow: ellipsis;
`;

const ConnectCom: FC<any> = ({ host, actions }) => {
    const visibleAccounts = useAccounts();
    const dappDisplayAttributes: any = useDappDisplayAttributes(host) || {};
    const { selectedAccount: initiallySelectedAccount } = useSelectedAccountStore();

    const [connectedAccount, setConnectedAccount] = useState<BaseWalletAccount | undefined>(initiallySelectedAccount);
    const isConnected = useIsPreauthorized(host, initiallySelectedAccount);
    const { accountNames } = useAccountMetadata();

    const isLastAction = actions.length === 1;
    const [action] = actions;

    const selectedAccount = useMemo(() => {
        if (connectedAccount) {
            const account = visibleAccounts.find((account) =>
                accountsEqual(account, connectedAccount)
            );
            return account;
        }
    }, [visibleAccounts, connectedAccount]);

    const [checkedAccount, setCheckedAccount] = useState(selectedAccount);

    const closePopupIfLastAction = useCallback(() => {
        if (EXTENSION_IS_POPUP && isLastAction) {
            window.close();
        }
    }, [isLastAction]);

    const handleConfirm = async (values: any) => {
        if (selectedAccount) {
            useAppState.setState({ isLoading: true });
            useSelectedAccountStore.setState({
                selectedAccount: checkedAccount
            });
            connectAccount(checkedAccount as any);
            await waitForMessage('CONNECT_ACCOUNT_RES');
            await approveAction(action);
            await waitForMessage('CONNECT_DAPP_RES');
            useAppState.setState({ isLoading: false });
            closePopupIfLastAction();
        }
    };

    return (
        <div>
            <StyledBody>
                <StyledH3>Connect to {dappDisplayAttributes.title}</StyledH3>
                <List
                    header='Select the account to connect:'
                    style={{ '--border-bottom': '0', '--border-top': '0' }}>
                    <Card>
                        {
                            visibleAccounts.map((item, index) => (
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
                                    extra={
                                        <Button fill='none' style={{ '--text-color': (item.address === checkedAccount?.address ? 'var(--adm-color-primary)' : 'transparent') }}>
                                            <CheckOutline />
                                        </Button>
                                    }
                                    onClick={() => {
                                        setCheckedAccount(item);
                                    }}
                                    arrow={false}
                                >
                                    <StyledAccountItem>
                                        <div>{formatTruncatedAddress(item.address)}&nbsp;&nbsp;{isConnected ? <LinkOutline /> : null}</div>
                                    </StyledAccountItem>
                                </List.Item>
                            ))
                        }
                    </Card>
                    <List.Item style={{ fontSize: '12px' }}>
                        This dapp will be able to:
                        <ul style={{ margin: '10px 0 0 20px' }}>
                            <li>Read your wallet address</li>
                            <li>Request transactions</li>
                        </ul>
                    </List.Item>
                    <List.Item>
                        <Grid columns={2} gap={16}>
                            <Grid.Item>
                                <Button onClick={closePopupIfLastAction} block>Reject</Button>
                            </Grid.Item>
                            <Grid.Item>
                                <Button color='primary' onClick={handleConfirm} block>Connect</Button>
                            </Grid.Item>
                        </Grid>
                    </List.Item>
                </List>
            </StyledBody>
        </div>
    );
};

export default ConnectCom;
