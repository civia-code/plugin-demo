import { FC } from 'react';
import { List, Button } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const StyledList = styled(List)`
    --align-items: top;
    --size:48px;
    --border-top: 0;
    --padding-left:0;
    --padding-right:0;
    --font-size: var(--adm-font-size-6);
    --border-bottom: 0;
    --adm-color-background: transparent;
    background: #efefef;
    border-radius: 15px;
    padding:0 5px;
    position:relative;
    word-break:break-all;
    margin-bottom: 10px;
    .adm-list-item-content-prefix{
        padding: 10px 10px 0 0;
        .adm-avatar{
            border-radius:30px;
        }
    }
    .adm-list-item-content-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }
`;

const StyledListItem = styled(List.Item)`
`;

const StyledContent = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const StyledButton = styled(Button)`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 50%;
`;

export const NoGuardiansTips: FC<any> = () => {
    const navigate = useNavigate();

    return (<StyledList>
        <StyledListItem>
            <StyledContent>Set Up Account Recovery</StyledContent>
            <StyledButton color='primary' onClick={() => { navigate('/account/secruity_level'); }} >
                <RightOutline />
            </StyledButton>
        </StyledListItem>
    </StyledList>);
};
