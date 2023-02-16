import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, Grid } from 'antd-mobile';
//
import { openAspectNft } from '@argentx/packages/extension/src/ui/features/accountNfts/aspect.service';
import { openMintSquareNft } from '@argentx/packages/extension/src/ui/features/accountNfts/mint-square.service';
//
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';

const NftDetailCom: FC<any> = ({ contractAddress, nftDetail }) => {
    const navigate = useNavigate();
    const account = useSelectedAccount();

    return (
        <>
            <List.Item>
                <Grid columns={2} gap={8}>
                    <Grid.Item>
                        <Button
                            block
                            onClick={() =>
                                openAspectNft(contractAddress, nftDetail.token_id, account!.networkId)
                            }
                            fill='none'
                            size='small'
                        >View on Aspect</Button>
                    </Grid.Item>
                    <Grid.Item>
                        <Button
                            block
                            onClick={() =>
                                openMintSquareNft(contractAddress, nftDetail.token_id, account!.networkId)
                            }
                            fill='none'
                            size='small'
                        >View on Mint Square</Button>
                    </Grid.Item>
                </Grid>
            </List.Item>
            <List.Item>
                <Button color='primary' onClick={() => { navigate(`/nfts/${contractAddress}`, { state: { type: 'send', tokenId: nftDetail.token_id } }); }} block style={{ borderRadius: '20px', padding: '10px 12px' }}>Send</Button>
            </List.Item>
        </>
    );
};

export default NftDetailCom;
