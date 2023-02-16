import { FC, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Button, List, Toast, Image, Empty, CenterPopup, Card, Dialog } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline, AddOutline } from 'antd-mobile-icons';
//
import styled from 'styled-components';
//
import { HeadSettingCom, NetworkSwitcherCom, LoadingCom, WindowWrapperCom, NavBarCom } from '@src/pages/commponents';

import { getAccountImageUrlByAddress } from '@src/ui/account/account.service';

import { getNetworkSelector } from '@argentx/packages/extension/src/shared/account/selectors';
import { defaultNetwork } from '@argentx/packages/extension/src/shared/network';
import { isDeprecated } from '@argentx/packages/extension/src/shared/wallet.service';
import { unhideAccount, accountStore } from '@argentx/packages/extension/src/shared/account/store';
import { WalletAccount } from '@argentx/packages/extension/src/shared/wallet.model';
import { useArrayStorage } from '@argentx/packages/extension/src/shared/storage/hooks';
//
import { recover } from '@argentx/packages/extension/src/ui/features/recovery/recovery.service';
import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { useSelectedAccountStore } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import { createAccount, getNetworkAccountImageUrl } from '@argentx/packages/extension/src/ui/features/accounts/accounts.service';
import { connectAccount } from '@argentx/packages/extension/src/ui/services/backgroundAccounts';
import { getAccountName, useAccountMetadata } from '@argentx/packages/extension/src/ui/features/accounts/accountMetadata.state';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 30px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledGrayBtn = styled.div`
    svg{
        path{
            fill: #4A4A4A!important;
        }
    }
`;

const StyledList = styled(List)`
    margin:20px auto;
    width: 80%;
`;

const StyledButton = styled(Button)`
    margin: 0 auto;
    display: block;
    border:1px solid #efefef;
    border-radius:100%;
    overflow:hidden;
`;

const StyledHidenLink = styled(Button)`
    margin:auto;
    display: block;
    color: #999;
    font-size: 12px;
`;

export const mapWalletAccountsToAccounts = (
    walletAccounts: WalletAccount[]
): Account[] => {
    return walletAccounts.map(
        (walletAccount) =>
            new Account({
                address: walletAccount.address,
                network: walletAccount.network,
                signer: walletAccount.signer,
                hidden: walletAccount.hidden,
                type: walletAccount.type
            })
    );
};

const AccountListPage = () => {
    const navigate = useNavigate();
    const [isAccountCreating, setIsAccountCreating] = useState(false);
    const [isShowHiddenAccount, setIsShowHiddenAccount] = useState(false);
    //
    const { switcherNetworkId } = useAppState();
    const network = useCurrentNetwork();
    const allAccounts = useArrayStorage(accountStore);

    const { accountNames } = useAccountMetadata();

    const [accounts, hiddeAccounts] = useMemo(() => {
        return allAccounts.filter(getNetworkSelector(network.id ?? defaultNetwork.id)).reduce(([accounts, hiddeAccounts]: any, item: any) => {
            item.hidden ? hiddeAccounts.push(item) : accounts.push(item);
            return [accounts, hiddeAccounts];
        }, [[], []]);
    }, [allAccounts, network.id]);

    const handleClick = async () => {
        setIsAccountCreating(true);
        try {
            const newAccount = await createAccount(switcherNetworkId);
            connectAccount(newAccount);
            navigate(await recover());
        } catch (err: any) {
            Toast.show(err.toString());
        } finally {
            setIsAccountCreating(false);
        }
    };

    const mapedAccount = mapWalletAccountsToAccounts(accounts);

    return (
        <WindowWrapperCom>
            <NavBarCom
                left={
                    <StyledGrayBtn onClick={() => { navigate('/settings/panel'); }}>{NavBarCom.Logo}</StyledGrayBtn>
                }
                right={<div style={{ position: 'absolute', top: '22px', right: '22px' }}><NetworkSwitcherCom netWorkListMenuStyle={{ left: 'unset' }} disabled /></div>}
            />
            <StyledBody>
                <StyledH3>Accounts</StyledH3>
                <StyledList>
                    {
                        mapedAccount.length ? (
                            mapedAccount.map((account, index) => (
                                <List.Item
                                    key={account.address}
                                    prefix={
                                        <Image
                                            src={getAccountImageUrlByAddress({ accountAddress: account.address })}
                                            style={{ borderRadius: 20 }}
                                            fit='cover'
                                            width={40}
                                            height={40}
                                        />
                                    }
                                    onClick={() => {
                                        useSelectedAccountStore.setState({
                                            selectedAccount: account,
                                            showMigrationScreen: account ? isDeprecated(account) : false
                                        });
                                        connectAccount(account);
                                        navigate('/account/initial');
                                    }}
                                    arrow={false}
                                    description={formatTruncatedAddress(account.address)}
                                >
                                    {getAccountName(account, accountNames)}
                                </List.Item>
                            ))
                        ) : (<Empty />)
                    }
                    {
                        hiddeAccounts.length ? (
                            <List.Item>
                                <StyledHidenLink fill='none' size='small' onClick={() => { setIsShowHiddenAccount(true); }}><EyeInvisibleOutline />&nbsp;Hidden accounts</StyledHidenLink>
                            </List.Item>
                        ) : (null)
                    }
                </StyledList>
                <Dialog
                    visible={isShowHiddenAccount}
                    closeOnMaskClick
                    onClose={() => { setIsShowHiddenAccount(false); }}
                    content={
                        (
                            <Card title='Hidden Accounts'>
                                <List style={{ '--border-top': '0px' }}>
                                    {
                                        hiddeAccounts.map((account: any, index: any) => (
                                            <List.Item
                                                key={account.address}
                                                prefix={
                                                    <Image
                                                        src={getAccountImageUrlByAddress({ accountAddress: account.address })}
                                                        style={{ borderRadius: 20 }}
                                                        fit='cover'
                                                        width={40}
                                                        height={40}
                                                    />
                                                }
                                                onClick={() => {
                                                    setIsShowHiddenAccount(false);
                                                    setTimeout(() => {
                                                        unhideAccount(account);
                                                    }, 100);
                                                }}
                                                arrow={false}
                                                description={formatTruncatedAddress(account.address)}
                                                extra={<EyeOutline fontSize={24} />}
                                            >
                                                {getAccountName(account, accountNames)}
                                            </List.Item>
                                        ))
                                    }
                                </List>
                            </Card>
                        )
                    }
                />
                <div style={{ padding: '20px 0' }}>
                    <StyledButton onClick={handleClick}><AddOutline /></StyledButton>
                </div>
                <LoadingCom visible={isAccountCreating} />
            </StyledBody>
        </WindowWrapperCom>
    );
};

export default AccountListPage;
