import { FC, useState, useEffect } from 'react';
import { List, ProgressBar, Card, SpinLoading } from 'antd-mobile';
import { CheckCircleFill } from 'antd-mobile-icons';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import { useGetAccountInfo, IAccountInfoData, useGetUserFaucetGas, useAutoInitialAccount } from '@src/hooks/useAccount';
import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';

import { changeGuardiansTransAndApprove } from '@src/ui/account/account.service';

import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';

const StyledBodyWrapper = styled.div`
    --adm-color-background: transparent;
    background: rgba(249, 255, 247, 1);
    --body-wrapper-background: rgba(249, 255, 247, 1);
    height:100%;
    min-height: 100vh;
    left:0;
    top:0;
    width:100%;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
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

const StyledBody = styled.div`
     margin:0 32px;
     .adm-list-body{
        --border-bottom: 0px;
     }
`;

const StyledList = styled(List)`
    svg{
        vertical-align: -0.25em!important;
    }
`;

const StyledListItem = styled(List.Item)`

`;

const StyledSpinLoading = styled(SpinLoading)`
    --adm-color-weak: var(--adm-color-primary);
    margin: 32px auto;
`;

const StyledProgressBar = styled.div`
    width: 50%;
    margin: auto;
`;

const AccountInitialPage: FC<any> = () => {
    const account = useSelectedAccount() as Account;
    if (account) {
        return <AccountInitialBody account={account} />;
    } else {
        return null;
    }
};

const AccountInitialBody: FC<any> = ({ account }) => {
    const navigate = useNavigate();
    const [initialStep, setInitialStep] = useState(1);

    useGetUserFaucetGas(account);
    const { isBalanceEnougth } = useAutoInitialAccount(account);
    const { transactions, pendingTransactions } = useAccountTransactions(account);
    const { accountInfoData = {} } = useGetAccountInfo(account, account.address);
    const { idInfo = '0' } = accountInfoData as IAccountInfoData;

    console.log([initialStep, isBalanceEnougth, pendingTransactions.length, idInfo]);

    useEffect(() => {
        if (initialStep === 4) {
            const { address } = swrCacheProvider.get('inviteInfo') || {};
            changeGuardiansTransAndApprove(1, [address], account).then(res => {
                const storageKey = `${account?.address},guardians`;
                swrCacheProvider.set(storageKey, [{ addressResult: address }]);
            });
        }
    }, [initialStep, account]);

    useEffect(() => {
        swrCacheProvider.set(`${account.address},initializing`, 1);
    }, []);
    // step 1 => 2
    useEffect(() => {
        initialStep === 1 && isBalanceEnougth && setInitialStep(Math.max(initialStep, 2));
    }, [initialStep, isBalanceEnougth]);
    // step 2 => 3
    useEffect(() => {
        initialStep === 2 && pendingTransactions.length && setInitialStep(Math.max(initialStep, 3));
    }, [initialStep, pendingTransactions.length]);
    //
    // step 3 => 4
    useEffect(() => {
        idInfo.length > 3 && setInitialStep(Math.max(4));
    }, [idInfo]);

    // step 4 => 5
    useEffect(() => {
        const hasAddGuradiansTrans = transactions.some(item => {
            return ['ACCEPTED_ON_L1', 'ACCEPTED_ON_L2'].includes(item.status) && item.meta?.title === 'Add guardians';
        });
        initialStep === 4 && hasAddGuradiansTrans && setInitialStep(5);
    }, [initialStep, transactions]);

    if (initialStep >= 5) {
        swrCacheProvider.delete(`${account.address},initializing`);
        return <Navigate to='/account/home' />;
    }
    //
    return (
        <StyledBodyWrapper>
            <WindowWrapperCom>
                <WindowWrapperCom.Body>
                    <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                    <StyledBody >
                        <StyledH3>Create Account</StyledH3>
                        <Card>
                            <StyledList>
                                <StyledListItem prefix={<CheckCircleFill color={initialStep >= 1 ? 'var(--adm-color-primary)' : 'transparent'} />}>Create account</StyledListItem>
                                <StyledListItem prefix={<CheckCircleFill color={initialStep >= 2 ? 'var(--adm-color-primary)' : 'transparent'} />}>Receive initial gas</StyledListItem>
                                <StyledListItem prefix={<CheckCircleFill color={initialStep >= 3 ? 'var(--adm-color-primary)' : 'transparent'} />}>Initialize account</StyledListItem>
                                <StyledListItem prefix={<CheckCircleFill color={initialStep >= 5 ? 'var(--adm-color-primary)' : 'transparent'} />}>Follow inviter and set as guardian</StyledListItem>
                                <Card>
                                    <StyledListItem>
                                        <StyledProgressBar><ProgressBar percent={initialStep / 5 * 100} /></StyledProgressBar>
                                    </StyledListItem>
                                </Card>
                            </StyledList>
                        </Card>
                        <Card>
                            <StyledSpinLoading />
                        </Card>
                    </StyledBody>
                </WindowWrapperCom.Body>
            </WindowWrapperCom>
        </StyledBodyWrapper>
    );
};

export default AccountInitialPage;
