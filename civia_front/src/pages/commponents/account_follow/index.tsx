import { FC, useState, Fragment, useEffect } from 'react';
import { Button, ButtonProps, Grid, Toast } from 'antd-mobile';
import styled, { css } from 'styled-components';

import { LoadingCom, FlashCom } from '@src/pages/commponents';
import TransactionApproveCom from '@src/pages/commponents/transaction_approve';

import { useLocalCache } from '@src/hooks/useAccount';
import { useFollowStatus } from '@src/hooks/useFollow';
import { socalFollowTrans, socalUnFollowTrans, getAllSocalList } from '@src/ui/account/accountSocal.service';

import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';
import { isEqualAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { useActions } from '@argentx/packages/extension/src/ui/features/actions/actions.state';

const StyledGrid = styled(Grid)`
    width: 280px;
    margin:auto;
`;
const StyledGridItem = styled(Grid.Item)`

`;

const StyledFollowCom = styled.div`
    color:#fff;
    text-align:center;
    >span{
        display: inline-block;
        font-weight:800;
        margin-right: 8px;
    }
`;

interface IFollowBtnProps extends ButtonProps {
    ftype: 1 | 2
}

const StyledFollowBtn = styled(Button)<IFollowBtnProps>`
    --adm-color-text:#fff;
    --adm-color-hover: #fff;
    --adm-color-active: #fff;
    width:118px;
    display: block;
    margin: 16px auto;
    border-radius:20px;
    position: relative;
    background-color: var(--color-primary);
    border-color: transparent!important;
    transition: unset;
    &:hover{
        background-color: var(--color-hover);
    }
    &:active{
        background-color: var(--color-active);
    }
    &:after{
        font-family: iconfont;
        content: 'Follow';
        display:block;
        position: absolute;
        width:100%;
        height:100%;
        left:0;
        top:0;
        line-height:27px;
    }
    ${({ ftype }) => ftype === 2 && css`
        background-color:inherit;
        border-color: inherit!important;
        &:after{
            content: 'Followed';
            background: url(/src/assets/icons/check.svg) no-repeat 14px center;
            text-indent: 14px;
        }
        &:hover{
            background: #D43030;
            border-color: transparent!important;
            &:after{
                content: 'Unfollow';
                background-image: url(/src/assets/icons/cancel.svg);
                background-position: 16px center;
            }
        }
    `}
`;

const AccountFollowlCom: FC<any> = ({ accountAddress, account }) => {
    const [isLoading, setIsLoading] = useState(false);
    const actions = useActions();
    const { getFollowStatusByAddress } = useFollowStatus();
    const userActions = actions.filter(item => {
        console.log('item.payload -----', item.payload);
        // const { transactions: { calldata, entrypoint } } = item.payload as any;
        const { transactions } = item.payload as any;
        if (transactions.length || transactions.length === 0) {
            const [{ calldata, entrypoint }] = transactions;
            if (entrypoint === 'follow' || entrypoint === 'unfollow') {
                return (calldata as string[]).includes(accountAddress);
            }
            return false;
        } else {
            const { calldata, entrypoint } = transactions;
            if (entrypoint === 'follow' || entrypoint === 'unfollow') {
                return (calldata as string[]).includes(accountAddress);
            }
            return false;
        }
    });
    const accountIdentifier = account && getAccountIdentifier({ ...account, address: accountAddress });
    const havePendingStatus = ['RECEIVED', 'PENDING'].includes(getFollowStatusByAddress(accountAddress));
    console.log(havePendingStatus);

    const { data: socalList = { followingData: [], followersData: [] }, isValidating, mutate } = useLocalCache(async () => {
        return getAllSocalList(accountAddress).then((res) => {
            if (res) {
                return res;
            } else {
                const localRes = window.localStorage.getItem(`@"${accountIdentifier}","socalList"`);
                return localRes ? JSON.parse(localRes) : { followingData: [], followersData: [] };
            }
        });
    }, { key: `@"${accountIdentifier}","socalList"`, revalidateOnFocus: false, revalidateOnReconnect: false, revalidateIfStale: false });
    const { followingData, followersData } = socalList;
    const FollowingFlashCom = (havePendingStatus || isValidating) ? FlashCom : Fragment;
    const FollowedFlashCom = (havePendingStatus || isValidating) ? FlashCom : Fragment;

    useEffect(() => {
        mutate();
    }, [mutate]);

    const handleFollow = async (isFollowed: boolean, accountAddress?: string) => {
        setIsLoading(true);
        try {
            const res = await (isFollowed ? socalUnFollowTrans(accountAddress as string) : socalFollowTrans(accountAddress as string));
            console.log(res);
        } catch (err: any) {
            Toast.show({ content: String(err) });
        } finally {
            setIsLoading(false);
        }
    };

    const isFollowed = followersData.some((follower: {address: string}) => isEqualAddress(follower.address, account.address)) ? 2 : 1;

    return (
        <>
            <StyledGrid columns={2}>
                <StyledGridItem>
                    <StyledFollowCom><span><FollowingFlashCom>{followingData.length}</FollowingFlashCom></span>Followings</StyledFollowCom>
                </StyledGridItem>
                <StyledGridItem>
                    <StyledFollowCom><span><FollowedFlashCom>{followersData.length}</FollowedFlashCom></span>Followers</StyledFollowCom>
                </StyledGridItem>
                <StyledGridItem span={3}>
                    <FollowedFlashCom><StyledFollowBtn size='small' fill='outline' ftype={isFollowed} onClick={() => { !isValidating && handleFollow(isFollowed === 2, accountAddress); }}>&nbsp;</StyledFollowBtn></FollowedFlashCom>
                </StyledGridItem>
            </StyledGrid>
            <LoadingCom visible={isLoading} />
            {
                userActions.length > 0 ? (<TransactionApproveCom actions={userActions} />) : null
            }
        </>
    );
};

export default AccountFollowlCom;
