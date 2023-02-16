import React, { FC, useEffect, useMemo } from 'react';
import { List } from 'antd-mobile';
import { isArray } from 'lodash-es';
import { Call } from 'starknet';
import styled from 'styled-components';

import {
    isErc20ApproveCall,
    Erc20ApproveCall,
    parseErc20ApproveCall
} from '@argentx/packages/extension/src/shared/call/erc20ApproveCall';

import {
    isErc20TransferCall,
    Erc20TransferCall,
    parseErc20TransferCall
} from '@argentx/packages/extension/src/shared/call/erc20TransferCall';

import { formatTruncatedAddress, isEqualAddress } from '@argentx/packages/extension/src/ui/services/addresses';
// import { useDisplayTokenAmountAndCurrencyValue } from '@argentx/packages/extension/src/ui/features/accountTokens/useDisplayTokenAmountAndCurrencyValue';
import { prettifyTokenAmount } from '@argentx/packages/extension/src/shared/token/price';

import {
    ApiTransactionReviewResponse,
    getDisplayWarnAndReasonForTransactionReview,
    getTransactionReviewHasSwap
} from '@argentx/packages/extension/src/shared/transactionReview.service';

const ERC20TransferTransactionItemCom = ({ transaction, tokensByNetwork, funChildren }: any) => {
    const { contractAddress, recipientAddress, amount } = parseErc20TransferCall(transaction);
    // const { displayValue } = useDisplayTokenAmountAndCurrencyValue({
    //     amount,
    //     tokenAddress: contractAddress
    // });

    const token = tokensByNetwork.find(({ address }: any) =>
        isEqualAddress(address, contractAddress)
    );
    const displayAmount = token
        ? prettifyTokenAmount({
            amount,
            decimals: token?.decimals,
            symbol: token?.symbol || 'Unknown'
        })
        : `${amount} Unknown`;

    return <>
        <List.Item extra={displayAmount}>Send</List.Item>
        <List.Item extra={formatTruncatedAddress(recipientAddress)}>To</List.Item>
    </>;
};

const ERC20ApproveTransactionItemCom = ({ transaction, tokensByNetwork, funChildren }: any) => {
    const { contractAddress, recipientAddress, amount } = parseErc20ApproveCall(transaction);
    // const { displayValue } = useDisplayTokenAmountAndCurrencyValue({
    //     amount,
    //     tokenAddress: contractAddress
    // });

    const token = tokensByNetwork.find(({ address }: any) =>
        isEqualAddress(address, contractAddress)
    );
    const displayAmount = token
        ? prettifyTokenAmount({
            amount,
            decimals: token?.decimals,
            symbol: token?.symbol || 'Unknown'
        })
        : `${amount} Unknown`;

    return <>
        <List.Item extra={displayAmount}>Send</List.Item>
        <List.Item extra={formatTruncatedAddress(recipientAddress)}>To</List.Item>
    </>;
};

const TransactionsListCom:FC<any> = ({
    networkId,
    transactions,
    transactionReview,
    tokensByNetwork = [],
    children: funcChildren
}) => {
    const transactionsArray: Call[] = useMemo(() => (isArray(transactions) ? transactions : [transactions]), [transactions]);
    const { warn, reason } = getDisplayWarnAndReasonForTransactionReview(transactionReview);
    const hasSwap = getTransactionReviewHasSwap(transactionReview);

    if (hasSwap) {
        return funcChildren(<div>swap</div>);
    } else {
        return transactionsArray.map((transaction: any, index: number) => {
            if (isErc20TransferCall(transaction)) {
                return funcChildren(
                    <ERC20TransferTransactionItemCom transaction={transaction} tokensByNetwork={tokensByNetwork} />,
                    index
                );
            } else if (isErc20ApproveCall(transaction)) {
                return funcChildren(
                    <ERC20ApproveTransactionItemCom transaction={transaction} tokensByNetwork={tokensByNetwork} />,
                    index
                );
            } else {
                return funcChildren(
                    <React.Fragment>
                        <List.Item extra={formatTruncatedAddress(transaction.contractAddress)}>Constract</List.Item>
                        <List.Item extra={transaction.entrypoint}>Action</List.Item>
                        <List.Item description={<div style={{ wordBreak: 'break-all', paddingTop: '10px' }}>{transaction.calldata}</div>}>View details</List.Item>
                    </React.Fragment>,
                    index
                );
            }
        });
    }
};

export default TransactionsListCom;
