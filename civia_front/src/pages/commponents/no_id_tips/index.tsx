import { FC, useState } from 'react';
import { List, SpinLoading } from 'antd-mobile';
import { TravelOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
import { registerAccountInfoTrans, registerAccountInfoTransAndApprove } from '@src/ui/account/accountCommon.service';
import { useGetAccountInfo } from '@src/hooks/useAccount';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { useActions } from '@argentx/packages/extension/src/ui/features/actions/actions.state';
import { useNavigate } from 'react-router-dom';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';
import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import {
    openBlockExplorerAddress,
    openBlockExplorerTransaction
} from '@argentx/packages/extension/src/ui/services/blockExplorer.service';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';

const StyledList = styled(List)`
    --align-items: top;
    --size:48px;
    --border-top: 0;
    --padding-left:0;
    --padding-right:0;
    --font-size: var(--adm-font-size-6);
    --border-bottom: 0;
    --adm-color-background: transparent;
    background: #efefef;
    border-radius: 15px;
    padding:0 5px;
    position:relative;
    word-break:break-all;
    .adm-list-item-content-prefix{
        padding: 10px 10px 0 0;
        .adm-avatar{
            border-radius:30px;
        }
    }
    .adm-list-item-content-main{
        padding: 10px 0;
    }
`;

const StyledListItem = styled(List.Item)`
`;

const StyledLoading = styled.div`
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    margin-left: -10px;
    margin-top: -10px;
    --adm-color-weak: var(--adm-color-primary);
`;

const StyledMessage = styled.div`
    .gray, .link{
        display: inline-block;
        padding: 0 4px;
    }
    .gray{
        color:var(--adm-color-weak);
    }
    .link{
        color: var(--color-primary);
        &:hover{
            color:var(--color-hover);
        }
        &:active{
            color:var(--color-active);
        }
    }
`;

const StyledDivider = styled.div`
    color: var(--adm-color-weak);
    font-size: 16px;
    margin: 8px 0;
`;

export const NoIdTips: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as Account;
    const network = useCurrentNetwork();
    const { transactions, pendingTransactions } = useAccountTransactions(account);
    const { accountInfoData = {}, accountInfoValidating, mutate } = useGetAccountInfo(account, account.address);

    const failerTransaction = transactions.filter(item => {
        const { status, meta = {}, failureReason } = item;
        if (status === 'REJECTED') {
            const title = meta.title;
            if (title === 'Register and create sbt') {
                return true;
            }
        }
        return false;
    });

    const isOnRegistTransaction = pendingTransactions.filter(item => {
        const { status, meta = {}, failureReason } = item;
        const title = meta.title;
        if (title === 'Register and create sbt') {
            return true;
        }
        return false;
    });

    const handleContinue = async () => {
        const res = await registerAccountInfoTransAndApprove(account.address);
        // navigate('/dapp');
    };

    return (
        <>
            <StyledList>
                <StyledListItem
                    prefix={<TravelOutline fontSize={40} />}
                >
                    <StyledMessage>
                        <div style={{ wordBreak: 'break-all' }}>
                        Create your Civia nickname to initialize your account and activate all Civia functions.
                        A minimum deposit of 0.00001 ETH is required in your wallet. After the deposit, please click “Continue” to proceed with the account setup.
                            <a className='link' onClick={handleContinue}>Continue</a>
                        </div>
                        {
                            failerTransaction.length > 0 ? (
                                <>
                                    <StyledDivider>Some exception occurred and please try again later:</StyledDivider>
                                    {
                                        failerTransaction.map(item => (
                                            <div key={item.hash}>
                                                {item?.failureReason?.code}({item?.failureReason?.error_message})<a className='link' onClick={() => { openBlockExplorerTransaction(item.hash, network); }} >{formatTruncatedAddress(item.hash)}</a>
                                            </div>
                                        ))
                                    }
                                </>
                            ) : null
                        }
                    </StyledMessage>
                </StyledListItem>
                {
                    isOnRegistTransaction.length ? (
                        <StyledLoading><SpinLoading /></StyledLoading>
                    ) : null
                }
            </StyledList>
        </>
    );
};
