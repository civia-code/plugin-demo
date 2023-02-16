import { FC } from 'react';
import { NavBar, List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledList = styled(List)`
    margin: 0 20px;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const TokensFundingBridgePage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;
    const isMainnet = account.networkId === 'mainnet-alpha';

    const bridgeUrl = isMainnet
        ? 'https://starkgate.starknet.io'
        : account.networkId === 'goerli-alpha' &&
      'https://goerli.starkgate.starknet.io';

    return (
        <div>
            <NavBar back='back' onBack={() => { navigate(-1); }} />
            <StyledH3>Bridge your assets</StyledH3>
            <StyledBody>
                <StyledList>
                    {
                        bridgeUrl ? (
                            <List.Item description='Bridge trustlessly from Ethereum' onClick={() => { chrome.tabs.create({ url: bridgeUrl }); }}>StarkGate</List.Item>
                        ) : (
                            <List.Item description='Not available for this network' disabled>Bridge from Ethereum</List.Item>
                        )
                    }
                </StyledList>
            </StyledBody>
        </div>
    );
};

export default TokensFundingBridgePage;
