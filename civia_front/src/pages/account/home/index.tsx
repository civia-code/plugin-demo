import { FC, useState, useEffect, ReactElement } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { List } from 'antd-mobile';
import { UserAddOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
//
import {
    WindowWrapperCom, AccountHeadPanelCom, AccountSbtCom, AccountPanelCom, TabsCom,
    MessageListCom, NavBarCom, SocalRecoveryMessageListCom, NoIdTips, NoGuardiansTips
} from '@src/pages/commponents';
//
import AccountLayout from '@src/pages/layouts/account_layout';
import { useFooterBar } from '@src/hooks/useFooterBar';
import { getSessionToken, getUserDynamics, getDynamicTest } from '@src/ui/account/accountSocal.service';
import { useTokenBalanceToCurrencyValue } from '@argentx/packages/extension/src/ui/features/accountTokens/tokenPriceHooks';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { normalizeAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';

const StyledBody = styled.div`
    min-height:320px;
    padding: 10px 14px;
`;

const AccountHomePage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;
    const [isinitializing] = useState(swrCacheProvider.get(`${account.address},initializing`));
    console.log(isinitializing);

    // useEffect(() => {
    //     if (!account) {
    //         navigate('/account/list');
    //     }
    // }, [account, navigate]);

    if (isinitializing) {
        return <Navigate to='/account/initial' />;
    } else if (account) {
        return <AccountHomeBody account={account} />;
    } else {
        return null;
    }
};

export const TokenListItemContainer: FC<any> = ({
    token,
    children: funcChildren
}) => {
    const currencyValue = useTokenBalanceToCurrencyValue(token);
    return funcChildren(currencyValue);
};

const AccountHomeBody: FC<any> = ({ account }) => {
    const accountAddress = normalizeAddress(account.address);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    useFooterBar('home');
    const [dynamicMessageList, setDynamicMessageList] = useState([]);

    const initDynamicsList = async () => {
        console.log('123');
        const res = await getDynamicTest(accountAddress);
        console.log('getDynamicTest:res', res);
        setDynamicMessageList(res.result);
        // const res = await getUserDynamics({
        //     account: account?.address,
        //     followed_count: followedCount,
        //     max_block: maxBlock,
        //     limit
        // });
    };

    useEffect(() => {
        initDynamicsList();
        new Promise((resolve) => {
            if (accountAddress) {
                getSessionToken({ account: accountAddress });
            }
        }).then((res) => {
            // initDynamicsList();
        });
    }, [accountAddress]);

    return (
        <WindowWrapperCom loading={isLoading}>
            <WindowWrapperCom.Head>
                <AccountHeadPanelCom>
                    <NavBarCom
                        // left={
                        //     <div onClick={() => { navigate('/account/list'); }}>{NavBarCom.Logo}</div>
                        // }
                        right={
                            <NavBarCom.AddPanel>
                                {
                                    (props: ReactElement) => (
                                        <>
                                            {props}
                                            {/* <List.Item prefix={<UserCircleOutline />} onClick={handleRegistrAccountInfo} arrow={false}>RegisterSBT</List.Item> */}
                                            {/* <List.Item prefix={<ScanCodeOutline />} onClick={() => { navigate('/account/socal_recovery'); }} arrow={false}>Socal Recovery</List.Item> */}
                                            <List.Item prefix={<UserAddOutline />} onClick={() => { navigate('/account/secruity_level'); }} arrow={false}>Guardians</List.Item>
                                        </>
                                    )
                                }
                            </NavBarCom.AddPanel>
                        }
                    />
                    <AccountPanelCom />
                    <AccountSbtCom />
                    <TabsCom>
                        <TabsCom.Tab title='' key='1' />
                    </TabsCom>
                </AccountHeadPanelCom>
            </WindowWrapperCom.Head>
            <WindowWrapperCom.Body>
                <StyledBody>
                    <NoGuardiansTips />
                    <SocalRecoveryMessageListCom socalRecoveryMessageList={[1]} />
                    <MessageListCom dynamicMessageList={dynamicMessageList} />
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default () => <AccountLayout><AccountHomePage /></AccountLayout>;
