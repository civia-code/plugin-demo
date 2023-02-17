import { number, shortString, uint256 } from 'starknet';
import { sendMessage, waitForMessage } from '@argentx/packages/extension/src/shared/messages';
import { zipObject } from 'lodash-es';
import axios from 'axios';

import { useSendCombinedTransaction as proxySendCombinedTransaction } from '@src/hooks/useTransaction';
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';
import { sbtConstractAddress, idConstractAddress } from '@src/shared/consts';
import { approveAction, rejectAction } from '@argentx/packages/extension/src/ui/services/backgroundActions';

const { encodeShortString, decodeShortString } = shortString;

export const getSigner = async () => {
    await sendMessage({
        type: 'CIVIA_MULTICALL',
        data: {
            calls: [
                {
                    contractAddress: '0x0654a9d76476d93f245d08f7425e693aef5257d3709d755b8bb2e518b38458d6',
                    entrypoint: 'getSigner',
                    calldata: []
                }
            ]
        }
    } as any);
    const res = await waitForMessage('CIVIA_MULTICALL_RES' as any);
    console.log(res);
    return res;
};
export const getAccountInfo = async (accountAddress: string) => {
    await sendMessage({ type: 'CIVIA_GET_ACCOUNT_INFO', data: { accountAddress } } as any);
    const res = await waitForMessage('CIVIA_GET_ACCOUNT_INFO_RES' as any);
    return res;
};

export const getAccountInfoFromAPI = async (accountAddress: string) => {
    const response = await axios.post('http://101.132.135.175:5000/app/getUserId',
        { account: accountAddress },
        {
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        });
    return Promise.resolve(response.data).then(res => {
        const { id = '0', nick_name: nickName } = res.result || {};
        return { sbtInfo: '0', idInfo: String(id), domainInfo: '0', nickName };
    });
};

export const getAddressByTokenId = async (tokenId: string) => {
    await sendMessage({ type: 'CIVIA_GET_TOKEN_ID', data: { tokenId } } as any);
    const res = await waitForMessage('CIVIA_GET_TOKEN_ID_RES' as any);
    return res ? [number.toHex(res)] : [];
};

export const getNicknameByTokenId = async (tokenId: string) => {
    console.log('tokenId ----------', tokenId);
    await sendMessage({ type: 'CIVIA_GET_NICKNAME', data: { tokenId } } as any);
    const res = await waitForMessage('CIVIA_GET_NICKNAME_RES' as any);
    return res;
};

export const registerAccountInfo = async (methods: Array<'register' | 'create_sbt'>) => {
    await sendMessage({ type: 'CIVIA_REGISTER_ACCOUNT_INFO', data: { methods } } as any);
    const res = await waitForMessage('CIVIA_REGISTER_ACCOUNT_INFO_RES' as any);
    console.log(res);
    return res;
};

export const registerAccountInfoTrans = async (accountAddress: string, nickName: string = 'Unknow') => {
    const { address, nickname } = swrCacheProvider.get('inviteInfo') || {};
    const transactions = [
        {
            contractAddress: sbtConstractAddress,
            entrypoint: 'create_sbt',
            calldata: [accountAddress, encodeShortString(nickname || 'Unknow')]
        }
    ];
    //
    if (address) {
        transactions.push({
            contractAddress: sbtConstractAddress,
            entrypoint: 'follow',
            calldata: [address]
        });
    }
    const res = await proxySendCombinedTransaction({
        transactions
    });
    //
    return res;
};

export const registerAccountInfoTransAndApprove = async (accountAddress: string, nickName: string = 'Unknow') => {
    const { address, nickname } = swrCacheProvider.get('inviteInfo') || {};
    const transactions = [
        {
            contractAddress: sbtConstractAddress,
            entrypoint: 'create_sbt',
            calldata: [accountAddress, encodeShortString(nickname || 'Unknow')]
        }
    ];
    //
    if (address) {
        transactions.push({
            contractAddress: sbtConstractAddress,
            entrypoint: 'follow',
            calldata: [address]
        });
    }
    const action = await proxySendCombinedTransaction({ transactions });
    await approveAction(action);
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
    return result;
};

export const getDomainInfoAndPrice = async (domain: string, days: number) => {
    await sendMessage({ type: 'CIVIA_GET_DOMAININFO_AND_PRICE', data: { domain: encodeShortString(domain), days } } as any);
    const res = await waitForMessage('CIVIA_GET_DOMAININFO_AND_PRICE_RES' as any);
    console.log(res);
    return res;
};

export const getSearchAccount = async (searchKey: string) => {
    await sendMessage({ type: 'CIVIA_SEARCH_ACCOUNT', data: { searchKey } } as any);
    const res = await waitForMessage('CIVIA_SEARCH_ACCOUNT_RES' as any);
    console.log(res);
    return res;
};

export const getIdsByAddressList = async (addressList: string[]) => {
    await sendMessage({ type: 'CIVIA_GET_IDS_BY_ADDRESSLIST', data: { addressList } } as any);
    const res = await waitForMessage('CIVIA_GET_IDS_BY_ADDRESSLIST_RES' as any) as any[];
    const ids = res.map(item => (uint256.uint256ToBN({ low: item[0], high: item[1] })).toString());
    return zipObject(addressList, ids);
};

export const getUserFaucetGas = async (accountAddress: string) => {
    const response = await axios.post('http://101.132.135.175:5000/app/userFaucetGas',
        { account: accountAddress },
        {
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        });
    return Promise.resolve(response.data).then(res => {
        return res.status;
    });
};
