import { number } from 'starknet';
import { sendMessage, waitForMessage } from '@argentx/packages/extension/src/shared/messages';

export const getAccountId = async (accountAddress: string) => {
    await sendMessage({ type: 'CIVIA_GET_ACCOUNT_ID', data: { accountAddress } } as any);
    const res = await waitForMessage('CIVIA_GET_ACCOUNT_ID_RES' as any);
    console.log(res);
    return res;
};

export const registeAccountId = async () => {
    await sendMessage({ type: 'CIVIA_REGIST_ACCOUNT_ID' } as any);
    return await waitForMessage('CIVIA_REGIST_ACCOUNT_ID_RES' as any);
};

export const getAccountByTokenId = async () => {
    await sendMessage({} as any);
    return await waitForMessage('' as any);
};

export const getAddressByTokenId = async (token: string) => {
    await sendMessage({ type: 'REQUEST_TOKEN' } as any);
}
