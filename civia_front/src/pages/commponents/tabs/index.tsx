import React, { FC } from 'react';
import { Tabs, TabsProps, TabProps } from 'antd-mobile';
import styled from 'styled-components';

const StyledTabs = styled(Tabs)<TabsProps>`
    --active-line-color: #fff;
    --active-title-color: #fff;
    color:#fff;
    font-size:16px;
    font-weight: 500;
    .adm-tabs-header{
        border-bottom: 0;
    }
    .adm-tabs-tab{
        min-width:54px;
        text-align:center;
    }
    .adm-tabs-tab-active{
        font-size:18px;
    }
    .adm-tabs-tab-line{
        height: 5px;
        min-width:54px;
        border-radius:2px;
        background-color: rgba(255, 255, 255, 0.75);
    }
`;

const TabsItemCom:FC<TabProps> = props => <React.Fragment {...props} />;

const TabsCom:FC<TabsProps> & { Tab: typeof TabsItemCom } = props => <StyledTabs {...props} />;

TabsCom.Tab = TabsItemCom;

export default TabsCom;
