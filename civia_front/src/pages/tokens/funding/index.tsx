import { FC } from 'react';
import { NavBar, List, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import { normalizeAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';

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

const TokensFundingPage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as Account;
    const currentNetwork = useCurrentNetwork();

    const handleFaucetCopyed = () => {
        Toast.show({ content: 'copyed' });
        setTimeout(() => {
            chrome.tabs.create({ url: 'https://faucet.goerli.starknet.io/' });
        }, 500);
    };

    return (
        <div>
            <NavBar back='back' onBack={() => { window.history.go(-1); }} />
            <StyledH3>How would you like to fund your account?</StyledH3>
            <StyledBody>
                <StyledList>
                    <List.Item description='Is coming soon!' disabled>Buy with card or bank transfer</List.Item>
                    <List.Item onClick={() => { navigate('/tokens/funding_qrcode'); }} arrow={false}>From another StarkNet account</List.Item>
                    <List.Item onClick={() => { navigate('/tokens/funding_bridge'); }}>Bridge from Ethereum and other chains</List.Item>
                    {
                        currentNetwork?.id === 'goerli-alpha' ? (
                            <CopyToClipboard
                                onCopy={() => handleFaucetCopyed()}
                                text={normalizeAddress(account.address)}
                            >
                                <List.Item arrow={false}>Faucet</List.Item>
                            </CopyToClipboard>
                        ) : null
                    }
                </StyledList>

            </StyledBody>
        </div>
    );
};

export default TokensFundingPage;
