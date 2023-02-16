import { FC, useState, useEffect } from 'react';
import { Grid, Form, Button, Input, Card, Toast } from 'antd-mobile';
import styled from 'styled-components';

import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { createAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.service';
import { connectAccount } from '@argentx/packages/extension/src/ui/services/backgroundAccounts';
import { useSelectedAccount, useSelectedAccountStore } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { isDeprecated } from '@argentx/packages/extension/src/shared/wallet.service';

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

const PasswordCom: FC<any> = () => {
    const [form] = Form.useForm();
    const { switcherNetworkId } = useAppState();

    const handleSubmit = async (values: any) => {
        const { password, password2 } = values;
        if (!/^\w{6,30}$/.test(password)) {
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
            const newAccount = await createAccount(switcherNetworkId, password);
            connectAccount(newAccount);
            useSelectedAccountStore.setState({
                selectedAccount: newAccount,
                showMigrationScreen: newAccount ? isDeprecated(newAccount) : false
            });
        }
    };
    return (
        <>
            <StyledBody>
                <StyledForm
                    onFinish={handleSubmit}
                    layout='horizontal'
                    form={form}
                >
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
                    <StyledGrid columns={1} gap={8}>
                        <StyledGridItem>
                            <StyledTabButton block color='primary' size='large' onClick={() => { form.submit(); }} >Continue</StyledTabButton>
                        </StyledGridItem>
                    </StyledGrid>
                </div>
            </StyledTabBarWrapper>
        </>
    );
};

export default PasswordCom;
