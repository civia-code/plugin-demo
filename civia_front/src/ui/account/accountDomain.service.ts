import { number, shortString, Contract, Abi } from 'starknet';
import { sendMessage, waitForMessage } from '@argentx/packages/extension/src/shared/messages';
import parsedErc20Abi from '@src/abis/ERC20.json';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';

const { encodeShortString, decodeShortString } = shortString;

export const getDomainBuyPrice = async (domain: string, days: number) => {
    await sendMessage({ type: 'CIVIA_GET_DOMAIN_BUY_PRICE', data: { domain: encodeShortString(domain), days } } as any);
    const res = await waitForMessage('CIVIA_GET_DOMAIN_BUY_PRICE_RES' as any) as any;
    return [number.toHex(res[0]) as string, parseInt(res[1].low, 16)];
};

export const getDomainRenewPrice = async () => {

};

export const getDomainAddress = async (domain: string) => {
    await sendMessage({ type: 'CIVIA_GET_DOMAIN_ADDRESS', data: { domain: encodeShortString(domain) } } as any);
    const res = await waitForMessage('CIVIA_GET_DOMAIN_ADDRESS_RES' as any);
    return res;
};

export const getDomainExpiry = async (domain: string) => {
    await sendMessage({ type: 'CIVIA_GET_DOMAIN_EXPIRY', data: { domain: encodeShortString(domain) } } as any);
    const res = await waitForMessage('CIVIA_GET_DOMAIN_EXPIRY_RES' as any);
    return res;
};

export const getDomainOwner = async (domain: string) => {
    await sendMessage({ type: 'CIVIA_GET_DOMAIN_OWNER', data: { domain: encodeShortString(domain) } } as any);
    const res = await waitForMessage('CIVIA_GET_DOMAIN_OWNER_RES' as any);
    return res;
};

export const getDomainAddressOf = async () => {

};

export const getDomainList = async (accountAddress: string) => {
    await sendMessage({ type: 'CIVIA_GET_DOMAIN_LIST', data: { accountAddress } } as any);
    const res = await waitForMessage('CIVIA_GET_DOMAIN_LIST_RES' as any);
    return res;
};

export const getDomainBuy = async (domain: string, days: number) => {
    await sendMessage({ type: 'CIVIA_GET_DOMAIN_BUY', data: { domain: encodeShortString(domain), days } } as any);
    const res = await waitForMessage('CIVIA_GET_DOMAIN_BUY_RES' as any);
    return res;
};

export const getDomainRenew = async () => {

};

export const getDomainTransfer = async () => {

};

export const approveErc20 = async (address: string, account: Account, data: any): Promise<any> => {
    const { constractAddress, amount } = data;
    await sendMessage({ type: 'APPROVE', data: { constractAddress, amount } } as any);
    const res = await waitForMessage('APPROVE_RES' as any);
    return res;
};
