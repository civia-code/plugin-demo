import { FC, useState, ReactElement } from 'react';
import { List, Empty } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserAddOutline } from 'antd-mobile-icons';
//
import { useFooterBar } from '@src/hooks';
import { useLocalCache } from '@src/hooks/useAccount';
//
import { AccountPanelCom, AccountHeadPanelCom, WindowWrapperCom, TabsCom, NavBarCom, LoadingCom, AllUserList } from '@src/pages/commponents';
import AccountLayout from '@src/pages/layouts/account_layout';
import { getAllSocalList } from '@src/ui/account/accountSocal.service';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';

const StyledBody = styled.div`
    /* min-height:320px;
    margin: 10px 0;
    border-radius: 20px 20px 0 0;
    background:#fff; */
    padding-top: 8px;
`;

const StyledTabsCom = styled(TabsCom)`
    .adm-tabs-tab-line{
        
    }
`;

const StyledList = styled(List)`
    --border-top: 0px;
    --border-bottom: 0px;
    font-size:12px!important;
`;

const AccountSocalPage: FC<any> = () => {
    const navigate = useNavigate();
    useFooterBar('socal');
    const [activeKey, setActiveKey] = useState<'following'| 'followers'>('following');
    const account = useSelectedAccount() as Account;
    const accountIdentifier = account && getAccountIdentifier(account);

    const { data: socalList = { followingData: [], followersData: [] }, isValidating, mutate } = useLocalCache(getAllSocalList, { key: `@"${accountIdentifier}","socalList"`, revalidateOnFocus: false, revalidateOnReconnect: false, refreshInterval: 10e3, dedupingInterval: 10e3 });
    const { followingData, followersData } = socalList;

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Head>
                <AccountHeadPanelCom>
                    <NavBarCom
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
                    <StyledTabsCom onChange={(key: any) => setActiveKey(key)}>
                        <TabsCom.Tab title='Followings' key='following' />
                        <TabsCom.Tab title='Followers' key='followers' />
                    </StyledTabsCom>
                </AccountHeadPanelCom>
            </WindowWrapperCom.Head>
            <WindowWrapperCom.Body>
                <StyledBody>
                    <div>
                        {
                            activeKey === 'following' ? (
                                followingData.length ? <AllUserList
                                    gridType={'list'}
                                    list={followingData}
                                /> : (isValidating ? <LoadingCom visible mask={false} /> : <Empty />)
                            ) : (
                                <StyledList mode='card'>
                                    {
                                        followersData.length ? <AllUserList
                                            gridType={'list'}
                                            list={followersData}
                                        /> : (isValidating ? <LoadingCom visible mask={false} /> : <Empty />)
                                    }
                                </StyledList>
                            )
                        }
                    </div>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default () => <AccountLayout><AccountSocalPage /></AccountLayout>;
