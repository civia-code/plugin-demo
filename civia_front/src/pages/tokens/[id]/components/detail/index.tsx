import { FC } from 'react';
import { Card, Button, List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TokenIcon } from '@src/pages/commponents';

import { PendingTransactionsCom, AccountActivity } from '@src/pages/commponents/account_activity';

import { toTokenView } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';

import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';

import { prettifyTokenBalance } from '@argentx/packages/extension/src/shared/token/price';

const StyledListItem = styled(List.Item)`
    text-align: center;
`;

const StyledList = styled(List)`
    --border-inner: 0;
    --border-bottom: 0;
    --border-top: 0;
`;

const TokenDetailCom: FC<any> = ({ tokenAddress, currentToken, balanceStr, imageUrl }) => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;

    return (
        <>
            <Card>
                <StyledList>
                    <StyledListItem>
                        <TokenIcon {...toTokenView(currentToken)} url={imageUrl} size={64} />
                    </StyledListItem>
                    <StyledListItem>
                        {prettifyTokenBalance(currentToken)}
                        {/* {balanceStr} */}
                    </StyledListItem>
                    <List.Item>
                        <Button block color='primary' onClick={() => { navigate(`/tokens/${tokenAddress}`, { state: { type: 'send' } }); }} style={{ borderRadius: '20px', padding: '10px 12px' }}>Send</Button>
                    </List.Item>
                </StyledList>
            </Card>
            {
                account ? (
                    <Card>
                        <List mode='card'>
                            <PendingTransactionsCom account={account} />
                            <AccountActivity account={account} />
                        </List>
                    </Card>
                ) : null
            }
        </>
    );
};

export default TokenDetailCom;
