import { useCallback, useEffect, useState } from 'react';
import useSWR, { BareFetcher } from 'swr';
import { FetcherResponse } from 'swr/dist/types';
import { number } from 'starknet';
import { getAccountInfo, getAccountInfoFromAPI, registerAccountInfo, getIdsByAddressList, getUserFaucetGas, registerAccountInfoTransAndApprove } from '@src/ui/account/accountCommon.service';

//
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';
import { TokenDetailsWithBalance, useTokensWithBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';

export interface IAccountInfoData {
    sbtInfo: string;
    idInfo: string;
    domainInfo: string;
    nickName: string;
}
export interface IUseGetAccountInfo {
    (account: Account, accountAddress: string): {
        accountInfoData: IAccountInfoData | undefined;
        accountInfoError: any;
        accountInfoValidating: any;
        mutate: any
    }
}

export const useLocalCache = (fetcher: any, { key, ...config }: any) => {
    const {
        data,
        error,
        isValidating,
        mutate
    } = useSWR(
        key,
        async () => fetcher(),
        {
            ...config
        }
    );
    return { data, error, isValidating, mutate };
};

export const useGetAccountInfo: IUseGetAccountInfo = (account: Account, accountAddress: string) => {
    const accountIdentifier = account && getAccountIdentifier(account);
    const key = `@"${accountIdentifier}","accountInfo"`;

    const {
        data: accountInfoData,
        error: accountInfoError,
        isValidating: accountInfoValidating,
        mutate
    } = useLocalCache(() => {
        if (!account.needsDeploy) {
            const accountInfo = swrCacheProvider.get(key) || { idInfo: '0' };
            return number.toBN(accountInfo.idInfo).toNumber() === 0 ? getAccountInfo(accountAddress) : accountInfo;
        }
    }, {
        key,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 5e3,
        dedupingInterval: 10e3
    });

    return { accountInfoData: (accountInfoData as IAccountInfoData), accountInfoError, accountInfoValidating, mutate };
};

export const useRegisterAccountInfo = (account: Account) => {
    const accountIdentifier = account && getAccountIdentifier(account);
    const key = `@"${accountIdentifier}","registerAccountInfo"`;
    const accountKey = `@"${accountIdentifier}","accountInfo"`;
    const { transactions, pendingTransactions } = useAccountTransactions(account);
    const hasAccountDeployed = transactions.some(item => item.status === 'ACCEPTED_ON_L2');
    const accountInfo = swrCacheProvider.get(accountKey) || { sbtInfo: '0' };
    const hasSbtCreated = !['0', '0x0'].includes(accountInfo.sbtInfo);
    const {
        data: accountInfoData,
        error: accountInfoError,
        isValidating: accountInfoValidating,
        mutate
    } = useLocalCache(() => { return (account && hasAccountDeployed && !hasSbtCreated) ? registerAccountInfo([]) : ''; }, {
        key,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 300e3
    });
};

export const useGetIdsByAddressList = () => {
    const key = 'accountMetadata.ids';
    const [addressList, setAddressList] = useState<string[]>([]);

    const {
        data: accountIdsData,
        error: accountIdsError,
        isValidating: accountIdsValidating,
        mutate
    } = useLocalCache(() => {
        const haveNoIdAddressList = accountIdsData ? addressList.filter(address => !Reflect.has(accountIdsData, address)) : addressList;
        return haveNoIdAddressList.length ? getIdsByAddressList(haveNoIdAddressList).then((res) => ({ ...res, ...accountIdsData })) : window.localStorage.get(key) || {};
    }, {
        key,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 10e3,
        dedupingInterval: 10e3
    });

    const mapAddress2Id = useCallback((address: string) => {
        return accountIdsData ? accountIdsData[address] : null;
    }, [accountIdsData]);

    const updateLocal = useCallback((address: string, id: string) => {
        mutate({ [address]: id, ...accountIdsData });
    }, [accountIdsData, mutate]);

    useEffect(() => {
        mutate();
    }, [addressList, mutate]);

    return { accountIdsData, accountIdsError, accountIdsValidating, addressList, setAddressList, mapAddress2Id, updateLocal, mutate };
};

export const useInviteInfo = () => {
    const key = 'inviteInfo';
    const [inviteInfo, setInviteInfo] = useState<{ code: string, address: string, nickname: string} | null>(swrCacheProvider.get(key));

    const proxySetInviteInfo = useCallback((code: string, address : string, nickname: string) => {
        if (code && address) {
            swrCacheProvider.set(key, { code, address, nickname });
            setInviteInfo({ code, address, nickname });
        }
    }, []);

    return { inviteInfo, setInviteInfo: proxySetInviteInfo };
};

export const useGetUserFaucetGas = (account: Account) => {
    const accountIdentifier = account && getAccountIdentifier(account);
    const key = `@"${accountIdentifier}","getUserFaucetGas"`;
    const { address } = account;

    const {
        data: getUserFaucetGasData,
        error: getUserFaucetGasError,
        isValidating: getUserFaucetGasValidating,
        mutate
    } = useLocalCache(() => {
        if (account.needsDeploy) {
            return getUserFaucetGas(address);
        }
    }, {
        key,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 100e3
    });

    return { accountInfoData: (getUserFaucetGasData as IAccountInfoData), getUserFaucetGasError, getUserFaucetGasValidating, mutate };
};

export const useIsBalanceEnougth = (account: Account, symbol = 'ETH') => {
    const { tokenDetails } = useTokensWithBalance(account);
    const isBalanceEnougth = tokenDetails.some(item => {
        return item.symbol === symbol && item.balance?.gt(0);
    });
    return isBalanceEnougth;
};

export const useAutoInitialAccount = (account: Account) => {
    const isBalanceEnougth = useIsBalanceEnougth(account);
    const accountIdentifier = account && getAccountIdentifier(account);
    const key = `@"${accountIdentifier}","install"`;
    const accountKey = `@"${accountIdentifier}","accountInfo"`;
    const { address } = account;

    const {
        data: getRegisterAccountData,
        error: getRegisterAccountError,
        isValidating: getRegisterAccountValidating,
        mutate
    } = useLocalCache(() => {
        const accountInfo = swrCacheProvider.get(accountKey) || { idInfo: '0' };
        if (isBalanceEnougth && accountInfo.idInfo.length <= 3) {
            return registerAccountInfoTransAndApprove(address);
        }
    }, {
        key,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 100e3
    });

    useEffect(() => {
        if (isBalanceEnougth) {
            mutate();
        }
    }, [isBalanceEnougth, mutate]);

    return { isBalanceEnougth };
};
