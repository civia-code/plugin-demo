import { FC, PropsWithChildren, ReactElement, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, NavBar } from 'antd-mobile';
import { useClickAway } from 'ahooks';
import styled from 'styled-components';

import { ReactComponent as LogoIcon } from '@src/assets/icons/logo.svg';
import { ReactComponent as AddIcon } from '@src/assets/icons/add.svg';
import { ReactComponent as BackIcon } from '@src/assets/icons/back.svg';
import { ReactComponent as Add2Icon } from '@src/assets/icons/add2.svg';
import { ReactComponent as SettingIcon } from '@src/assets/icons/setting.svg';

const StyledNavBar = styled.div`
    position: relative;
    left:0;
    right: 0;
    top:0;
    max-width:750px;
    margin:auto;
    z-index: 500;
`;

const StyledIcon = styled.div`
    display:inline-block;
    position:absolute;
    left:22px;
    top:24px;
    cursor:pointer;
    user-select: none;
    min-width: 20px;
    z-index: 100;
    height: 32px;
    width: 32px;
    text-align: center;
    padding-top: 2px;
    svg{
        width:26px;
        height:26px;
        path: {
            fill: #fff!important;
        }
    }
`;

const StyledAdd = styled(StyledIcon)`
    left:unset;
    right:22px;
    top:24px;
`;

const StyledAddPanel = styled.div`
    position: absolute;
    left:unset;
    right:22px;
    top:24px;
    
    ${StyledAdd}{
        position: unset;
    
    }
`;

const StyledAddPanelMenu = styled.div<any>`
    position:absolute;
    right: 0;
    top: 100%;
    border-radius:10px;
    overflow:hidden;
    display: ${({ isShow }) => isShow ? 'inherit' : 'none'};

    .adm-list-item-content-main{
        padding: 8px 0;
        text-align:left;
        font-size:12px;
    }
    .adm-list-item:hover{
        background:#fafafa;
    }
`;

const StyledAPMIcon = styled.div`
    svg{
        width: 16px;
        height:16px;
        float:left;
    }
`;

type NavBarComProps = {
    left?: ReactElement,
    right?: ReactElement
};

const NavBarCom: FC<NavBarComProps> & { Back: ReactElement, Logo: ReactElement, Add: ReactElement, Icon: FC<PropsWithChildren<any>>, AddPanel: FC<PropsWithChildren<any>> } = ({ left, right }) => {
    return (
        <StyledNavBar><NavBar backArrow={left} style={{ '--height': '0px' }} right={right} /></StyledNavBar>
    );
};

const AddPanel: FC<any> = ({ children: childrenRender = (props: ReactElement) => props, ...rest }) => {
    const navigate = useNavigate();
    const [isShow, setIsShow] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    useClickAway(() => {
        setIsShow(false);
    }, ref);

    return (
        <StyledAddPanel>
            <span ref={ref} onClick={() => { setIsShow(!isShow); }}>
                {
                    NavBarCom.Add
                }
            </span>
            <StyledAddPanelMenu isShow={isShow}>
                <List>
                    {
                        childrenRender(
                            <>
                                <List.Item prefix={<StyledAPMIcon><Add2Icon /></StyledAPMIcon>} onClick={() => { navigate('/account/search'); }} arrow={false}>Follow friends</List.Item>
                                <List.Item prefix={<StyledAPMIcon><SettingIcon /></StyledAPMIcon>} onClick={() => { navigate('/settings/panel'); }} arrow={false}>Settings</List.Item>
                            </>
                        )
                    }
                </List>
            </StyledAddPanelMenu>
        </StyledAddPanel>
    );
};

NavBarCom.Icon = props => <StyledIcon {...props} />;
NavBarCom.Back = <StyledIcon><BackIcon /></StyledIcon>;
NavBarCom.Add = <StyledAdd><AddIcon /></StyledAdd>;
NavBarCom.Logo = <StyledIcon><LogoIcon /></StyledIcon>;
NavBarCom.AddPanel = AddPanel;

export default NavBarCom;
