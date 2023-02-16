import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { NavBar, Button, Card, Image, Grid, Empty } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFooterBar } from '@src/hooks/useFooterBar';
import { useCollections } from '@argentx/packages/extension/src/ui/features/accountNfts/useCollections';

import { ReactComponent as PolygonLogoIcon } from '@src/assets/icons/polygon-matic-logo.svg';
import { WindowWrapperCom, AccountHeadPanelCom, AccountPanelCom, TabsCom } from '@src/pages/commponents';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import AccountLayout from '@src/pages/layouts/account_layout';
import Item from 'antd-mobile/es/components/dropdown/item';

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
        font-size: 14px;
        font-weight: 400;
        line-height:19px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 8px 0;
        display: flex;
        justify-content: space-between;
        span:nth-child(1){
            width: 100px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
`;

const StyledLink = styled(Button)`
    padding: 0 5px;
    margin: 0 3px;
    color: var(--adm-color-primary);
    font-size:12px;
`;

const AccountNftsPage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;

    if (account) {
        return <AccountNftsBody account={account} />;
    } else {
        navigate('/account/list');
        return null;
    }
};

const AccountNftsBody: FC<any> = ({ account }) => {
    const navigate = useNavigate();
    const [nfts, setNfts] = useState([]);
    const collectibles = useCollections(account);
    useFooterBar('tokens');
    console.log('collectibles -----', collectibles);

    useEffect(() => {
        const list = collectibles && collectibles.length ? collectibles[0]?.nfts : [];
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
                            // navigate('/account/nfts');
                            break;
                        case '3':
                            navigate('/account/sbts');
                            break;
                        }
                    }} defaultActiveKey='2'>
                        <TabsCom.Tab title='Tokens' key='1' />
                        <TabsCom.Tab title='NFTs' key='2' />
                        <TabsCom.Tab title='SBTs' key='3' />
                    </TabsCom>
                </AccountHeadPanelCom>
            </WindowWrapperCom.Head>
            <WindowWrapperCom.Body>
                <StyledBody>
                    {
                        nfts.length === 0 ? (
                            <Empty />
                            // <div style={{ textAlign: 'center' }}>
                            //     <p>No NFTs to show</p>
                            //     {account.networkId === 'goerli-alpha' && (
                            //         <p style={{ marginTop: 120 }}>
                            //             <small>You can browse NFTs on<a href="https://testnet.aspect.co" target="_blank" rel="noreferrer"><StyledLink fill='none'>Aspect</StyledLink></a></small>
                            //         </p>
                            //     )}
                            //     {account.networkId === 'mainnet-alpha' && (
                            //         <p style={{ marginTop: 120 }}>
                            //             <small>You can browse NFTs on<a href="https://aspect.co" target="_blank" rel="noreferrer"><StyledLink fill='none'>Aspect</StyledLink></a></small>
                            //         </p>
                            //     )}
                            //     {account.networkId === 'goerli-alpha' && (
                            //         <p style={{ marginTop: 16 }}>
                            //             <small>Or build your own 3D NFTs on<a href="https://briq.construction/" target="_blank" rel="noreferrer"><StyledLink fill='none'>briq</StyledLink></a>
                            //             </small>
                            //         </p>
                            //     )}
                            // </div>
                        ) : (
                            <StyledGrid columns={2} gap={16}>
                                {
                                    nfts.map((item: any) => (
                                        <StyledCard key={item?.contract?.contract_address} onClick={() => { navigate('/nfts/list', { state: { name: item.name, contractAddress: item?.contract?.contract_address } }); }}>
                                            <Image src={item.image_uri || 'https://pic3.zhimg.com/v2-d023feeb25332d8d120c182525426876_1440w.jpg?source=172ae18b'} />
                                            <div className='info'>
                                                <span>{item.contract?.name}</span>
                                                <span>#{item.token_id}</span>
                                            </div>
                                        </StyledCard>
                                    ))
                                }
                            </StyledGrid>
                        )
                    }
                </StyledBody>
            </WindowWrapperCom.Body>

        </WindowWrapperCom>
    );
};

export default () => <AccountLayout><AccountNftsPage /></AccountLayout>;
