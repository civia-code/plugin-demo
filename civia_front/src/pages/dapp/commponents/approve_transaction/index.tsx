// @ts-nocheck
import React, { FC, useState, useCallback, Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Card, Button, Toast, Grid, Dropdown } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
//
import { LoadingCom } from '@src/pages/commponents';
import { useGetTransaction } from '@src/hooks/useTransaction';
import FeeEstimationCom from '../fee_estimation';
import { Call, number } from 'starknet';
import { waitForMessage } from '@argentx/packages/extension/src/shared/messages';
import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { useSelectedAccount, useAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { approveAction, rejectAction } from '@argentx/packages/extension/src/ui/services/backgroundActions';
import { EXTENSION_IS_POPUP } from '@argentx/packages/extension/src/ui/features/browser/constants';
import { useTokensInNetwork, useNetworkFeeToken } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { useTransactionReview } from '@argentx/packages/extension/src/ui/features/actions/transaction/useTransactionReview';
import { useFeeTokenBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';
import { useMaxFeeEstimation } from '@argentx/packages/extension/src/ui/features/actions/feeEstimation/utils';
import { prettifyTokenAmount } from '@argentx/packages/extension/src/shared/token/price';

import TransactionsListCom from '../transactions_list';

const StyledBody = styled.div`
    min-height:200px;
    max-width:320px;
    margin: 10px auto;
    .adm-dropdown-item-title-text {
        font-size: 16px;
    }
    .adm-dropdown-popup .adm-dropdown-popup-mask {
        background: #fff!important;
    }
    .adm-dropdown-item .adm-dropdown-item-title-text {
        white-space: normal;
        /* text-align: center; */
    }
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledH5 = styled.h5`
    font-size:16px;
    padding: 15px 0;
    text-align:center;
    a {
        margin-left: 5px;
        color:#4CD130;
        svg {
            font-size: 14px;
        }
    }
`;

const StyledCard = styled(Card)`
    border:1px solid #efefef;
    margin: 1px 8px 8px;
    .adm-list-item{
        padding-left: 4px;
    }
    .adm-list-item-content{
        padding-right:0;
    }
    .adm-list-item:nth-of-type(1){
        .adm-list-item-content{
            border-top: 0;
        }
    }
`;

const StyledGroup1 = styled.div`
    max-height: 250px;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-bottom: 10px;
    scrollbar-width: none; /* firefox */
    &::-webkit-scrollbar {
        width: 0!important;
        height: 0!important;
        display: none;
    }
`;

const StyledButton = styled(Button)`
    border-radius: 20px;
    padding: 10px 12px;
`;

type mode = 'dialog' | 'page';

const AproveTransactionCom: FC<any> = ({ actions, mode = 'page', onReject, onApprove, simple }) => {
    const [action] = actions;
    const isLastAction = actions.length === 1;
    const navigate = useNavigate();
    const [isApproveing, setIsApproveing] = useState(false);
    const { payload: { transactions } } = actions[0];
    console.log('transactions -----', transactions);
    const selectedAccount = useSelectedAccount() as any;
    const { switcherNetworkId } = useAppState();
    const tokensByNetwork = useTokensInNetwork(switcherNetworkId);
    const { refreshTransactions } = useGetTransaction();
    const account = useAccount({ address: selectedAccount.address, networkId: selectedAccount.networkId });
    const { feeTokenBalance } = useFeeTokenBalance(account);
    const feeToken = useNetworkFeeToken(selectedAccount.networkId);
    console.log('action.meta.hash -----', action.meta.hash);
    const { fee, error } = useMaxFeeEstimation(transactions, action.meta.hash);
    console.log('fee -----', fee);
    const totalMaxFee = useMemo(() => {
        if (selectedAccount.needsDeploy && fee?.maxADFee) {
            return number.toHex(
                number.toBN(fee?.maxADFee).add(number.toBN(fee?.suggestedMaxFee))
            );
        }
        return fee?.suggestedMaxFee;
    }, [selectedAccount.needsDeploy, fee?.maxADFee, fee?.suggestedMaxFee]);

    const enoughBalance = useMemo(
        () => Boolean(totalMaxFee && feeTokenBalance?.gte(totalMaxFee)),
        [feeTokenBalance, totalMaxFee]
    );

    const serviceCharge = feeToken
        ? prettifyTokenAmount({
            amount: fee?.amount,
            decimals: feeToken.decimals,
            symbol: feeToken.symbol
        })
        : `${fee?.suggestedMaxFee} Unknown`;

    const { data: transactionReview } = useTransactionReview({
        account: selectedAccount,
        transactions,
        actionHash: action.meta.hash
    });

    const maxServiceCharge = feeToken
        ? prettifyTokenAmount({
            amount: fee?.suggestedMaxFee,
            decimals: feeToken.decimals,
            symbol: feeToken.symbol
        })
        : `${fee.suggestedMaxFee} Unknown`;

    const handleDropChange = (key: string) => {
        if (key) {
            setTimeout(() => {
                const ele = document.querySelector('.adm-dropdown-popup-mask');
                console.log('ele ---', ele);
                if (ele) ele.style.background = '#fff';
                const ele2 = document.querySelector('.adm-dropdown-popup');
                console.log('ele2', ele2);
                if (ele2) {
                    if (mode === 'page') {
                        ele2.style.width = '100%';
                    } else {
                        ele2.style.width = '73.5%';
                        ele2.style.margin = 'auto';
                    }
                }
            }, 50);
        }
    };

    const closePopupIfLastAction = useCallback(() => {
        if (EXTENSION_IS_POPUP && isLastAction) {
            window.close();
        } else {
            navigate('/account/tokens');
        }
    }, [isLastAction, navigate]);

    const handleReject = useCallback(async () => {
        try {
            await rejectAction(action.meta.hash);
        } catch (err) {
            console.log(err);
        } finally {
            await refreshTransactions();
        }
        if (mode === 'page') {
            closePopupIfLastAction();
        } else {
            onReject && onReject();
        }
    }, [action, closePopupIfLastAction, refreshTransactions, mode, onReject]);

    const handleApprove = async () => {
        setIsApproveing(true);
        await approveAction(action);
        useAppState.setState({ isLoading: true });
        const result = await Promise.race([
            waitForMessage(
                'TRANSACTION_SUBMITTED',
                ({ data }) => data.actionHash === action.meta.hash
            ),
            waitForMessage(
                'TRANSACTION_FAILED',
                ({ data }) => data.actionHash === action.meta.hash
            )
        ]);
        console.log(result);
        // (await) blocking as the window may closes afterwards
        if ('error' in result) {
            useAppState.setState({
                error: `Sending transaction failed: ${result.error}`,
                isLoading: false
            });
            // navigate('/404');
            Toast.show({ content: result.error });
            console.log('transaction-error');
            console.log(result);
            setIsApproveing(false);
            if (mode === 'page') {
                closePopupIfLastAction();
            } else {
                onApprove && onApprove(result);
            }
        } else {
            setIsApproveing(false);
            if (mode === 'page') {
                closePopupIfLastAction();
            } else {
                onApprove && onApprove();
            }
            useAppState.setState({ isLoading: false });
        }
    };

    const StyledGroup = mode === 'page' ? Fragment : StyledGroup1;

    return (
        <div>
            <StyledBody>
                {
                    mode === 'page' ? (
                        <StyledH3>Review action</StyledH3>
                    ) : null
                }
                <Dropdown onChange={(e: any) => handleDropChange(e)}>
                    <Dropdown.Item key='detail' title='You need to pay a service charge'>
                        <div style={{ padding: 12 }}>
                            <List style={{ '--border-bottom': '0', '--border-top': '0' }}>
                                {
                                    !simple && (
                                        <StyledGroup>
                                            <TransactionsListCom
                                                networkId={switcherNetworkId}
                                                transactions={transactions}
                                                transactionReview={transactionReview}
                                                tokensByNetwork={tokensByNetwork}
                                            >
                                                {
                                                    (item: React.ReactElement, index: number) => <StyledCard key={index}>{item}</StyledCard>
                                                }
                                            </TransactionsListCom>
                                        </StyledGroup>
                                    )
                                }
                                <StyledCard>
                                    <FeeEstimationCom
                                        account={account}
                                        // accountAddress={selectedAccount.address}
                                        networkId={selectedAccount.networkId}
                                        // transactions={transactions}
                                        // actionHash={action.meta.hash}
                                        feeTokenBalance={feeTokenBalance}
                                        enoughBalance={enoughBalance}
                                        totalMaxFee={totalMaxFee}
                                        feeToken={feeToken}
                                        fee={fee}
                                        error={error}
                                    />
                                </StyledCard>
                            </List>
                        </div>
                    </Dropdown.Item>
                </Dropdown>
                {!enoughBalance && <StyledH5>
                    Gas fee for this operation is
                    <p style={{ color: '#4CD130', marginTop: 5 }}>~ {serviceCharge}</p>
                    <p style={{ color: '#4CD130', marginTop: 5 }}>Max ~ {maxServiceCharge}</p>
                </StyledH5>}
                {enoughBalance && <StyledH5>
                    <p style={{ color: '#4CD130', marginTop: 5 }}>~ {serviceCharge}</p>
                    <p style={{ color: '#4CD130', marginTop: 5 }}>Max ~ {maxServiceCharge}</p>
                </StyledH5>}
                <div style={{ margin: '0 10px' }}>
                    <Card >
                        <Grid columns={2} gap={32}>
                            <Grid.Item>
                                <StyledButton onClick={handleReject} block>Reject</StyledButton>
                            </Grid.Item>
                            <Grid.Item>
                                <StyledButton
                                    color='primary'
                                    onClick={handleApprove}
                                    disabled={!enoughBalance}
                                    block>
                                        Approve
                                </StyledButton>
                            </Grid.Item>
                        </Grid>
                    </Card>
                </div>

                <LoadingCom visible={isApproveing} />
            </StyledBody>
        </div>
    );
};

export default AproveTransactionCom;
