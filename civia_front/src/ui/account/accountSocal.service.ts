import { number } from 'starknet';
import { sendMessage, waitForMessage } from '@argentx/packages/extension/src/shared/messages';
import axios from 'axios';
import { useSendCombinedTransaction as proxySendCombinedTransaction } from '@src/hooks/useTransaction';
import { sbtConstractAddress } from '@src/shared/consts';

const flatAndFilterAddress = (list: Array<any>) => {
    const newList = list.filter((item: string) => item.length > 18);
    console.log('flatAndFilterAddress:newList ----', newList);
    //     .flat()
    //     .filter((item: string) => item.length > 18)
    //     .map((item: string) => number.toHex(item));
    // console.log('newList ---', newList);
    // return [...(new Set(newList))];
    return newList;
};

export const getSBT = async (accountAddress: string) => {
    await sendMessage({ type: 'CIVIA_GET_SBT', data: { accountAddress } } as any);
    const res = await waitForMessage('CIVIA_GET_SBT_RES' as any);
    return number.toHex(res);
};

export const createSBT = async () => {
    await sendMessage({ type: 'CIVIA_CREATE_SBT' } as any);
    return await waitForMessage('CIVIA_CREATE_SBT_RES' as any);
};

export const socalFollow = async (accountAddress: string) => {
    await sendMessage({ type: 'CIVIA_SOCAL_FOLLOW', data: { accountAddress } } as any);
    return await waitForMessage('CIVIA_SOCAL_FOLLOW_RES' as any);
};

export const socalUnFollow = async (accountAddress: string) => {
    await sendMessage({ type: 'CIVIA_SOCAL_UNFOLLOW', data: { accountAddress } } as any);
    return await waitForMessage('CIVIA_SOCAL_UNFOLLOW_RES' as any);
};

export const socalFollowTrans = async (accountAddress: string) => {
    const res = await proxySendCombinedTransaction({
        transactions: [{
            contractAddress: sbtConstractAddress,
            entrypoint: 'follow',
            calldata: [accountAddress]
        }]
    });
    return res;
};

export const socalUnFollowTrans = async (accountAddress: string) => {
    const res = await proxySendCombinedTransaction({
        transactions: [{
            contractAddress: sbtConstractAddress,
            entrypoint: 'unfollow',
            calldata: [accountAddress]
        }]
    });
    return res;
};

export const getAllFollowing = async (address?: string) => {
    await sendMessage({ type: 'CIVIA_GET_ALL_FOLLOWS', data: { address } } as any);
    const res = await waitForMessage('CIVIA_GET_ALL_FOLLOWS_RES' as any);
    return flatAndFilterAddress(res as any);
};

export const getAllFollower = async (address?: string) => {
    await sendMessage({ type: 'CIVIA_GET_ALL_FOLLOWERS', data: { address } } as any);
    const res = await waitForMessage('CIVIA_GET_ALL_FOLLOWERS_RES' as any);
    return flatAndFilterAddress(res as any);
};

// eslint-disable-next-line camelcase
export const getAllAccounts = async (address: string, begin_index: number, end_index: number) => {
    console.log('wallet -----', address);
    await sendMessage({
        type: 'CIVIA_GET_ALL_ACCOUNTS',
        // eslint-disable-next-line camelcase
        data: { address, begin_index, end_index }
    } as any);
    const res = await waitForMessage('CIVIA_GET_ALL_ACCOUNTS_RES' as any);
    // console.log('res =====', res);
    return res;
};

export const getAllSocalList = async (address?: string) => {
    await sendMessage({ type: 'CIVIA_GET_ALL_SOCAL_LIST', data: { address } } as any);
    const res = await waitForMessage('CIVIA_GET_ALL_SOCAL_LIST_RES' as any);
    if (res) {
        const { allFolloringRes, allFollowersRes }: any = res;
        return {
            followingData: allFolloringRes,
            followersData: allFollowersRes
        };
    } else {
        return null;
    }
};

/**
 *
 */
interface IGetMessageTokenProps {
    account: string;
}
export const getSessionToken = async ({ account }: any) => {
    const key = `${account},token`;
    const token = window.localStorage.getItem(key);

    if (token) {
        return token;
    } else {
        const res = await axios.post('http://192.168.10.118:5000/getSessionToken', { account });
        window.localStorage.setItem(key, res.headers['session-token'] || '');
        return res;
    }
};

interface IDoLeaveMessageProps {
    account: string;
    from: string;
    to: string;
    title: string;
    content: string;
}
export const doLeaveMessage = async (data: IDoLeaveMessageProps) => {
    const { account } = data;
    const key = `${account},token`;
    const res = await fetch('http://192.168.10.118:5000/app/leaveMessage', {
        method: 'POST',
        headers: {
            authorization: `Bearer ${window.localStorage.getItem(key) || ''}`,
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        mode: 'cors'
    }).then(response => {
        return response.body;
    });
    return res;
};

interface IDoReadMessageProps {
    account: string;
    message_id: string;
}
export const doReadMessage = async (data: IDoReadMessageProps) => {
    const { account } = data;
    const key = `${account},token`;
    const res = await fetch('http://192.168.10.118:5000/app/userReadMessage', {
        method: 'POST',
        headers: {
            authorization: `Bearer ${window.localStorage.getItem(key) || ''}`,
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        mode: 'cors'
    }).then(response => {
        return response.body;
    });
    return res;
};

interface IGetUserMessageProps {
    account: string;
    limit: number;
    page_no: number;
}
export const getUserMessages = async (data: IGetUserMessageProps) => {
    const { account } = data;
    const key = `${account},token`;
    const response = await axios.post('http://192.168.10.118:5000/app/getUserMessages',
        { ...data },
        {
            headers: {
                authorization: `Bearer ${window.localStorage.getItem(key) || ''}`,
                'Content-type': 'application/json;charset=utf-8'
            }
        });
    return Promise.resolve(response.data);
};

export const getUserDynamics = async (data: any) => {
    const { account } = data;
    const key = `${account},token`;
    const response = await axios.post('http://192.168.10.118:5000/app/getUserDynamics',
        { ...data },
        {
            headers: {
                authorization: `Bearer ${window.localStorage.getItem(key) || ''}`,
                'Content-type': 'application/json;charset=utf-8'
            }
        });
    return Promise.resolve(response.data);
};

export const getDynamicTest = async (data: any) => {
    const { account } = data;
    const key = `${account},token`;
    const response = await axios.post('http://192.168.10.118:5000/app/getDynamicTest',
        { ...data },
        {
            headers: {
                authorization: `Bearer ${window.localStorage.getItem(key) || ''}`,
                'Content-type': 'application/json;charset=utf-8'
            }
        });
    return Promise.resolve(response.data);
};
