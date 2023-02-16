import { FC } from 'react';
import { Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { UserOutline } from 'antd-mobile-icons';
//
import styled from 'styled-components';

const StyledSettingIcon = styled.div`
    font-size:20px;
`;

const HeadAccountCom: FC<any> = () => {
    const navigate = useNavigate();
    return (
        <StyledSettingIcon onClick={() => { navigate('/account/list'); }}>
            <Button fill='none' size='large'><UserOutline /></Button>
        </StyledSettingIcon>
    );
};

export default HeadAccountCom;
