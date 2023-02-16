import { FC, useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { useNavigate } from 'react-router-dom';
import { SearchBar, Toast, Grid, Avatar, Empty } from 'antd-mobile';
import styled from 'styled-components';

import { WindowWrapperCom, LoadingCom, NavBarCom, AllUserList } from '@src/pages/commponents';
import { useGetIdsByAddressList } from '@src/hooks/useAccount';

import { getAllAccounts } from '@src/ui/account/accountSocal.service';
import { getAddressByTokenId } from '@src/ui/account/accountCommon.service';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { getAccountImageUrlByAddress } from '@src/ui/account/account.service';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { number, shortString } from 'starknet';
const { decodeShortString } = shortString;

const equal0 = (val: string | number) => {
    return val === '0' || val === 0 || val === '0x0' || val === '0x';
};
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

const StyledSearchBar = styled.div`
    padding: 10px 13px;
    
    .adm-search-bar-input-box{
        --border-radius: 20px;
        flex-direction: row-reverse;
        padding-right: var(--padding-left);
    }
`;

const StyledGrid = styled(Grid)`
    margin: 22px;
`;

const StyledAvatar = styled(Avatar)`
    margin:0 auto;
    border-radius:28px;
    width:56px;
    height:56px;
`;

const StyledGridItem = styled(Grid.Item)<any>`
    >div{
        border-radius: 10px;
        /* height:100px; */
        background:#F2F3F5;
        text-align:center;
        padding: 6px 0;
        ${({ hasSbt }) => hasSbt ? '' : 'filter: grayscale(100%);'}
    }
`;

const StyledEmpty = styled.div`
    padding: 32px 0;
    text-align: center;
`;

const AccountSearchPage: FC<any> = () => {
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);
    const [searchedAccount, setSearchedAccount] = useState<string|undefined>();
    const account = useSelectedAccount();
    const storageKey = `${account?.address},buddy`;
    // @ts-ignore
    const [searchedRes, setSearchedRes] = useState<any[]>(JSON.parse(window.localStorage.getItem(storageKey)) || []);
    console.log('searchedRes ---', searchedRes);
    const { updateLocal } = useGetIdsByAddressList();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const isfresh = window.localStorage.getItem('isfresh');
        console.log('isfresh -----', isfresh);
        if (isfresh === '1') {
            console.log('从别人主页回来不刷新页面');
        } else {
            console.log('从其他页面过来要判断刷新');
            if (account) {
                // setLoading(true);
                if (searchedRes && searchedRes.length < 50) {
                    console.log('不到50个继续加载');
                    getAllAccounts(
                        account?.address, 1, 100).then((res: any) => {
                    // console.log('res -----', res);
                        if (res && res?.length) {
                            const list = [];
                            for (let i = 0; i < res[0].length; i++) {
                                res[0][i].length > 10 && list.push({
                                    address: number.toHex(res[0][i]),
                                    accountId: number.hexToDecimalString(res[1][i]),
                                    nickname: decodeShortString(res[2][i])
                                });
                            }
                            console.log('list -----', list);
                            window.localStorage.setItem(storageKey, JSON.stringify(list));
                            // @ts-ignore
                            setSearchedRes(list);
                            setLoading(false);
                        }
                    });
                }
            }
        }
    }, []);

    // const handleSearch = async (val: string = '') => {
    //     const tmpVal = (val.match(/\d+/) || []).pop();
    //     if (!tmpVal) {
    //         return;
    //     }
    //     setIsSearching(true);
    //     setSearchedRes([]);
    //     new Promise((resolve, reject) => {
    //         const result = getToken(tmpVal);
    //         resolve(result);
    //     }).then((res) => {
    //         // @ts-ignore
    //         if (res && res?.length) {
    //             console.log('res -----', res);
    //             const tmpRes = (res as string[]).map(item => {
    //                 updateLocal(item, tmpVal);
    //                 return {
    //                     address: item,
    //                     id: tmpVal
    //                 };
    //             });
    //             setSearchedRes(tmpRes);
    //         } else {
    //             Toast.show({
    //                 icon: 'fail',
    //                 content: 'id is not exist'
    //             })
    //         }
    //     }).finally(() => {
    //         setIsSearching(false);
    //     });
    // };

    const getToken = async (tokenId: string) => {
        const res = await getAddressByTokenId(tokenId);
        return res;
    };

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                <StyledH3>Follow friends</StyledH3>
                {
                    searchedRes && searchedRes.length ? (
                        <AllUserList
                            gridType={'flex'}
                            gridNum={3}
                            list={searchedRes}
                        />
                    ) : (
                        isLoading ? <LoadingCom visible /> : <StyledEmpty><Empty /></StyledEmpty>
                    )
                }
                <LoadingCom visible={isSearching} mask={false} />
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default AccountSearchPage;
