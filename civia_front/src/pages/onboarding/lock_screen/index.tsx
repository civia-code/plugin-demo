import { FC } from 'react';
import { Input, Button, Card, Form, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
//
import { WindowWrapperCom } from '@src/pages/commponents';

import { startSession } from '@argentx/packages/extension/src/ui/services/backgroundSessions';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledForm = styled(Form)`
    padding: 20px 0;
`;

const LockScreenPage:FC<any> = ({ targetPage }) => {
    const navigate = useNavigate();

    const handleSubmit = async (values: any) => {
        const { password } = values;
        if (password) {
            try {
                await startSession(password);
                navigate(targetPage || '/account/tokens');
            } catch (e) {
                Toast.show((e as string).toString());
            }
        }
    };
    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <StyledBody>
                    <StyledH3>Civia</StyledH3>
                    <Card>
                        <StyledForm
                            footer={
                                <Button block type='submit' color='primary' size='large' style={{ borderRadius: ' 20px' }}>Unlock</Button>
                            }
                            onFinish={handleSubmit}
                            layout='horizontal'
                        >
                            <Form.Header>Unlock your wallet to continue.</Form.Header>
                            <Form.Item name='password'>
                                <Input placeholder='Passsword' type='password' />
                            </Form.Item>
                        </StyledForm>
                    </Card>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default LockScreenPage;
