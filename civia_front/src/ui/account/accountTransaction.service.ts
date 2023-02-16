import { number, shortString, Contract, Abi, Call } from 'starknet';
import { sendMessage, waitForMessage } from '@argentx/packages/extension/src/shared/messages';
import parsedErc20Abi from '@src/abis/ERC20.json';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';

const { encodeShortString, decodeShortString } = shortString;

export const silenceTransactionExecute = async (transactions: Call | Array<Call>) => {
    await sendMessage({ type: 'CIVIA_SILENCE_TRANSACTION', data: { transactions } } as any);
    const res = await waitForMessage('CIVIA_SILENCE_TRANSACTION_RES' as any) as any;
    console.log(res);
    return res;
};
