import { FC, useEffect } from 'react';
import { List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AccountLayout from '@src/pages/layouts/account_layout';
import { useFooterBar } from '@src/hooks/useFooterBar';
//
import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
import { PendingTransactionsCom, AccountActivityCom } from './components/transaction_list';
//

import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
//

const StyledBody = styled.div`
    min-height:320px;
    padding: 20px 10px;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const AccountActivityPage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;

    useEffect(() => {
        if (!account) {
            navigate('/account/list');
        }
    }, [account, navigate]);

    if (account) {
        return <AccountActivityBody account={account} />;
    } else {
        return null;
    }
};

const AccountActivityBody: FC<any> = () => {
    const account = useSelectedAccount() as any;
    useFooterBar('activity');
    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <StyledH3>Activities</StyledH3>
                <StyledBody>
                    <List mode='card'>
                        <PendingTransactionsCom account={account} />
                        <AccountActivityCom account={account} />
                    </List>
                </StyledBody>
            </WindowWrapperCom.Body>

        </WindowWrapperCom>
    );
};

export default () => <AccountLayout><AccountActivityPage /></AccountLayout>;
