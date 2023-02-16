import { FC } from 'react';
import { NavBar, List, Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import {
    getAccountName,
    useAccountMetadata
} from '@argentx/packages/extension/src/ui/features/accounts/accountMetadata.state';
import { formatFullAddress } from '@argentx/packages/extension/src/ui/services/addresses';

import { QrCode } from '@src/pages/commponents';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledList = styled(List)`
    text-align:center;
    --border-top: 0;
    --border-bottom: 0;
    --border-inner: 0;
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledAccountAddress = styled.div`
    padding: 10px 30px;
`;

const TokensFundingQrcodePage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount() as Account;
    const { accountNames } = useAccountMetadata();

    return (
        <div>
            <NavBar back='back' onBack={() => { navigate(-1); }} />
            <StyledBody >
                <StyledList>
                    <List.Item>
                        <QrCode size={220} data={account?.address} />
                    </List.Item>
                    <List.Item>
                        <StyledH3>{getAccountName(account, accountNames)}</StyledH3>
                    </List.Item>
                    <List.Item>
                        <StyledAccountAddress>
                            {formatFullAddress(account.address)}
                        </StyledAccountAddress>
                    </List.Item>
                    <List.Item>
                        <CopyToClipboard
                            onCopy={() => Toast.show('copyed')}
                            text={account.address}
                        >
                            <Button size='small'>Copy address</Button>
                        </CopyToClipboard>
                    </List.Item>
                </StyledList>
            </StyledBody>
        </div>
    );
};

export default TokensFundingQrcodePage;
