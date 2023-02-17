import { FC, useState, useRef } from 'react';
import { Footer, Input, Button, Form, Toast, Card, Grid } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLongPress } from 'ahooks';

import { ReactComponent as LogoIcon } from '@src/assets/icons/logo.svg';
import { ReactComponent as BackIcon } from '@src/assets/icons/back.svg';

import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
import { useInviteInfo } from '@src/hooks/useAccount';
import { getAddressByTokenId } from '@src/ui/account/accountCommon.service';
//
import { createAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.service';
import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { connectAccount } from '@argentx/packages/extension/src/ui/services/backgroundAccounts';
import { useSelectedAccountStore } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { isDeprecated } from '@argentx/packages/extension/src/shared/wallet.service';
import { sendMessage, waitForMessage } from '@argentx/packages/extension/src/shared/messages';

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
    padding: 20px 0;
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

const StyledTabButton = styled(Button)`
    height:44px;
    margin:4px auto;
    line-height: unset;
    border-radius:20px;
`;

const StyledGridItem = styled(Grid.Item)`
    text-align: center;
`;

const StyledGrid = styled(Grid)`
    padding: 12px;
    text-align:center;
`;

const StyledTabBarWrapper = styled.div`
    >div:nth-child(1){
        position:fixed;
        bottom:0;
        z-index:1000;
        left:0;
        right:0;
        max-width:750px;
        margin:auto;
    }
    >div:nth-child(2){
        display:block;
        height:73px;
        width:1px;
        opacity:transparent;
    }
    .adm-tab-bar-wrap{
        min-height:73px;
        border-top:1px solid rgba(57, 92, 62, 0.34); 
    }
    .adm-tab-bar-item{
        transition: background 1s cubic-bezier(0.075, 0.82, 0.165, 1);
        .adm-tab-bar-item-icon{
            height:unset;
            line-height:unset;
        }
    }
`;

const PasswordPage: FC<any> = () => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const navigate = useNavigate();
    const { switcherNetworkId } = useAppState();
    const [form] = Form.useForm();
    const { setInviteInfo } = useInviteInfo();
    const logoRef = useRef<HTMLElement>(null);

    useLongPress(() => {
        navigate('/onboarding/restore_seed');
    }, logoRef);

    const handleSubmit = async (values: any) => {
        const { nickname, invitecode, password, password2 } = values;
        if (!/^[\w]{3,30}$/.test(nickname)) {
            Toast.show({
                content: 'Nickname must be 3-30 characters of numbers or letters!',
                duration: 3e3
            });
        } else if (!/^\d{6,10}$/.test(invitecode)) {
            Toast.show({
                content: 'Please Enter valid code!',
                duration: 3e3
            });
        } else if (!/^\w{6,30}$/.test(password)) {
            Toast.show({
                content: 'Password must be 6-30 characters of numbers or letters!',
                duration: 3e3
            });
        } else if (!password || (password !== password2)) {
            Toast.show({
                content: 'The two entered passwords do not match!',
                duration: 3e3
            });
        } else {
            setIsCreating(true);
            try {
                const id2AddressRes = await getAddressByTokenId(invitecode);
                const [address] = Array.isArray(id2AddressRes) ? id2AddressRes : [];
                if (address && address.length > 10) {
                    setInviteInfo(invitecode, address, nickname);
                    const newAccount = await createAccount(switcherNetworkId, password);
                    connectAccount(newAccount);
                    useSelectedAccountStore.setState({
                        selectedAccount: newAccount,
                        showMigrationScreen: newAccount ? isDeprecated(newAccount) : false
                    });
                    navigate('/account/initial');
                } else {
                    Toast.show({ content: `${invitecode} is not exist!` });
                }
            } catch (e) {
                console.log(e);
                Toast.show({ content: JSON.stringify(e) });
            } finally {
                setIsCreating(false);
            }
        }
    };

    return (
        <StyledBodyWrapper>
            <WindowWrapperCom loading={isCreating}>
                <WindowWrapperCom.Body>
                    <StyledLogo ref={logoRef as any}><LogoIcon /></StyledLogo>
                    <StyledH3>Create Account</StyledH3>
                    <StyledBody>
                        <StyledForm
                            onFinish={handleSubmit}
                            layout='horizontal'
                            form={form}
                        >
                            <Card>
                                <Form.Item name='nickname'>
                                    <Input placeholder='Enter your nickname' type='nickname' maxLength={30} />
                                </Form.Item>
                                <Form.Item name='invitecode'>
                                    <Input placeholder='Enter your invite code' type='invitecode' maxLength={10} />
                                </Form.Item>
                            </Card>
                            <Card>
                                <Form.Item name='password'>
                                    <Input placeholder='Passsword' type='password' maxLength={20} />
                                </Form.Item>
                                <Form.Item name='password2'>
                                    <Input placeholder='Enter your password again' type='password' maxLength={20} />
                                </Form.Item>
                            </Card>
                        </StyledForm>
                    </StyledBody>
                    <StyledTabBarWrapper>
                        <div>
                            <StyledGrid columns={2} gap={8}>
                                {/* <StyledGridItem>
                                    <StyledTabButton block size='large' onClick={() => { navigate('/onboarding/restore_seed'); }} >Import</StyledTabButton>
                                </StyledGridItem> */}
                                <StyledGridItem>
                                    <StyledTabButton block size='large' onClick={() => { navigate('/onboarding/socal_recovery'); }}>Socal Recovery</StyledTabButton>
                                </StyledGridItem>
                                <StyledGridItem>
                                    <StyledTabButton block color='primary' size='large' onClick={() => { form.submit(); }} >Create</StyledTabButton>
                                </StyledGridItem>
                            </StyledGrid>
                        </div>
                    </StyledTabBarWrapper>
                </WindowWrapperCom.Body>
            </WindowWrapperCom>
        </StyledBodyWrapper>
    );
};

export default PasswordPage;
