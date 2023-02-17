import { FC, useEffect, useState } from 'react';
import { Button, TextArea, NavBar, Card, Input, Form, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
//
import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
import { getAccountInfoFromAPI } from '@src/ui/account/accountCommon.service';

import {
    validateSeedRecoveryCompletion
} from '@argentx/packages/extension/src/ui/features/recovery/seedRecovery.state';

import { recoverBySeedPhrase } from '@argentx/packages/extension/src/ui/services/backgroundRecovery';
import { recover } from '@argentx/packages/extension/src/ui/features/recovery/recovery.service';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';

const StyledBody = styled.div`
    padding: 10px;
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

const StyledSubtitle = styled.div`
    color:#999;
    padding:0 10px 10px;
`;

const RestoreSeedPage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;
    const [isRestoring, setIsRestoring] = useState(false);

    console.log(account);
    useEffect(() => {
        if (account && account.address) {
            navigate('/account/home');
            // setIsRestoring(true);
            // getAccountInfoFromAPI(account.address).then((res: any) => {
            //     const accountIdentifier = account && getAccountIdentifier(account);
            //     const key = `@"${accountIdentifier}","accountInfo"`;
            //     swrCacheProvider.set(key, res);
            //     console.log(res);
            //     navigate('/account/home');
            // }).finally(() => {
            //     setIsRestoring(false);
            // });
        }
    }, [account]);
    //
    const handleSubmit = async (values: any) => {
        const { seedPhrase, password } = values;

        if (!/^\w{5,30}$/.test(password)) {
            return Toast.show({
                icon: 'fail',
                content: 'Password is tool simple!'
            });
        }

        const valid = validateSeedRecoveryCompletion({ seedPhrase, password });
        if (valid) {
            setIsRestoring(true);
            await recoverBySeedPhrase(seedPhrase, password).then(async () => {
                setIsRestoring(false);
                const url = await recover();
                // navigate('/account/home');
            }).catch((err: any) => {
                setIsRestoring(false);
                Toast.show({
                    content: err.toString()
                });
            });
        } else {
            console.log('invalid seed');
        }
    };

    return (
        <WindowWrapperCom loading={isRestoring}>
            <WindowWrapperCom.Body>
                <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                <StyledH3>Restore accounts</StyledH3>
                <StyledBody>
                    <Card>
                        <StyledSubtitle>Enter each of the 12 words from your recovery phrase separated by a space</StyledSubtitle>
                        <Form
                            onFinish={handleSubmit}
                            footer={<Button block type='submit' color='primary' size='large' style={{ borderRadius: '20px' }} >Submit</Button>}
                        >
                            <Form.Item name='seedPhrase'>
                                <TextArea placeholder='seed' rows={4} autoSize />
                            </Form.Item>
                            <Form.Item name='password'>
                                <Input placeholder='password' type='password' maxLength={30} />
                            </Form.Item>
                        </Form>
                    </Card>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default RestoreSeedPage;
