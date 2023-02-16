import { FC, useEffect, useState } from 'react';
import { NavBar, List, Image, Empty, ImageProps } from 'antd-mobile';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
//
import { useNfts } from '@argentx/packages/extension/src/ui/features/accountNfts/useNfts';
import useNftImage from '@src/hooks/useNftImage';

import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
//
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { isEqualAddress } from '@argentx/packages/extension/src/ui/services/addresses';
//
import NftDetailCom from './components/detail';
import NftSendCom from './components/send';

interface IStyledImageProps extends ImageProps {
    type? : 'detail'| 'send'
}

const StyledBody = styled.div`
    min-height:320px;
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

const StyledList = styled(List)`
    --border-inner: 0;
    --border-bottom: 0;
    --border-top: 0;
`;

const StyledImage = styled.div<IStyledImageProps>`
    margin: 20px auto;
    width: ${({ type }: any) => type === 'detail' ? '80%' : '100px'}!important;
    background-color: #fefefe;
`;

const AccountCollectionPage: FC<any> = () => {
    const account = useSelectedAccount();
    const navigate = useNavigate();
    const { id: contractAddress } = useParams();
    const location = useLocation();
    const { NftImage, setSrc: setNftImageSrc } = useNftImage();

    const { type, tokenId } = location.state || {};

    const { nfts = [] } = useNfts(account);
    const [nftDetail] = useState(() => {
        return nfts
            .filter(Boolean)
            .find(({ contract_address: itemContractAddress, token_id: itemTokenId }) =>
                contractAddress && isEqualAddress(itemContractAddress, contractAddress) && itemTokenId === tokenId
            ) as any;
    });

    useEffect(() => {
        setNftImageSrc(nftDetail.image_small_url_copy);
    }, [nftDetail.image_small_url_copy, setNftImageSrc]);

    if (!nftDetail) {
        return <Empty />;
    }

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                <StyledBody>
                    <StyledH3>{
                        nftDetail.name ||
                nftDetail.contract.name_custom ||
                nftDetail.contract.name ||
                    'Untitled'
                    }</StyledH3>
                    <StyledList>
                        <List.Item>
                            <StyledImage type={type}>
                                <NftImage src={nftDetail.image_url_copy} />
                            </StyledImage>
                        </List.Item>
                        {type === 'detail' ? <NftDetailCom contractAddress={contractAddress} nftDetail={nftDetail} /> : <NftSendCom contractAddress={contractAddress} nftDetail={nftDetail} />}
                    </StyledList>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default AccountCollectionPage;
