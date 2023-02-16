import { FC } from 'react';
import { CenterPopup, SpinLoading, CenterPopupProps } from 'antd-mobile';
//
import styled from 'styled-components';

//
const StyledLoadingDialog = styled(CenterPopup)`
    --background-color: transparent;
    .adm-center-popup-mask{
        background: transparent!important;
    }

    span {
        margin: auto;
        --adm-color-weak: var(--adm-color-primary);
        width:32px;
        display:block;
    }
`;

const LoadingCom: FC<CenterPopupProps> = ({ visible, ...rest }) => {
    return (
        <StyledLoadingDialog visible={visible} {...rest}>
            <span><SpinLoading /></span>
        </StyledLoadingDialog>
    );
};

export default LoadingCom;
