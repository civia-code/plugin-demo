import { useState, useEffect, useCallback } from 'react';

import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';

export const useFollowStatus = () => {
    const account = useSelectedAccount() as Account;
    const { transactions, pendingTransactions } = useAccountTransactions(account);

    const getFollowStatusByAddress = useCallback((address: string) => {
        const lists = pendingTransactions.filter(item => {
            if (item.meta) {
                const { transactions: trans } = item.meta as any;
                // const { transactions: [{ calldata, entrypoint }] } = item.meta as any;
                // const status = item.status;
                // if (entrypoint === 'follow' || entrypoint === 'unfollow') {
                //     return (calldata as string[]).includes(address);
                // }
                if (Array.isArray(trans)) {
                    // @ts-ignore
                    const [{ calldata, entrypoint }] = trans;
                    const status = item.status;
                    if (entrypoint === 'follow' || entrypoint === 'unfollow') {
                        return (calldata as string[]).includes(address);
                    }
                } else {
                    const { calldata, entrypoint } = trans;
                    const status = item.status;
                    if (entrypoint === 'follow' || entrypoint === 'unfollow') {
                        return (calldata as string[]).includes(address);
                    }
                }
            }
            return false;
        }) || [{ status: 0 }];
        return lists.length ? lists[0].status : '';
    }, [pendingTransactions]);

    const getPendingFollowTransactions = useCallback(() => {
        const pendingFollowingData: string[] = [];
        const pendingFollowersData: string[] = [];
        for (const item of pendingTransactions) {
            if (item.meta) {
                console.log('item.meta -----', item.meta);
                // const { transactions: { calldata, entrypoint } } = item.meta as any;
                const { transactions } = item.meta as any;
                if (Array.isArray(transactions)) {
                    const [{ calldata, entrypoint }] = transactions;
                    const address = (calldata as string[])[0];
                    if (entrypoint === 'follow') {
                        pendingFollowingData.push(address);
                    } else if (entrypoint === 'unfollow') {
                        pendingFollowersData.push(address);
                    }
                } else {
                    console.log('transactions -----', transactions);
                    const { calldata, entrypoint } = transactions;
                    const address = (calldata as string[])[0];
                    if (entrypoint === 'follow') {
                        pendingFollowingData.push(address);
                    } else if (entrypoint === 'unfollow') {
                        pendingFollowersData.push(address);
                    }
                }
            }
        }
        return [pendingFollowingData, pendingFollowersData];
    }, [pendingTransactions]);

    return {
        getFollowStatusByAddress,
        getPendingFollowTransactions
    };
};
