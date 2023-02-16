import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { TokenDetailsWithBalance, useTokensWithBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { fetchAllTokensBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';
import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';
import TokenDetailCom from './components/detail';
import TokenSendCom from './components/send';
import { tokenJson } from '@src/theme/tokenJson';

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

const StyledGrayBtn = styled.div`
    svg{
        path{
            fill: #4A4A4A!important;
        }
    }
`;

const AccountListPage = () => {
    const navigate = useNavigate();
    const { id: tokenAddress } = useParams();
    const location = useLocation();
    const account = useSelectedAccount() as any;
    const { tokenDetails } = useTokensWithBalance(account);
    // const [currentToken, setCurrentToken] = useState<any>([]);
    const [currentToken, setCurrentToken] = useState(() => {
        const currentToken: any = tokenDetails.find(({ address }) => address === tokenAddress);
        return currentToken;
    });

    // fetchAllTokensBalance(
    //     // @ts-ignore
    //     [tokenAddress],
    //     account
    // ).then((res) => {
    //     for (const item of tokenJson) {
    //         for (const obj in res) {
    //             if (item.address === obj) {
    //                 // @ts-ignore
    //                 item.balance = res[obj];
    //                 // @ts-ignore
    //                 setCurrentToken(item);
    //             }
    //         }
    //     }
    // });

    const { type } = location.state || {};
    const accountIdentifier = account && getAccountIdentifier(account);
    // @ts-ignore
    const myToken = JSON.parse(window.localStorage.getItem(`@"${accountIdentifier}","myToken"`));

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                <StyledH3 >{(type === 'detail' ? '' : 'Send ') + myToken.symbol}</StyledH3>
                <StyledBody>
                    {type === 'detail'
                        ? <TokenDetailCom
                            tokenAddress={tokenAddress}
                            currentToken={currentToken}
                            imageUrl={myToken.image}
                            balanceStr={myToken.balanceStr}
                        />
                        : <TokenSendCom
                            tokenAddress={tokenAddress}
                            currentToken={currentToken}
                            imageUrl={myToken.image}
                            balanceStr={myToken.balanceStr}
                        />}
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default AccountListPage;
