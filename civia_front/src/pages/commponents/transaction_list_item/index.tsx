import { FC, useMemo, useEffect, ReactNode } from 'react';
import { List } from 'antd-mobile';
import styled from 'styled-components';

import { Network } from '@argentx/packages/extension/src/shared/network';
import {
    isDeclareContractTransaction,
    isDeployContractTransaction,
    isNFTTransaction,
    isNFTTransferTransaction,
    isSwapTransaction,
    isTokenApproveTransaction,
    isTokenMintTransaction,
    isTokenTransferTransaction
} from '@argentx/packages/extension/src/ui/features/accountActivity/transform/is';

import {
    TokenApproveTransaction,
    TokenMintTransaction,
    TokenTransferTransaction,
    TransformedTransaction,
    SwapTransaction
} from '@argentx/packages/extension/src/ui/features/accountActivity/transform/type';
import { useDisplayTokenAmountAndCurrencyValue } from '@argentx/packages/extension/src/ui/features/accountTokens/useDisplayTokenAmountAndCurrencyValue';
import { prettifyTokenAmount } from '@argentx/packages/extension/src/shared/token/price';

export interface TransferAccessoryProps {
    transaction:
    | TokenTransferTransaction
    | TokenMintTransaction
    | TokenApproveTransaction
}

export const TransferAccessory: FC<TransferAccessoryProps> = ({
    transaction
}) => {
    const { action, amount, tokenAddress } = transaction;
    const { displayAmount, displayValue } = useDisplayTokenAmountAndCurrencyValue(
        { amount, tokenAddress }
    );
    if (!displayAmount) {
        return null;
    }
    const prefix =
      action === 'SEND' ? <>&minus;</> : action === 'RECEIVE' ? <>+</> : null;
    return (
        <div>
            <div>
                {prefix}
                {displayAmount}
            </div>
            {displayValue && (
                <div>
                    {prefix}
                    {displayValue}
                </div>
            )}
        </div>
    );
};

export interface SwapAccessoryProps {
    transaction: SwapTransaction
}

export const SwapAccessory: FC<SwapAccessoryProps> = ({ transaction }) => {
    const { fromAmount, fromToken, toAmount, toToken } = transaction;
    return (
        <div>
            <div>
                <>+</>
                {toToken ? (
                    prettifyTokenAmount({
                        amount: toAmount,
                        decimals: toToken.decimals,
                        symbol: toToken.symbol
                    })
                ) : (
                    <>{toAmount} Unknown</>
                )}
            </div>
            <div>
          &minus;
                {fromToken ? (
                    prettifyTokenAmount({
                        amount: fromAmount,
                        decimals: fromToken.decimals,
                        symbol: fromToken.symbol
                    })
                ) : (
                    <>{fromAmount} Unknown</>
                )}
            </div>
        </div>
    );
};

export interface TransactionListItemProps {
    transactionTransformed: TransformedTransaction
    network: Network
    highlighted?: boolean
    onClick?: () => void
    children?: ReactNode | ReactNode[]
}

export const TransactionListItem: FC<TransactionListItemProps> = ({
    transactionTransformed,
    network,
    highlighted,
    children,
    ...props
}) => {
    const { action, displayName, dapp } = transactionTransformed;
    const isNFT = isNFTTransaction(transactionTransformed);
    const isNFTTransfer = isNFTTransferTransaction(transactionTransformed);
    const isTransfer = isTokenTransferTransaction(transactionTransformed);
    const isSwap = isSwapTransaction(transactionTransformed);
    const isTokenMint = isTokenMintTransaction(transactionTransformed);
    const isTokenApprove = isTokenApproveTransaction(transactionTransformed);
    const isDeclareContract = isDeclareContractTransaction(transactionTransformed);
    const isDeployContract = isDeployContractTransaction(transactionTransformed);
    //
    const subtitle = useMemo(() => {
        if (isTransfer || isNFTTransfer) {
            const titleShowsTo =
            (isTransfer || isNFTTransfer) &&
            (action === 'SEND' || action === 'TRANSFER');
            const { toAddress, fromAddress } = transactionTransformed;
            return (
                <>
                    {titleShowsTo ? 'To: ' : 'From: '}
                    <div>{titleShowsTo ? toAddress : fromAddress}</div>
                </>
            );
        }
        if (dapp) {
            return <>{dapp.title}</>;
        }
        if (isDeclareContract) {
            return <>{transactionTransformed.classHash}</>;
        }
        if (isDeployContract) {
            return <>{transactionTransformed.contractAddress}</>;
        }
        return null;
    }, [
        isTransfer,
        dapp,
        isNFTTransfer,
        isDeclareContract,
        isDeployContract,
        action,
        transactionTransformed//,
        // network.id
    ]);

    console.log(transactionTransformed);
    //
    return (
        <>
            <List.Item description={subtitle}>{displayName}</List.Item>
            {children}
        </>
    );
};

export default TransactionListItem;
