import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Popover, Card, Swiper } from 'antd-mobile';
import styled from 'styled-components';
//
import { useFooterBar } from '@src/hooks';
//
import { HeadAccountCom, NetworkSwitcherCom, AccountPanelCom } from '@src/pages/commponents';
import AccountLayout from '@src/pages/layouts/account_layout';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledPopoverAnchor = styled.div`
    position: fixed;
    bottom:50px;
    left:50%;
`;

const StyledSwiperBody = styled.div`
    text-align:center;
    padding: 50px 0;
    margin: 0 30px;
    border:1px solid #efefef;
    border-radius: 5px;
    >div{
        font-size:18px;
        font-weight: bold;
        margin-bottom:10px;
    }
`;

const AccountWalletPage: FC<any> = () => {
    const navigate = useNavigate();
    useFooterBar('wallet');

    const handleClick = () => {
        //
    };

    return (
        <div>
            <NavBar back={null} left={<HeadAccountCom />} onBack={() => { navigate(-1); }} right={<NetworkSwitcherCom />} />
            <StyledBody>
                <AccountPanelCom>
                    {
                        () => (
                            <Card>
                                <Swiper>
                                    <Swiper.Item key={0}>
                                        <StyledSwiperBody>
                                            <div>0.26</div>
                                            <p>ETH</p>
                                        </StyledSwiperBody>
                                    </Swiper.Item>
                                    <Swiper.Item key={2}>
                                        <StyledSwiperBody>
                                            <div>0.26</div>
                                            <p>BTC</p>
                                        </StyledSwiperBody>
                                    </Swiper.Item>
                                </Swiper>
                            </Card>
                        )
                    }
                </AccountPanelCom>
                <Popover
                    visible
                    content={<div>
                        22-10-10 Eric#67873621 Bought NFT -
                        BAYC #22 on &lt;OpenSea&gt;
                        2022-10-10 Joye #987634 Swap 0.12 BTC
                        from USDC on &lt;UniSwap&gt;
                        2022-10-12 Joye #987634 Followed &lt;Tiger&gt;
                    </div>}
                ><StyledPopoverAnchor /></Popover>
            </StyledBody>
        </div>
    );
};

export default () => <AccountLayout><AccountWalletPage /></AccountLayout>;
