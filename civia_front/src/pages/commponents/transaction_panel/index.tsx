import { FC } from 'react';
import { List } from 'antd-mobile';
import styled from 'styled-components';

import { useTokensInNetwork } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';
import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
//
import { FlashCom } from '@src/pages/commponents';

const TransactionPanelCom: FC<any> = ({ account }) => {
    const network = useCurrentNetwork();
    const { pendingTransactions } = useAccountTransactions(account);
    const { switcherNetworkId } = useAppState();
    const tokensByNetwork = useTokensInNetwork(switcherNetworkId);

    console.log(pendingTransactions);

    if (pendingTransactions.length) {
        return (
            <List>
                {
                    pendingTransactions.map((transaction, index) => {
                        return <List.Item key={index} extra={transaction?.meta?.title}>{
                            <a style={{ fontSize: 12 }} href={`${transaction.account.network.explorerUrl}/tx/${transaction.hash}`} target='black'>
                                <FlashCom>
                                    {formatTruncatedAddress(transaction.hash)}
                                </FlashCom>
                            </a>
                        }</List.Item>;
                    })
                }
            </List>
        );
    } else {
        return null;
    }
};

export default TransactionPanelCom;
