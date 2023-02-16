import { FC, useMemo, ReactNode } from 'react';
import { Card, List } from 'antd-mobile';
import { HandPayCircleOutline } from 'antd-mobile-icons';

import { useActivityList } from '@src/hooks/useActivity';
import FlashCom from '@src/pages/commponents/flash';
import { useFooterBar } from '@src/hooks/useFooterBar';

import { TransferAccessory } from '../transfer_accessory';

import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';
import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { useTokensInNetwork } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { transformExplorerTransaction, transformTransaction } from '@argentx/packages/extension/src/ui/features/accountActivity/transform';
import { isNFTTransaction, isNFTTransferTransaction, isSwapTransaction, isTokenMintTransaction, isTokenApproveTransaction, isDeclareContractTransaction, isDeployContractTransaction, isVoyagerTransaction, isActivityTransaction, isExplorerTransaction, isTokenTransferTransaction } from '@argentx/packages/extension/src/ui/features/accountActivity/transform/is';
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
    isRejected?: boolean
    children?: ReactNode | ReactNode[]
}

export const TransactionListItem: FC<TransactionListItemProps> = ({
    transactionTransformed,
    network,
    highlighted,
    children,
    isRejected,
    ...props
}) => {
    //
    const { action, amount, tokenAddress, hash, displayName, dapp } = transactionTransformed as any;
    //
    const isNFT = isNFTTransaction(transactionTransformed);
    const isNFTTransfer = isNFTTransferTransaction(transactionTransformed);
    const isTransfer = isTokenTransferTransaction(transactionTransformed);
    const isSwap = isSwapTransaction(transactionTransformed);
    const isTokenMint = isTokenMintTransaction(transactionTransformed);
    const isTokenApprove = isTokenApproveTransaction(transactionTransformed);
    const isDeclareContract = isDeclareContractTransaction(transactionTransformed);
    const isDeployContract = isDeployContractTransaction(transactionTransformed);

    const { displayAmount, displayValue } = useDisplayTokenAmountAndCurrencyValue(
        { amount, tokenAddress }
    );

    // const icon = useMemo(() => {
    //     return <HandPayCircleOutline />;
    // }, []);

    const subtitle = useMemo(() => {
        if (isTransfer || isNFTTransfer) {
            const titleShowsTo = (isTransfer || isNFTTransfer) && (action === 'SEND' || action === 'TRANSFER');
            const { toAddress, fromAddress } = transactionTransformed;
            return (
                <>
                    {titleShowsTo ? 'To: ' : 'From: '}
                    {formatTruncatedAddress(titleShowsTo ? toAddress : fromAddress)}
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
        transactionTransformed
    ]);
    //
    const icon = useMemo(() => {
        if (isNFT) {
            return null;
        }
        if (isSwap) {
            return null;
        }
        return <HandPayCircleOutline />;
    }, [isNFT, isSwap]);

    const accessory = useMemo(() => {
        if (isTransfer || isTokenMint || isTokenApprove) {
            return <TransferAccessory transaction={transactionTransformed} />;
        }
        if (isSwap) {
            return null;
        }
        return null;
    }, [isTransfer, isTokenMint, isTokenApprove, isSwap, transactionTransformed]);

    const handleClick = () => {
        openBlockExplorerTransaction(hash, network);
    };

    return (
        <List.Item description={subtitle} extra={displayAmount} onClick={handleClick} >{transactionTransformed.displayName}{isRejected ? ' (Rejected)' : null}</List.Item>
    );
};

export const PendingTransactionsCom: FC<any> = ({ account }) => {
    const network = useCurrentNetwork();
    const { pendingTransactions } = useAccountTransactions(account);
    const { switcherNetworkId } = useAppState();
    const tokensByNetwork = useTokensInNetwork(switcherNetworkId);
    const [,,, setBadge] = useFooterBar('activity');

    if (!pendingTransactions.length) {
        return null;
    }

    return (
        <Card>
            <List.Item>Pending transactions ({pendingTransactions.length})</List.Item>
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
        </Card>
    );
};

export const AccountActivityCom: FC<any> = ({ account }) => {
    const network = useCurrentNetwork();
    const { mergedActivity, tokensByNetwork, nftContractAddresses, loadMoreHashes, switcherNetworkId } = useActivityList({ account });

    const transactions = Object.entries(mergedActivity).map(([dateLabel, transactions]) => transactions).flat();

    return (
        <Card>
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
                        console.log(isRejected);
                        if (transactionTransformed) {
                            return (<TransactionListItem transactionTransformed={{ hash, ...transactionTransformed } as any} network={network} key={hash} isRejected={isRejected} />);
                        }
                        return null;
                    } else if (isExplorerTransaction(transaction)) {
                        const explorerTransactionTransformed = transformExplorerTransaction({
                            explorerTransaction: transaction,
                            accountAddress: account.address,
                            tokensByNetwork,
                            nftContractAddresses
                        });
                        if (explorerTransactionTransformed) {
                            const { transactionHash: hash } = transaction;
                            return (<TransactionListItem transactionTransformed={{ hash, ...explorerTransactionTransformed } as any} network={network} key={hash} />);
                        }
                        return null;
                    } else {
                        return null;
                    }
                })
            ) : null}
        </Card>
    );
};
