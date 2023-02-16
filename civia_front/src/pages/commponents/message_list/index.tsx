import { FC, useState, useEffect } from 'react';
import { List, Avatar, Grid, Image } from 'antd-mobile';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as GoodIcon } from '@src/assets/icons/good.svg';
import { ReactComponent as CollectionIcon } from '@src/assets/icons/collection.svg';
import { ReactComponent as CommentsIcon } from '@src/assets/icons/comments.svg';
import { ReactComponent as ShareIcon } from '@src/assets/icons/share.svg';
import { getUserDynamics } from '@src/ui/account/accountSocal.service';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { getAccountImageUrlByAddress } from '@src/ui/account/account.service';
import moment from 'moment';

const StyledList = styled(List)`
    --align-items: top;
    --size:48px;
    --border-top: 0;
    --padding-left:0;
    --padding-right:0;
    --font-size: var(--adm-font-size-6);
    --border-bottom: 0;
    .adm-list-item-content-prefix{
        padding: 10px 10px 0 0;
        .adm-avatar{
            border-radius:30px;
        }
    }
    .adm-list-item-content-main{
        padding: 10px 0;
    }
`;

const StyledListItem = styled(List.Item)`

`;

const StyledMessage = styled.div`
    .gray, .link{
        display: inline-block;
        padding: 0 4px;
    }
    .gray{
        color:var(--adm-color-weak);
    }
    .link{
        color: var(--color-primary);
        &:hover{
            color:var(--color-hover);
        }
        &:active{
            color:var(--color-active);
        }
    }
`;
const StyledOpGroup = styled.div`
    padding: 5px 0;
`;

const StyledMesageImageWrapper = styled.div`
    margin: 8px 0;
`;

const StyledMesageImage = styled(Image)`
    width: 100%;
    border-radius: 10px;
    margin-bottom: 8px;
`;

const StyledOpItem = styled(Grid.Item)`
    display:flex;
    >span{
        cursor: pointer;
        display: inline-block;
        width: 100%;
        height:22px;
        line-height:22px;

        &:nth-child(1){
            width: 32px;
            user-select: none;
            svg{
                width:16px;
                height:16px;
                margin-top: 3px;
                display:inline-block;
                path{
                    fill: #C4C4C4!important;
                }

            }
            &.on{
                svg{
                    path{
                        fill: var(--color-primary)!important;
                    }
                }
            }
            &:hover{
                svg{
                    path{
                        fill: var(--color-hover)!important;
                    }
                }
            }
            &:active{
                svg{
                    path{
                        fill: var(--color-active)!important;
                    }
                }
            }
        }
    }
`;

const MessageListCom: FC<any> = ({ dynamicMessageList }) => {
    console.log('dynamicMessageList ---', dynamicMessageList);
    const [followedCount, setFollowedCount] = useState([]);
    const navigate = useNavigate();
    const [maxBlock, setMaxBlock] = useState('');
    const [limit, setLimit] = useState(10);
    const account = useSelectedAccount() as any;

    // const initDynamicsList = async () => {
    //     const res = await getUserDynamics({
    //         account: account?.address,
    //         followed_count: followedCount,
    //         max_block: maxBlock,
    //         limit
    //     });
    // };

    const getMomentTime = (timestamp: number | string) => {
        if (!timestamp) {
            return '';
        }
        const time: any = new Date(timestamp);
        if (time === 'Invalid Date') {
            return '';
        }
        const year: number|string = time.getFullYear();
        let month: number|string = time.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        let day: number|string = time.getDate();
        if (day < 10) {
            day = '0' + month;
        }
        let hour: number|string = time.getHours();
        if (hour < 10) {
            hour = '0' + month;
        }
        let min: number|string = time.getMinutes();
        if (min < 10) {
            min = '0' + month;
        }
        let sec: number|string = time.getSeconds();
        if (sec < 10) {
            sec = '0' + month;
        }
        return moment(`${year}${month}${day} ${hour}:${min}:${sec}`, 'YYYYMMDD HH:mm:ss').fromNow();
    };

    useEffect(() => {
        const res = getMomentTime('1676507722000');
        console.log('res ---', res);
    })

    const toUrl = () => {
        window.open('https://opensea.io/zh-CN/assets/ethereum/0x9401518f4ebba857baa879d9f76e1cc8b31ed197/840');
    }

    return (
        <StyledList>
            {dynamicMessageList && dynamicMessageList.length > 0 && dynamicMessageList.map((item: any, key: number) => {
                return (
                    <div key={key}>
                        {item.to === 'OpenSea' &&
                            <StyledListItem
                                prefix={<Avatar src={getAccountImageUrlByAddress({ accountAddress: item?.from_address })} />}
                            >
                                <StyledMessage>
                                    <div>{item.from}<span className='gray'>{getMomentTime(item.timestamp)}</span></div>
                                    <div>
                                        bought Lil Ghost#840  from
                                        <a className='link' onClick={toUrl}>{item.to}</a>
                                    </div>
                                    <StyledMesageImageWrapper>
                                        <StyledMesageImage src='https://ik.imagekit.io/weirdoghost/840.png' />
                                        {/* <div className='gray'>15.9K views</div> */}
                                    </StyledMesageImageWrapper>
                                    {/* <StyledOpGroup>
                                        <Grid columns={4} gap={8}>
                                            <StyledOpItem><span><GoodIcon /></span><span>191</span></StyledOpItem>
                                            <StyledOpItem><span><CommentsIcon /></span><span>191</span></StyledOpItem>
                                            <StyledOpItem><span><CollectionIcon /></span><span>191</span></StyledOpItem>
                                            <StyledOpItem><span><ShareIcon /></span></StyledOpItem>
                                        </Grid>
                                    </StyledOpGroup> */}
                                </StyledMessage>
                            </StyledListItem>
                        }
                        {item.to !== 'OpenSea' &&
                            <StyledListItem
                                prefix={<Avatar src={getAccountImageUrlByAddress({ accountAddress: item?.from_address })} />}
                            >
                                <StyledMessage>
                                    <div>{item.from}<span className='gray'>{getMomentTime(item.timestamp)}</span></div>
                                    <div>
                                        followed
                                        <a className='link' onClick={() => navigate(`/account/${item.to_address}?id=${item.to_id}&nick_name=${item.to}`)}>{item.to}</a>
                                    </div>
                                    {/* <StyledOpGroup>
                                        <Grid columns={4} gap={8}>
                                            <StyledOpItem><span className='on'><GoodIcon /></span><span>191</span></StyledOpItem>
                                            <StyledOpItem><span><CommentsIcon /></span><span>191</span></StyledOpItem>
                                            <StyledOpItem><span><CollectionIcon /></span><span>191</span></StyledOpItem>
                                            <StyledOpItem><span><ShareIcon /></span></StyledOpItem>
                                        </Grid>
                                    </StyledOpGroup> */}
                                </StyledMessage>
                            </StyledListItem>
                        }
                    </div>
                );
            })}
            {/* <StyledListItem
                prefix={<Avatar src={getAccountImageUrlByAddress({ accountAddress: '1' })} />}
            >
                <StyledMessage>
                    <div>Neo<span className='gray'>-2m</span></div>
                    <div>followed<a className='link'>@Tiger</a></div> */}
                    {/* <StyledOpGroup>
                        <Grid columns={4} gap={8}>
                            <StyledOpItem><span className='on'><GoodIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><CommentsIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><CollectionIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><ShareIcon /></span></StyledOpItem>
                        </Grid>
                    </StyledOpGroup> */}
                {/* </StyledMessage>
            </StyledListItem> */}
            {/* <StyledListItem
                prefix={<Avatar src={getAccountImageUrlByAddress({ accountAddress: '2' })} />}
            >
                <StyledMessage>
                    <div>Neo<span className='gray'>-2m</span></div>
                    <div>bought BAYC#0168  from<a className='link'>OpenSea</a></div>
                    <StyledMesageImageWrapper>
                        <StyledMesageImage src='https://storage.fleek.zone/c33f0f64-9add-4351-ac8c-c869d382d4f8-bucket/civia/QQ图片20230106133037.png' />
                        <div className='gray'>15.9K views</div>
                    </StyledMesageImageWrapper>
                    <StyledOpGroup>
                        <Grid columns={4} gap={8}>
                            <StyledOpItem><span><GoodIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><CommentsIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><CollectionIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><ShareIcon /></span></StyledOpItem>
                        </Grid>
                    </StyledOpGroup>
                </StyledMessage>
            </StyledListItem>
            <StyledListItem
                prefix={<Avatar src={getAccountImageUrlByAddress({ accountAddress: '3' })} />}
            >
                <StyledMessage>
                    <div>Neo<span className='gray'>-2m</span></div>
                    <div>followed<a className='link'>OpenSea</a></div>
                    <StyledOpGroup>
                        <Grid columns={4} gap={8}>
                            <StyledOpItem><span className='on'><GoodIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><CommentsIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><CollectionIcon /></span><span>191</span></StyledOpItem>
                            <StyledOpItem><span><ShareIcon /></span></StyledOpItem>
                        </Grid>
                    </StyledOpGroup>
                </StyledMessage>
            </StyledListItem> */}
        </StyledList>
    );
};

export default MessageListCom;
