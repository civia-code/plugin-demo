// @ts-nocheck
import { FC, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List } from 'antd-mobile';
import styled from 'styled-components';

import { ReactComponent as AddIcon } from '@src/assets/icons/add.svg';
import { ReactComponent as ArrowRightIcon } from '@src/assets/icons/arrow-right.svg';
//
import { WindowWrapperCom, AccountHeadPanelCom, AccountPanelCom, FlashCom, TokenIcon, TabsCom } from '@src/pages/commponents';
//
import AccountLayout from '@src/pages/layouts/account_layout';
import { useFooterBar } from '@src/hooks/useFooterBar';
import { useTokenBalanceToCurrencyValue } from '@argentx/packages/extension/src/ui/features/accountTokens/tokenPriceHooks';
//
import { prettifyTokenBalance } from '@argentx/packages/extension/src/shared/token/price';
import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { useTokensWithBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { toTokenView, fetchAllTokensBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';
import { tokenJson } from '@src/theme/tokenJson';

const StyledBody = styled.div`
    min-height:320px;
    padding: 20px 13px;
`;

const StyledTokenList = styled(List)`
    --border-top: 0;
    --border-bottom: 0;
    --border-inner: 0;
    --font-size: var(--adm-font-size-8);
    .adm-list-item-content{
        padding: 10px var(--padding-right) 10px 0;
    }
`;
const StyledTokenListItem = styled(List.Item)`
    background-color: rgba(240, 240, 240, 1);
    margin-bottom: 8px;
    border-radius:10px;
`;

// const StyledButton = styled(Button)`
//     margin: 20px auto;
//     display: block;
//     border-radius:100%;
//     overflow:hidden;
//     line-height:inherit;
//     border-radius:20px;
//     width: 128px;
//     padding: 10px 12px;
// `;

const StyledTokenExtra = styled.div`
    color:var(--adm-color-text);
    margin-right: 16px;
    font-size: 18px;
    >div:nth-of-type(1){
        max-width: 160px;
        word-break: break-all;
        overflow: hidden;
        text-align: right;
    }

    >div:nth-of-type(2){
        font-size:12px;
        text-align:right;
    }
`;

const AccountTokensPage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;

    useEffect(() => {
        if (!account) {
            navigate('/account/list');
        }
    }, [account, navigate]);

    if (account) {
        return <AccountTokensBody account={account} />;
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

const AccountTokensBody: FC<any> = ({ account }) => {
    const navigate = useNavigate();
    useFooterBar('tokens');

    const { isValidating, error, tokenDetailsIsInitialising } = useTokensWithBalance(account);
    const { tokenDetails } = useTokensWithBalance(account);
    for (const item of tokenDetails) {
        item.balanceStr = prettifyTokenBalance(item);
        const str = item.balanceStr.split(' ');
        if (!isNaN(Number(str[0])) && Number(str[0]) < 0.00001 && Number(str[0]) !== 0) {
            item.balanceStr = `< 0.00001 ${str[1]}`;
        }
    }
    // const addressList = tokenJson.map((item) => item.address);

    // fetchAllTokensBalance(
    //     addressList,
    //     account
    // ).then((res) => {
    //     for (const item of tokenJson) {
    //         for (const obj in res) {
    //             if (item.address === obj) {
    //                 // @ts-ignore
    //                 item.balance = res[obj];
    //                 // @ts-ignore
    //                 item.balanceStr = prettifyTokenBalance(item);
    //                 // @ts-ignore
    //                 if (item.balanceStr) {
    //                     // @ts-ignore
    //                     const str = item.balanceStr.split(' ');
    //                     if (!isNaN(Number(str[0])) && Number(str[0]) < 0.00001 && Number(str[0]) !== 0) {
    //                         // @ts-ignore
    //                         item.balanceStr = `< 0.00001 ${str[1]}`;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     // console.log('tokenJson -----', tokenJson);
    // });

    const handleClick = () => {
        navigate('/tokens/new');
    };
    const TokenItemWrapper = isValidating ? FlashCom : Fragment;

    const toDetail = (item: any) => {
        console.log('item ---', item);
        const accountIdentifier = account && getAccountIdentifier(account);
        window.localStorage.setItem(`@"${accountIdentifier}","myToken"`, JSON.stringify(item));
        navigate(`/tokens/${item.address}`, { state: { type: 'detail' } });
    };

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Head>
                <AccountHeadPanelCom>
                    <AccountPanelCom />
                    <TabsCom onChange={(key: string) => {
                        switch (key) {
                        case '1':
                            // navigate('/account/tokens');
                            break;
                        case '2':
                            navigate('/account/nfts');
                            break;
                        case '3':
                            navigate('/account/sbts');
                            break;
                        }
                    }}>
                        <TabsCom.Tab title='Tokens' key='1' />
                        <TabsCom.Tab title='NFTs' key='2' />
                        <TabsCom.Tab title='SBTs' key='3' />
                    </TabsCom>
                </AccountHeadPanelCom>
            </WindowWrapperCom.Head>
            <WindowWrapperCom.Body>
                <StyledBody>
                    <StyledTokenList>
                        {
                            tokenDetails.map((token) => (
                                <TokenListItemContainer key={token.address}>
                                    {
                                        (currencyValue: any) => <StyledTokenListItem
                                            prefix={<div style={{ lineHeight: '100%' }}><TokenIcon {...toTokenView(token)} url={token.image} size={48} /></div>}
                                            extra={
                                                <StyledTokenExtra>
                                                    {/* <div><TokenItemWrapper>{prettifyTokenBalance(token)}</TokenItemWrapper></div> */}
                                                    <div>{(token as any)?.balanceStr}</div>
                                                </StyledTokenExtra>
                                            }
                                            onClick={() => toDetail(token)}
                                            arrow={<ArrowRightIcon />}
                                        >
                                            <p>{token.name}</p>
                                            <p style={{ fontSize: 12, color: '#999' }}>{token.symbol}</p>
                                        </StyledTokenListItem>
                                    }
                                </TokenListItemContainer>
                            ))
                        }
                    </StyledTokenList>
                    {/* <StyledButton onClick={handleClick} color='primary'><AddIcon height={26} /></StyledButton> */}
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default () => <AccountLayout><AccountTokensPage /></AccountLayout>;
