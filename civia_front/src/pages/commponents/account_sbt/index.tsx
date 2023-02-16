import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Image } from 'antd-mobile';
import styled from 'styled-components';
import { tokenJson } from '@src/theme/tokenJson';
import { fetchAllTokensBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';
import { prettifyTokenBalance } from '@argentx/packages/extension/src/shared/token/price';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';

const StyledGrid = styled.div`
    min-height:64px;
    text-align:center;
    >div{
        display: flex;
        justify-content: center;
        >div{
            display: inline-block;
            margin:2px;
        }
        &:empty{
            display: none;
        }
    }
`;

const StyledImage = styled(Image)`
    width:64px;
    height:64px;
    border-radius:10px;
`;

const AccountSbtCom: FC<any> = ({ address }) => {
    const navigate = useNavigate();
    const addressList = tokenJson?.map((item) => item.address); // address ? [address] : tokenJson?.map((item) => item.address);
    const account = useSelectedAccount() as any;
    const [row1, setRow1] = useState<any[]>([]);
    const [row2, setRow2] = useState<any[]>([]);

    useEffect(() => {
        new Promise((resolve, reject) => {
            fetchAllTokensBalance(
                addressList,
                account
            ).then((res) => {
                const list = [];
                for (const item of tokenJson) {
                    for (const obj in res) {
                        if (item.address === obj) {
                            // @ts-ignore
                            item.balance = res[obj];
                            // @ts-ignore
                            item.balanceStr = prettifyTokenBalance(item);
                            // @ts-ignore
                            const result = item.balanceStr?.split(' ');
                            // @ts-ignore
                            if (result[0] !== '0.0') {
                                list.push(item);
                            }
                        }
                    }
                }
                if (list.length) {
                    resolve(list);
                } else {
                    reject(list);
                }
            });
        }).then((res: any) => {
            if ([1, 3, 4].includes(res.length)) {
                setRow1(res.slice(0, 1));
                setRow2(res.slice(1));
            } else {
                setRow1(res.slice(0, 2));
                setRow2(res.slice(2));
            }
        }).catch(() => {

        });
    }, []);

    const toDetail = (item: any) => {
        if (!address) {
            const accountIdentifier = account && getAccountIdentifier(account);
            window.localStorage.setItem(`@"${accountIdentifier}","myToken"`, JSON.stringify(item));
            navigate(`/tokens/${item.address}`, { state: { type: 'detail' } });
        }
    };

    return (
        <StyledGrid>
            <div>
                {
                    row1 && row1.map((item: any, index) => <div key={index} onClick={() => toDetail(item)}><StyledImage src={item.image} /></div>)
                }
            </div>
            <div>
                {
                    row2 && row2.map((item: any, index) => <div key={index} onClick={() => toDetail(item)}><StyledImage src={item.image} /></div>)
                }
            </div>
        </StyledGrid>
    );
};

export default AccountSbtCom;
