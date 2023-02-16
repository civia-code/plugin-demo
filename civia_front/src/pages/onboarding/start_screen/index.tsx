import { FC } from 'react';
import { Button, List, Footer } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as LogoIcon } from '@src/assets/icons/logo.svg';
import { ReactComponent as CreateAccountIcon } from '@src/assets/icons/createAccount.svg';
import { ReactComponent as LoginIcon } from '@src/assets/icons/logIn.svg';
import { ReactComponent as SocialRecoveryIcon } from '@src/assets/icons/socialRecovery.svg';
//
import { WindowWrapperCom, NetworkSwitcherCom } from '@src/pages/commponents';

const StyledBodyWrapper = styled.div`
    background: rgba(249, 255, 247, 1);
    --body-wrapper-background: rgba(249, 255, 247, 1);
    height:100%;
    left:0;
    top:0;
    width:100%;
    min-height:100vh;
    border:1px solid transparent;
    
`;

const StyledNetworkSwitcherComWrapper = styled.div`
    width: 215px;
    height:30px;
    margin:30px auto 0;
    --adm-button-background-color: transparent;
`;

const StyledLogo = styled.div`
    padding: 20px 0 10px;
    text-align:center;
    svg{
        width:56px;
        height:56px;
        display:inline-block;
        margin:auto;
        path{
            fill: var(--color-primary)!important;
        }
    }
`;

const StyledList = styled(List)`
    --border-top:0;
    --border-bottom:0;
    --border-inner:0;
    --adm-color-background: transparent;
    .adm-list-item-content-main{
        padding:25px 0;
    }
`;

const StyledIcon = styled.span`
    display: inline-block;
    margin-right:14px;
    height:26px;
    svg{
        width:26px;
        height:26px;
        text-align:center;
    }
`;

const StyledButton = styled(Button)`
    width:242px;
    height:54px;
    line-height:38px;
    border-radius: 20px;
    font-size: 16px;
    margin:auto;
    >span{
        display: flex;
        align-items: center;
        margin: auto;
        justify-content: center;
    }
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StartScreenPage: FC<any> = () => {
    const navigate = useNavigate();

    return (
        <StyledBodyWrapper>
            <WindowWrapperCom>
                <WindowWrapperCom.Body>
                    <StyledNetworkSwitcherComWrapper>
                        <NetworkSwitcherCom disabled />
                    </StyledNetworkSwitcherComWrapper>
                    <StyledLogo><LogoIcon /></StyledLogo>
                    <StyledH3>Welcome to Civia</StyledH3>
                    <StyledList>
                        <List.Item>
                            <StyledButton block onClick={() => { navigate('/onboarding/inviter'); }} color='primary'><StyledIcon><CreateAccountIcon /></StyledIcon>Create Account</StyledButton>
                        </List.Item>
                        <List.Item>
                            <StyledButton block onClick={() => { navigate('/onboarding/restore_seed'); }}><StyledIcon><LoginIcon /></StyledIcon>Import Account</StyledButton>
                        </List.Item>
                        {/* <List.Item disabled>
                            <StyledButton block onClick={() => { navigate('/account/socal_recovery'); }}><StyledIcon><SocialRecoveryIcon /></StyledIcon>Socal Recovery</StyledButton>
                        </List.Item> */}
                    </StyledList>
                    <Footer content='Need help? Contact Civia support' style={{ '--background-color': 'transparent', '--adm-color-light': '#000', margin: '40px auto 0' } as any} />
                </WindowWrapperCom.Body>
            </WindowWrapperCom>
        </StyledBodyWrapper>
    );
};

export default StartScreenPage;
