import { FC, useState } from 'react';
import { NavBar, List, Form, Input, Card } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { throttle } from 'lodash-es';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { useTokensWithBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { toTokenView } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';
import { TokenIcon } from '@src/pages/commponents';
import {
    prettifyTokenBalance
} from '@argentx/packages/extension/src/shared/token/price';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledInputWrap = styled.div`
    margin: 30px 20px;
    border: 1px solid #efefef;
    padding: 10px 5px;
    border-radius: 5px;
`;

const TokensSendPage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;
    const { tokenDetails } = useTokensWithBalance(account);
    const [filterKey, setFilterKey] = useState<RegExp>(/.*/);

    const handleSearchInpuChange = throttle((val) => {
        setFilterKey(new RegExp(val, 'gi'));
    }, 300);

    const handleItemClick = ({ address }: any) => {
        navigate(`/tokens/${address}`, { state: { type: 'send' } });
    };

    return (
        <div>
            <NavBar back='back' onBack={() => { navigate(-1); }} >Send</NavBar>
            <StyledBody>
                <Form
                    style={{ '--border-bottom': '0px', '--border-top': '0px' }}
                >
                    <StyledInputWrap>
                        <Input placeholder='Search' onChange={handleSearchInpuChange} />
                    </StyledInputWrap>
                    <List mode='card'>
                        {
                            tokenDetails.filter((token) => filterKey?.test(token.name)).map((token, index) => (
                                <List.Item
                                    description={token.symbol}
                                    prefix={<div style={{ lineHeight: '100%' }}><TokenIcon {...toTokenView(token)} url={token.image} size={30} /></div>}
                                    extra={<div>{prettifyTokenBalance(token)}</div>}
                                    onClick={() => { handleItemClick(token); }} key={index}
                                >{token.name}</List.Item>
                            ))
                        }
                    </List>
                </Form>

            </StyledBody>
        </div>
    );
};

export default TokensSendPage;
