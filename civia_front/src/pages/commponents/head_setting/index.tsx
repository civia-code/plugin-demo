import { FC } from 'react';
import { Button } from 'antd-mobile';
import { SetOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledSettingIcon = styled.div`
    font-size:20px;
`;

const HeadSettingCom: FC<any> = () => {
    const navigate = useNavigate();
    return (
        <StyledSettingIcon onClick={() => { navigate('/settings/panel'); }}>
            <Button fill='none' size='large'><SetOutline /></Button>
        </StyledSettingIcon>
    );
};

export default HeadSettingCom;
