import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, NavBar, List, Toast } from 'antd-mobile';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
//
import { usePrivateKey } from '@argentx/packages/extension/src/ui/features/accountTokens/usePrivateKey';

const StyledBody = styled.div`
     margin:20px 10px;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledList = styled(List)`
    --border-inner: 0;
    --border-bottom: 0;
    --border-top: 0;
`;

const StyledListItem = styled(List.Item)`
    font-size:12px;
    color:#999;
`;

const StyledListItemKey = styled(List.Item)`
    user-select: none;
    cursor:pointer;
`;

const ExportPrivateKeyPage: FC<any> = () => {
    const navigate = useNavigate();
    const privateKey = usePrivateKey();

    return (
        <div>
            <NavBar back='back' onBack={() => { navigate(-1); }} />
            <StyledBody >
                <StyledH3>Export private key</StyledH3>
                <StyledList mode='card'>
                    <StyledListItem>This is your private key (click to copy)</StyledListItem>
                    <CopyToClipboard
                        onCopy={() => Toast.show({ content: 'copyed' })}
                        text={privateKey || ''}
                    >
                        <StyledListItemKey style={{ wordBreak: 'break-all' }} arrow={false}>{privateKey}</StyledListItemKey>
                    </CopyToClipboard>
                    <StyledListItem>Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.</StyledListItem>
                    <List.Item>
                        <Button block onClick={() => { navigate('/account/tokens'); }} >Done</Button>
                    </List.Item>
                </StyledList>
            </StyledBody>
        </div>
    );
};

export default ExportPrivateKeyPage;
