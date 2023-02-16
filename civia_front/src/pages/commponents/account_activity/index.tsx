import { FC, useMemo, ReactNode } from 'react';
import { Card, Button, List } from 'antd-mobile';
import { HandPayCircleOutline } from 'antd-mobile-icons';

import { useActivityList } from '@src/hooks/useActivity';
import FlashCom from '@src/pages/commponents/flash';

import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';
import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { useTokensInNetwork } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { transformExplorerTransaction, transformTransaction } from '@argentx/packages/extension/src/ui/features/accountActivity/transform';
import { isVoyagerTransaction, isActivityTransaction, isExplorerTransaction, isTokenTransferTransaction } from '@argentx/packages/extension/src/ui/features/accountActivity/transform/is';
import { useDisplayTokenAmountAndCurrencyValue } from '@argentx/packages/extension/src/ui/features/accountTokens/useDisplayTokenAmountAndCurrencyValue';
import { TransformedTransaction } from '@argentx/packages/extension/src/ui/features/accountActivity/transform/type';
import { Network } from '@argentx/packages/extension/src/shared/network';
import {
    openBlockExplorerAddress,
    openBlockExplorerTransaction
} from '@argentx/packages/extension/src/ui/services/blockExplorer.service';

import {
    formatTruncatedAddress,
    isEqualAddress
} from '@argentx/packages/extension/src/ui/services/addresses';

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
    //
    const { action, amount, tokenAddress, hash } = transactionTransformed as any;
    const { displayAmount, displayValue } = useDisplayTokenAmountAndCurrencyValue(
        { amount, tokenAddress }
    );

    const icon = useMemo(() => {
        return <HandPayCircleOutline />;
    }, []);

    const subtitle = useMemo(() => {
        const titleShowsTo = (action === 'SEND' || action === 'TRANSFER');
        const { toAddress, fromAddress } = transactionTransformed as any;
        return (
            <>
                {titleShowsTo ? 'To: ' : 'From: '}
                {formatTruncatedAddress(titleShowsTo ? toAddress : fromAddress)}
            </>
        );
    }, [
        action,
        transactionTransformed
    ]);

    const handleClick = () => {
        openBlockExplorerTransaction(hash, network);
    };

    return (
        <List.Item description={subtitle} extra={displayAmount} onClick={handleClick} >{transactionTransformed.displayName}</List.Item>
    );
};

const PendingTransactionsCom: FC<any> = ({ account, test }) => {
    const network = useCurrentNetwork();
    const { pendingTransactions } = useAccountTransactions(account);
    const { switcherNetworkId } = useAppState();
    const tokensByNetwork = useTokensInNetwork(switcherNetworkId);

    if (!pendingTransactions.length) {
        return null;
    }

    return (
        <>
            {
                pendingTransactions.length ? <List.Item>Pending transactions ({pendingTransactions.length})</List.Item> : null
            }
            {
                pendingTransactions.map((transaction) => {
                    const { hash } = transaction;
                    const transactionTransformed = transformTransaction({
                        transaction,
                        accountAddress: account.address,
                        tokensByNetwork
                    });
                    if (transactionTransformed) {
                        return (
                            <FlashCom key={hash}>
                                <TransactionListItem transactionTransformed={{ hash, ...transactionTransformed } as any} network={network} />
                            </FlashCom>
                        );
                    }
                    return null;
                })}
        </>
    );
};

const AccountActivity: FC<any> = ({ account }) => {
    const network = useCurrentNetwork();
    const { mergedActivity, tokensByNetwork, nftContractAddresses, loadMoreHashes, switcherNetworkId } = useActivityList({ account });

    const transactions = Object.entries(mergedActivity).map(([dateLabel, transactions]) => transactions).flat();

    return (
        <>
            {account ? (
                transactions.map((transaction) => {
                    if (isActivityTransaction(transaction)) {
                        const { hash, isRejected } = transaction;
                        const transactionTransformed = transformTransaction({
                            transaction,
                            accountAddress: account.address,
                            tokensByNetwork,
                            nftContractAddresses
                        });
                        if (transactionTransformed) {
                            const isTransfer = isTokenTransferTransaction(transactionTransformed);
                            if (isTransfer) {
                                return (
                                    <TransactionListItem transactionTransformed={{ hash, ...transactionTransformed } as any} network={network} key={hash} />
                                );
                            } else {
                                return null;
                            }
                        }
                        return null;
                    } else {
                        return null;
                    }
                })
            ) : null}
        </>
    );
};

export {
    PendingTransactionsCom,
    AccountActivity
};
