import { FC, useState, useMemo, useEffect } from 'react';
import { List, Popover, SpinLoading } from 'antd-mobile';
import { CheckCircleFill, CloseCircleFill } from 'antd-mobile-icons';
import { Call, number } from 'starknet';
import styled from 'styled-components';

import { useAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { useTokenBalanceToCurrencyValue, useTokenAmountToCurrencyValue } from '@argentx/packages/extension/src/ui/features/accountTokens/tokenPriceHooks';
import { useFeeTokenBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';
import { useNetworkFeeToken } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { getParsedError, getTooltipText, useMaxFeeEstimation } from '@argentx/packages/extension/src/ui/features/actions/feeEstimation/utils';

import {
    prettifyCurrencyValue,
    prettifyTokenAmount
} from '@argentx/packages/extension/src/shared/token/price';

const StyledFeeList = styled.div`
    text-align:right;
`;

const IconStyle = {
    verticalAlign: '-0.175em',
    marginLeft: '4px'
};

const FeeEstimationCom: FC<any> = ({
    account,
    // accountAddress,
    // transactions,
    // actionHash,
    onErrorChange,
    networkId,
    feeTokenBalance,
    enoughBalance,
    totalMaxFee,
    fee,
    error
}: any) => {
    // const account = useAccount({ address: accountAddress, networkId });
    if (!account) {
        throw new Error('Account not found');
    }

    const [feeEstimateExpanded, setFeeEstimateExpanded] = useState(false);

    // const { feeTokenBalance } = useFeeTokenBalance(account);

    // const { fee, error } = useMaxFeeEstimation(transactions, actionHash);

    // const totalMaxFee = useMemo(() => {
    //     if (account.needsDeploy && fee?.maxADFee) {
    //         return number.toHex(
    //             number.toBN(fee.maxADFee).add(number.toBN(fee.suggestedMaxFee))
    //         );
    //     }
    //     return fee?.suggestedMaxFee;
    // }, [account.needsDeploy, fee?.maxADFee, fee?.suggestedMaxFee]);

    // const enoughBalance = useMemo(
    //     () => Boolean(totalMaxFee && feeTokenBalance?.gte(totalMaxFee)),
    //     [feeTokenBalance, totalMaxFee]
    // );

    const showFeeError = Boolean(fee && feeTokenBalance && !enoughBalance);
    const showEstimateError = Boolean(error);
    const showError = showFeeError || showEstimateError;

    const hasError = !fee || !feeTokenBalance || !enoughBalance || showError;
    useEffect(() => {
        onErrorChange?.(hasError);
    // only rerun when error changes
    }, [hasError]); // eslint-disable-line react-hooks/exhaustive-deps

    const parsedFeeEstimationError = showEstimateError && getParsedError(error);
    const feeToken = useNetworkFeeToken(networkId);
    const amountCurrencyValue = useTokenAmountToCurrencyValue(
        feeToken,
        fee?.amount
    );
    const suggestedMaxFeeCurrencyValue = useTokenAmountToCurrencyValue(
        feeToken,
        fee?.suggestedMaxFee
    );

    const tipContent = getTooltipText(fee?.suggestedMaxFee, feeTokenBalance);

    return (
        <List.Item
            description={
                <StyledFeeList>
                    {
                        fee ? (
                            <div>
                                <div style={{ color: '#333', fontSize: '18px' }}>
                                    {
                                        amountCurrencyValue !== undefined ? (
                                            <div>~{prettifyCurrencyValue(amountCurrencyValue)}</div>
                                        ) : (
                                            <div>
                                            ~
                                                {feeToken ? (
                                                    prettifyTokenAmount({
                                                        amount: fee.amount,
                                                        decimals: feeToken.decimals,
                                                        symbol: feeToken.symbol
                                                    })
                                                ) : (
                                                    <>{fee.amount} Unknown</>
                                                )}
                                            </div>
                                        )
                                    }
                                </div>
                                <div style={{ fontSize: '12px' }}>
                                    {suggestedMaxFeeCurrencyValue !== undefined ? (
                                        <div>
                                            Max ~{prettifyCurrencyValue(suggestedMaxFeeCurrencyValue)}
                                        </div>
                                    ) : (
                                        <div>
                                            Max ~
                                            {feeToken ? (
                                                prettifyTokenAmount({
                                                    amount: fee.suggestedMaxFee,
                                                    decimals: feeToken.decimals,
                                                    symbol: feeToken.symbol
                                                })
                                            ) : (
                                                <>{fee.suggestedMaxFee} Unknown</>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            showEstimateError ? <div>Error</div> : <SpinLoading color='default' style={{ '--size': '24px' }} />
                        )
                    }
                </StyledFeeList>
            }
        >
            <div style={{ textAlign: 'right' }}>
                    Network fee&nbsp;
                {
                    tipContent ? (
                        <Popover
                            content={<div style={{ width: 200 }}>{tipContent}</div>}
                            trigger='click'
                            placement='right'
                        >{enoughBalance ? <CheckCircleFill color='var(--color-primary)' style={{ ...IconStyle }} /> : <CloseCircleFill color='var(--adm-color-danger)' style={{ ...IconStyle }} />}</Popover>
                    ) : (
                        null
                    )
                }
            </div>
        </List.Item>
    );
};

export default FeeEstimationCom;
