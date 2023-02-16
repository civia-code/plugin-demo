import { useState, useEffect } from 'react';
import { RawArgs, stark, uint256 } from 'starknet';

import { sendMessage, waitForMessage } from '@argentx/packages/extension/src/shared/messages';
import { sendTransaction as realSendTransaction } from '@argentx/packages/extension/src/ui/services/transactions';
import { globalActionQueueStore } from '@argentx/packages/extension/src/shared/actionQueue/store';
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';
import { ExecuteTransactionRequest } from '@argentx/packages/extension/src/shared/messages/TransactionMessage';

const useProxySendTransaction = () => {
    const sendTransaction = async ({ ...props }: any) => {
        await realSendTransaction(props);
        await waitForMessage('EXECUTE_TRANSACTION_RES');
        const value = await globalActionQueueStore.get();
        swrCacheProvider.set(globalActionQueueStore.namespace, value);
        return value && value[0];
    };
    return {
        sendTransaction
    };
};

export const useSendCombinedTransaction = async (data: ExecuteTransactionRequest) => {
    await sendMessage({ type: 'EXECUTE_TRANSACTION', data });
    await waitForMessage('EXECUTE_TRANSACTION_RES');
    const value = await globalActionQueueStore.get();
    swrCacheProvider.set(globalActionQueueStore.namespace, value);
    return value && value[0];
};

export const useGetTransaction = () => {
    const [transactions, setTransactions] = useState(() => swrCacheProvider.get(globalActionQueueStore.namespace));

    const refreshTransactions = async () => {
        await sendMessage({ type: 'GET_ACTIONS' });
        const res = await waitForMessage('GET_ACTIONS_RES');
        console.log(res);
        await swrCacheProvider.set(globalActionQueueStore.namespace, res);
        setTransactions(res);
    };

    return { transactions, refreshTransactions };
};

export default useProxySendTransaction;
