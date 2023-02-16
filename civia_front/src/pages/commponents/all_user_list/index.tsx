import { FC, Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Avatar, List, DotLoading, Empty, Checkbox, Radio } from 'antd-mobile';
import styled from 'styled-components';
import { getAccountImageUrlByAddress } from '@src/ui/account/account.service';
import { FlashCom, LoadingCom } from '@src/pages/commponents';
import { ReactComponent as ArrowRightIcon } from '@src/assets/icons/arrow-right.svg';

const StyledGrid = styled(Grid)`
    margin: 22px;
`;

const StyledGridAvatar = styled(Avatar)`
    margin:0 auto;
    border-radius:28px;
    width:56px;
    height:56px;
`;

const StyledListAvatar = styled(Avatar)`
    --size: 40px;
    border-radius:20px;
`;

const StyledListAvatarSM = styled(Avatar)`
    --size: 22px;
    border-radius:11px;
`;

const StyledTextSM = styled.p`
    font-size: 16px;
`;

const StyledTextSM2 = styled.span`
    font-size: 12px;
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

const StyledList = styled(List)`
    --border-top: 0px;
    --border-bottom: 0px;
    font-size:12px!important;
`;

export const AllUserList: FC<any> = ({
    gridType = 'flex',
    gridNum = 3,
    list = [],
    currentList = [],
    isValidating,
    checkValue = [],
    handleCheckChange,
    disabled
}) => {
    const navigate = useNavigate();

    const FollowingFlashCom = isValidating ? FlashCom : Fragment;

    const formatAddressId = (address: string, id: string | null) => {
        return id ? `#${id}` : '#';
    };

    return (
        <>
            {
                gridType === 'flex' &&
                    <StyledGrid columns={gridNum} gap={8}>
                        {
                            list.length > 0 ? (
                                list.map((item: any) => (
                                    <StyledGridItem onClick={() => navigate(`/account/${item.address}?id=${item.accountId}&nick_name=${item.nickname}`)} hasSbt key={item.address}>
                                        <div>
                                            <StyledGridAvatar src={getAccountImageUrlByAddress({ accountAddress: item.address })} />
                                            {/* <div>#{item.accountId}</div> */}
                                            <div style={{ marginTop: 5 }}>{item.nickname}</div>
                                        </div>
                                    </StyledGridItem>
                                ))
                            ) : <Empty />
                        }
                    </StyledGrid>
            }
            {
                gridType === 'list' &&
                    <StyledList mode='card'>
                        {
                            list.length > 0 ? (
                                list.map((item: any) => (
                                    <List.Item key={item.address}
                                        prefix={<StyledListAvatar src={getAccountImageUrlByAddress({ accountAddress: item.address })} />}
                                        onClick={() => navigate(`/account/${item.address}?id=${item.accountId}&nick_name=${item.nickname}`)}
                                        arrow={item.isPending ? <DotLoading color='primary' /> : <ArrowRightIcon />}
                                    >
                                        <FollowingFlashCom>{item.nickname}</FollowingFlashCom>
                                        {/* <FollowingFlashCom>(#{item.accountId})</FollowingFlashCom> */}
                                    </List.Item>
                                ))
                            ) : <Empty />
                        }
                    </StyledList>
            }
            {
                gridType === 'listNoNav' &&
                    <StyledList mode='card'>
                        {
                            currentList.map((item: any) => (
                                <List.Item key={item.address}
                                    prefix={<StyledListAvatarSM src={getAccountImageUrlByAddress({ accountAddress: item.address })} />}
                                >
                                    {/* <StyledTextSM></StyledTextSM> */}
                                    <StyledTextSM>{item.nickname}</StyledTextSM>
                                </List.Item>
                            ))
                        }
                        {
                            list.map((item: any) => (
                                <List.Item key={item.address}
                                    prefix={<StyledListAvatarSM src={getAccountImageUrlByAddress({ accountAddress: item.address })} />}
                                >
                                    {/* <StyledTextSM></StyledTextSM> */}
                                    <StyledTextSM>{item.nickname}</StyledTextSM>
                                </List.Item>
                            ))
                        }
                    </StyledList>
            }
            {
                gridType === 'listCheck' &&
                    <StyledList mode='card'>
                        {
                            list.length ? (
                                list.map((item: any) => (
                                    <Checkbox.Group key={item.address} value={checkValue} onChange={handleCheckChange} disabled={disabled}>
                                        <List.Item
                                            prefix={
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox value={item.address} style={{ marginRight: 10, marginLeft: -10 }} />
                                                    <StyledListAvatar src={getAccountImageUrlByAddress({ accountAddress: item.address })} />
                                                </div>
                                            }
                                            arrow={item.isPending ? <DotLoading color='primary' /> : <ArrowRightIcon onClick={() => navigate(`/account/${item.address}?id=${item.accountId}&nick_name=${item.nickname}`)} />}
                                        >
                                            <FollowingFlashCom>
                                                {/* <p> ({item.address.substring(0, 5) + '.....' + item.address.substring(item.address.length - 5)})</p> */}
                                                {/* <p>{item.nickname}(#{item.accountId})</p> */}
                                                <p>{item.nickname}</p>
                                            </FollowingFlashCom>
                                        </List.Item>
                                    </Checkbox.Group>
                                ))
                            ) : (isValidating ? <LoadingCom visible /> : <Empty />)
                        }
                    </StyledList>
            }
            {
                gridType === 'listRadio' &&
                    <StyledList mode='card'>
                        {
                            list.length ? (
                                list.map((item: any) => (
                                    <Radio.Group key={item.address} value={checkValue} onChange={handleCheckChange} disabled={disabled}>
                                        <List.Item
                                            prefix={
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Radio value={item.address} style={{ marginRight: 10, marginLeft: -10 }} />
                                                    <StyledListAvatar src={getAccountImageUrlByAddress({ accountAddress: item.address })} />
                                                </div>
                                            }
                                            arrow={item.isPending ? <DotLoading color='primary' /> : <ArrowRightIcon onClick={() => navigate(`/account/${item.address}?id=${item.accountId}&nick_name=${item.nickname}`)} />}
                                        >
                                            <FollowingFlashCom>
                                                <p>{item.nickname}</p>
                                            </FollowingFlashCom>
                                        </List.Item>
                                    </Radio.Group>
                                ))
                            ) : (isValidating ? <LoadingCom visible /> : <Empty />)
                        }
                    </StyledList>
            }
        </>
    );
};
