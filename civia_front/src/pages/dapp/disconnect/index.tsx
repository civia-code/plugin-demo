import { FC, useMemo } from 'react';
import { Button, Form, List } from 'antd-mobile';
import { MinusCircleOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import { uniq } from 'lodash-es';
import styled from 'styled-components';

import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';

import {
    removePreAuthorization,
    resetPreAuthorizations,
    usePreAuthorizations
} from '@argentx/packages/extension/src/shared/preAuthorizations';

const StyledBody = styled.div`
     margin:20px 10px;
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

const DappDisconnectPage: FC<any> = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const preAuthorizations = usePreAuthorizations();

    const preauthorizedHosts = useMemo<string[]>(() => {
        return uniq(
            preAuthorizations.map((preAuthorization) => preAuthorization.host)
        ) || [];
    }, [preAuthorizations]);

    const handleResetAll = (values:any) => {
        resetPreAuthorizations();
        navigate(-1);
    };

    const handlerResetOne = async (item: any) => {
        console.log(item);
        const res = await removePreAuthorization(item.host);
        console.log(res);
    };

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom
                    left={
                        <StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>
                    }

                />
                <StyledBody >
                    <StyledH3>Dapp connections</StyledH3>
                    {
                        preAuthorizations.length > 0 ? (
                            <List style={{ '--border-bottom': '0' }}>
                                {
                                    preAuthorizations.map((item, index) => (
                                        <List.Item key={index}
                                            extra={
                                                <Button fill='none'
                                                    onClick={() => { handlerResetOne(item); }}
                                                >
                                                    <MinusCircleOutline />
                                                </Button>
                                            }
                                        >
                                            {item.host}
                                        </List.Item>
                                    ))
                                }
                                <List.Item>
                                    <Button block type='submit' color='primary' size='large'
                                        onClick={handleResetAll}
                                    >Reset all dapp connections</Button>
                                </List.Item>
                            </List>
                        ) : (
                            <div style={{ margin: '30px', fontSize: '12', textAlign: 'center' }}>you haven&apos;t connected to any dapp yet.</div>
                        )
                    }
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default DappDisconnectPage;
