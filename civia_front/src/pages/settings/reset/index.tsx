import { FC } from 'react';
import { Button, List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';

import { resetAll } from '@argentx/packages/extension/src/ui/services/background';
import { useSelectedAccountStore } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';

const StyledBody = styled.div`
     margin:20px 10px;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledGrayBtn = styled.div`
    svg{
        path{
            fill: #4A4A4A!important;
        }
    }
`;

const StyledList = styled(List)`
    --border-bottom: 0;
`;

const ResetPage: FC<any> = () => {
    const navigate = useNavigate();
    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom
                    left={
                        <StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>
                    }

                />
                <StyledH3>Reset wallet</StyledH3>
                <StyledBody>
                    <StyledList mode='card'>
                        <List.Item>
                    If you reset your wallet, the only way to recover it is with your 12-word seed phrase. Make sure to back it up from the Civia settings and save it somewhere securely before resetting the extension
                        </List.Item>
                        <List.Item>
                            <Button block
                                onClick={() => {
                                    resetAll();
                                    localStorage.clear();
                                    useSelectedAccountStore.setState({});
                                    navigate('/onboarding/password');
                                }}
                                color='primary'
                                size='large'
                                style={{ borderRadius: '20px' }}
                            >reset</Button>
                        </List.Item>
                    </StyledList>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default ResetPage;
