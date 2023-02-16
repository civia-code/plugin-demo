import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, TabBar } from 'antd-mobile';
//
import { ReactComponent as HomeIcon } from '@src/assets/icons/home.svg';
import { ReactComponent as WalletIcon } from '@src/assets/icons/wallet.svg';
import { ReactComponent as PersonalIcon } from '@src/assets/icons/personal.svg';
import { ReactComponent as ActivityIcon } from '@src/assets/icons/activity.svg';

import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';
//
import styled from 'styled-components';
//
import { useFooterBar } from '@src/hooks/useFooterBar';

const StyledIcon = styled.div`
    width:48px;
    height:48px;
    display: inline-block;
    margin:auto;
    text-align:center;
    border-radius:15px;
    svg{
        width:26px;
        height:26px;
        margin-top: 10px;
        path{
            fill: rgba(189, 189, 189, 1)!important;
        }
    }
`;

const StyledTabBarWrapper = styled.div`
    >div:nth-child(1){
        position:fixed;
        bottom:0;
        z-index:1000;
        left:0;
        right:0;
        background:#fff;
    }
    >div:nth-child(2){
        display:block;
        height:73px;
        width:1px;
        opacity:transparent;
    }
    .adm-tab-bar-wrap{
        min-height:73px;
        border-top:1px solid rgba(57, 92, 62, 0.34); 
    }
    .adm-tab-bar-item{
        transition: background 1s cubic-bezier(0.075, 0.82, 0.165, 1);
        .adm-tab-bar-item-icon{
            height:unset;
            line-height:unset;
        }
        &.adm-tab-bar-item-active{
            ${StyledIcon}{
                background-color: var(--color-primary);
                svg{
                    path{
                        fill: #ffffff!important;
                    }
                }
            }
        }
    }
`;

interface ItabItem {
    key: 'home' | 'wallet' | 'tokens' | 'socal' | 'personalCenter' | 'nfts' | 'activity';
    icon: any;
    targetPage: string,
    badge?: string
}

const tabs: Array<ItabItem> = [
    // {
    //     key: 'wallet',
    //     title: 'Civia',
    //     icon: <AppOutline />,
    //     badge: Badge.dot,
    //     targetPage: '/account/wallet'
    // },
    {
        key: 'home',
        icon: <StyledIcon><HomeIcon /></StyledIcon>,
        targetPage: '/account/home'
    },
    {
        key: 'tokens',
        icon: <StyledIcon><WalletIcon /></StyledIcon>,
        targetPage: '/account/tokens'
    },
    {
        key: 'socal',
        icon: <StyledIcon><PersonalIcon /></StyledIcon>,
        targetPage: '/account/socal'
    },
    {
        key: 'activity',
        icon: <StyledIcon><ActivityIcon /></StyledIcon>,
        targetPage: '/account/activity',
        badge: '1'
    }
];

const usePendingTransactionBadge = () => {
    const account = useSelectedAccount() as any;
    const { pendingTransactions } = useAccountTransactions(account);

    return pendingTransactions.length;
};

const FooterCom: FC = () => {
    const navitage = useNavigate();
    const [tabValue, , badge] = useFooterBar(undefined);
    const pendingTransactionBadge = usePendingTransactionBadge();

    const handleTabBarClick = (key: string) => {
        navitage(tabs.find(tab => tab.key === key)!.targetPage);
    };

    return (
        <StyledTabBarWrapper>
            <div>
                <TabBar onChange={handleTabBarClick} activeKey={tabValue}>
                    {
                        tabs.map(item => (
                            <TabBar.Item key={item.key} icon={item.icon} badge={item.badge && pendingTransactionBadge > 0 ? pendingTransactionBadge : null} />
                        ))
                    }
                </TabBar>
            </div>
            <div />
        </StyledTabBarWrapper>
    );
};

export default FooterCom;
