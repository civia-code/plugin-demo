import { FC, useState, useEffect } from 'react';
import { NavBar, Button, Card, Image, Grid, Empty } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useFooterBar } from '@src/hooks/useFooterBar';
import { getAllFollowing, getAllFollower } from '@src/ui/account/accountSocal.service';
import { useLocalCache } from '@src/hooks/useAccount';
import { useCollections } from '@argentx/packages/extension/src/ui/features/accountNfts/useCollections';
//
import { ReactComponent as AddIcon } from '@src/assets/icons/add.svg';
import { ReactComponent as PolygonLogoIcon } from '@src/assets/icons/polygon-matic-logo.svg';

import { WindowWrapperCom, AccountHeadPanelCom, AccountPanelCom, TabsCom, LoadingCom } from '@src/pages/commponents';
import AccountLayout from '@src/pages/layouts/account_layout';
//
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';

const StyledBody = styled.div`
    min-height:320px;
    padding: 20px 10px;
`;

const StyledGrid = styled(Grid)`
    padding: 0 32px;
`;

const StyledCard = styled(Card)`
    border-radius: 0;
    border-bottom: 1px solid #395C3E;
    &:hover{
        cursor: pointer;
    }
    .adm-card-body{
        padding: 0;
    }

    .adm-image{
        width: 130px;
        height: 130px;
        border-radius:10px;
        overflow:hidden;
    }

    .info{
        width: 130px;
        font-size: 14px;
        font-weight: 400;
        line-height:19px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 8px 0;
        span{
            width: 130px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
`;

const StyledButton = styled(Button)`
    margin: 20px auto;
    display: block;
    border-radius:100%;
    overflow:hidden;
    line-height:inherit;
    border-radius:20px;
    width: 128px;
    padding: 10px 12px;
`;

const AccountSbtsPage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as Account;

    if (account) {
        return <AccountSbtsBody account={account} />;
    } else {
        navigate('/account/list');
        return null;
    }
};

const AccountSbtsBody: FC<any> = ({ account }) => {
    const navigate = useNavigate();
    const [nfts, setNfts] = useState([]);
    const sbtList = useCollections(account);
    useFooterBar('tokens');
    const accountIdentifier = account && getAccountIdentifier(account);

    const { data: followingData = [], isValidating: followingIsValidating } = useLocalCache(getAllFollowing, { key: `@"${accountIdentifier}","following"`, revalidateOnFocus: false, revalidateOnReconnect: false, revalidateIfStale: false });

    useEffect(() => {
        const list = sbtList && sbtList.length ? sbtList[0]?.nfts : [];
        for (const item of list) {
            // @ts-ignore
            axios.get(`${item.token_uri}${item.token_id}`).then((res) => {
                console.log('res -----', res);
                item.image_uri = res.data.image;
            });
        }
        console.log('list -----', list);
        // @ts-ignore
        setNfts(list);
    }, []);

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Head>
                <AccountHeadPanelCom>
                    <AccountPanelCom />
                    <TabsCom onChange={(key: string) => {
                        switch (key) {
                        case '1':
                            navigate('/account/tokens');
                            break;
                        case '2':
                            navigate('/account/nfts');
                            break;
                        case '3':
                            // navigate('/account/sbts');
                            break;
                        }
                    }} defaultActiveKey='3'>
                        <TabsCom.Tab title='Tokens' key='1' />
                        <TabsCom.Tab title='NFTs' key='2' />
                        <TabsCom.Tab title='SBTs' key='3' />
                    </TabsCom>
                </AccountHeadPanelCom>
            </WindowWrapperCom.Head>
            <WindowWrapperCom.Body>
                <StyledBody>
                    {
                        nfts.length ? (
                            <StyledGrid columns={2} gap={16}>
                                {
                                    nfts.map((item: any) => (
                                        <StyledCard key={item}>
                                            <Image src={item.image_uri || 'https://img1.baidu.com/it/u=252746894,533082394&fm=253&fmt=auto&app=138&f=JPEG?w=343&h=337'} />
                                            <div className='info'>
                                                <div><span>{item.contract?.name}</span></div>
                                            </div>
                                        </StyledCard>
                                    ))
                                }
                            </StyledGrid>
                        ) : (followingIsValidating ? <LoadingCom visible /> : <Empty />)
                    }
                    {/* <StyledButton color='primary'><AddIcon height={26} /></StyledButton> */}
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default () => <AccountLayout><AccountSbtsPage /></AccountLayout>;
