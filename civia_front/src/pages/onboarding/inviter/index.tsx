import { FC, useState } from 'react';
import { Footer, Input, Button, Form, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { number } from 'starknet';

import { ReactComponent as LogoIcon } from '@src/assets/icons/logo.svg';
import { ReactComponent as BackIcon } from '@src/assets/icons/back.svg';

import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
import { getAddressByTokenId } from '@src/ui/account/accountCommon.service';
import { useInviteInfo } from '@src/hooks/useAccount';

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

const StyledBackIcon = styled(BackIcon)`
    path {
        fill: #4A4A4A;
    }
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledForm = styled(Form)`
    padding: 40px 0;
    ---border-inner: 0;
    ---border-top: 0;
    ---border-bottom: 0;
    .adm-list-body{
        --adm-color-background: transparent;
    }
    .adm-form-item{
        margin:23px
    }
    .adm-list-item-content-main{
        padding: 6px 25px;
        background:rgba(232, 232, 232, 0.5);
        border-radius:18px;
    }
`;

const StyledAcceptButtonGroup = styled.div`
    text-align:center;
    margin-top:30px;
`;

const StyledAcceptButton = styled(Button)`
    height:60px;
    border-radius:30px;
    width:242px;
    margin:4px auto;
    line-height: unset;
    .adm-button-loading-wrapper {
        flex-direction: column;
    }
`;

const InviterPage: FC<any> = () => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setInviteInfo } = useInviteInfo();

    const handleSubmit = async (values: any) => {
        const { inviteCode } = values;
        if (!/^\d{6,10}$/.test(inviteCode)) {
            Toast.show({
                content: 'Please Enter valid code!'
            });
        } else {
            setIsCreating(true);
            const newAccount = await getAddressByTokenId(inviteCode);
            const [address] = Array.isArray(newAccount) ? newAccount : [];
            setIsCreating(false);
            if (address) {
                setInviteInfo(inviteCode, address, '');
                navigate('/onboarding/password');
            } else {
                Toast.show({ content: `${inviteCode} is not exist!` });
            }
        }
    };
    return (
        <StyledBodyWrapper>
            <WindowWrapperCom>
                <WindowWrapperCom.Body>
                    <NavBarCom left={<div onClick={() => { navigate(-1); }}><NavBarCom.Icon><StyledBackIcon /></NavBarCom.Icon></div>} />
                    <StyledLogo><LogoIcon /></StyledLogo>
                    <StyledH3>Create Account</StyledH3>
                    <StyledBody>
                        <StyledForm
                            footer={
                                <StyledAcceptButtonGroup>
                                    <div><StyledAcceptButton block type='submit' color='primary' size='large' loading={isCreating}>Commit</StyledAcceptButton></div>
                                </StyledAcceptButtonGroup>}
                            onFinish={handleSubmit}
                            layout='horizontal'
                        >
                            <Form.Item name='inviteCode'>
                                <Input placeholder='Enter your invite code' type='text' maxLength={30} autoComplete='false' />
                            </Form.Item>
                        </StyledForm>
                    </StyledBody>
                </WindowWrapperCom.Body>
            </WindowWrapperCom>
        </StyledBodyWrapper>
    );
};

export default InviterPage;
