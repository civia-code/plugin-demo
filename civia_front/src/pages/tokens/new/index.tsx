
import { FC, useState, useMemo } from 'react';
import { Button, Toast, Form, Input } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { LoadingCom, WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
import { isValidAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { fetchTokenDetails } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { addToken } from '@argentx/packages/extension/src/shared/token/storage';

const StyledBody = styled.div`
     margin:0px 10px;
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

const TokensNewPage: FC<any> = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const account = useSelectedAccount();
    const [tokenAddress, setTokenAddress] = useState();
    const [isNext, setIsNext] = useState(false);
    const [isAllValid, setIsAllValid] = useState(false);
    const [isGetTokenDetailLoading, setIsGetTokenDetailLoading] = useState(false);
    const [tokenDetail, setTokenDetail] = useState({});

    const validAddress = useMemo(() => {
        return isValidAddress(tokenAddress!);
    }, [tokenAddress]);
    //
    const handleSubmit = async (value: any) => {
        if (validAddress && !Reflect.has(value, 'name')) {
            setIsGetTokenDetailLoading(true);
            const details = await fetchTokenDetails(tokenAddress!, account!);
            setIsGetTokenDetailLoading(false);
            if (details && details.address) {
                setIsNext(true);
                setTokenDetail(details);
                form.setFieldsValue(details);
            } else {
                Toast.show({ content: 'error' });
            }
        } else {
            // commit
            const addResult = await addToken(tokenDetail as any);
            console.log(addResult);
            navigate(-1);
        }
    };

    const handleCheckFileds = async () => {
        // form.validateFields().then((errors) => {
        //     console.log(errors);
        //     if (!errors) {
        //         setIsAllValid(true);
        //     }
        // });
    };

    const isDisabled = isNext ? (isAllValid) : (!validAddress);

    return (
        <WindowWrapperCom loading={isGetTokenDetailLoading}>
            <WindowWrapperCom.Body>
                <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                <StyledBody >
                    <StyledH3>Add tokens</StyledH3>
                    <div>
                        <Form
                            form={form}
                            footer={
                                <Button block type='submit' disabled={isDisabled} style={{ borderRadius: '20px', padding: '10px 0' }}>Continue</Button>
                            }
                            onFinish={handleSubmit}
                            onValuesChange={handleCheckFileds}
                        >
                            <Form.Item name='address' label='Contract address'>
                                <Input autoFocus
                                    onChange={(e: any) => {
                                        setTokenAddress(e.toLowerCase());
                                    }}
                                    readOnly={isNext}
                                    autoComplete="off"
                                />
                            </Form.Item>
                            {
                                isNext ? (
                                    <>
                                        <Form.Item name='name' label='Name'>
                                            <Input type='input' readOnly />
                                        </Form.Item>
                                        <Form.Item name='symbol' label='Symbol'>
                                            <Input readOnly />
                                        </Form.Item>
                                        <Form.Item name='decimals' label='Decimals'>
                                            <Input readOnly />
                                        </Form.Item>
                                    </>
                                ) : null
                            }
                        </Form>
                    </div>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default TokensNewPage;
