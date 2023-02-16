import { FC } from 'react';
import styled from 'styled-components';

const StyledHead = styled.div`
    background:url('/head-bg.png') #000;
    background-size:102% auto;
    background-position: 0 0;
    background-repeat: no-repeat;
    margin-bottom: -40px;
    padding-bottom:50px;
    z-index: -1;
`;

const AccountHeadPanelCom: FC<any> = ({ children }) => {
    return (<StyledHead>
        {
            children
        }
    </StyledHead>);
};

export default AccountHeadPanelCom;
