import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavBar, Grid, Image, Empty, Card } from 'antd-mobile';
import styled from 'styled-components';

import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
//
import { useCollection } from '@argentx/packages/extension/src/ui/features/accountNfts/useCollections';
import { getNftPicture } from '@argentx/packages/extension/src/ui/features/accountNfts/aspect.service';
//
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';

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

const StyledCard = styled(Card)`
    border:1px solid var(--adm-color-box);
    &:hover{
        border-color: var(--adm-color-border);
        cursor: pointer;
    }
`;

const StyledImage = styled(Image)`
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #fefefe;
`;

const StyledGrid = styled(Grid)`
    padding: 0 32px;
`;

const AccountListPage: FC<any> = () => {
    const account = useSelectedAccount();
    const navigate = useNavigate();
    const location = useLocation();

    const { name: collectionName, contractAddress } = location.state || {};

    const { collectible, error } = useCollection(contractAddress, account);

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                <StyledBody>
                    <StyledH3>{collectionName}</StyledH3>
                    <StyledGrid columns={2} gap={16}>
                        {
                            collectible?.nfts.length ? (
                                collectible.nfts.map((item) => (
                                    <StyledCard
                                        key={`${item.contract_address}-${item.token_id}`}
                                        title={item.name}
                                        onClick={() => { navigate(`/nfts/${item.contract_address}`, { state: { type: 'detail', tokenId: item.token_id } }); }}
                                    >
                                        <StyledImage src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' style={{ backgroundImage: `url(${(item as any).image_small_url_copy})` }} />
                                    </StyledCard>
                                ))
                            ) : (
                                <Empty />
                            )
                        }
                    </StyledGrid>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default AccountListPage;
