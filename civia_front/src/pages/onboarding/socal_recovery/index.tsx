import { FC, useEffect, useState, useMemo } from 'react';
import { List, Footer, Button, Card, Toast } from 'antd-mobile';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useInterval } from 'ahooks';
import { number, shortString } from 'starknet';

import { ReactComponent as LogoIcon } from '@src/assets/icons/logo.svg';
import { WindowWrapperCom, NavBarCom, AllUserList, LoadingCom } from '@src/pages/commponents';
import PasswordCom from './components/password';

import { doLeaveMessage, getAllAccounts } from '@src/ui/account/accountSocal.service';
import { getSigner, addRecoveriedAddress, getGuardianSize } from '@src/ui/account/account.service';
import { useLocalCache } from '@src/hooks/useAccount';

import { getNetworkSelector } from '@argentx/packages/extension/src/shared/account/selectors';
import { unhideAccount, accountStore } from '@argentx/packages/extension/src/shared/account/store';
import { useArrayStorage } from '@argentx/packages/extension/src/shared/storage/hooks';
import { WalletAccount } from '@argentx/packages/extension/src/shared/wallet.model';
import { useSelectedAccount, useSelectedAccountStore } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { formatTruncatedAddress, normalizeAddress, isEqualAddress, isValidAddress, formatFullAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { connectAccount } from '@argentx/packages/extension/src/ui/services/backgroundAccounts';
import { isDeprecated } from '@argentx/packages/extension/src/shared/wallet.service';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { useCurrentNetwork } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import { defaultNetwork } from '@argentx/packages/extension/src/shared/network';
// import './index.less';
const { decodeShortString } = shortString;

const StyledBodyWrapper = styled.div`
    background: rgba(249, 255, 247, 1);
    --body-wrapper-background: rgba(249, 255, 247, 1);
    height:100%;
    left:0;
    top:0;
    width:100%;
    min-height: 100vh;
    border:1px solid transparent;
`;

const StyledGrayBtn = styled.div`
    svg{
        path{
            fill: #4A4A4A!important;
        }
    }
`;

const StyledBody = styled.div`
    
`;

const StyledLogo = styled.div`
    padding: 20px 0 10px;
    text-align:center;
    svg{
        width:56px;
        height:56px;
        display:inline-block;
        margin:auto;
        path{
            fill: var(--color-primary)!important;
        }
    }
`;

const StyledList = styled(List)`
    --adm-color-background: transparent;
    margin:20px 10px;
`;

const StyledCard = styled(Card)`
    .adm-card-body{
        height: 220px;
        overflow: scroll;
        ::-webkit-scrollbar {
            display: none;
        }
    }
`;

const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledAcceptButton = styled(Button)`
    height:40px;
    border-radius:20px;
    width:242px;
    margin:4px auto;
    line-height: unset;
`;

const StyledAcceptGroup = styled.div`
    padding: 10px 0;
`;

export const mapWalletAccountsToAccounts = (
    walletAccounts: WalletAccount[]
): Account[] => {
    return walletAccounts.map(
        (walletAccount) =>
            new Account({
                address: walletAccount.address,
                network: walletAccount.network,
                signer: walletAccount.signer,
                hidden: walletAccount.hidden,
                type: walletAccount.type
            })
    );
};

const SocalRecoveryPage: FC<any> = () => {
    const navigate = useNavigate();
    const network = useCurrentNetwork();
    const account = useSelectedAccount();
    const allAccounts = useArrayStorage(accountStore);

    const [accounts] = useMemo(() => {
        return allAccounts.filter(getNetworkSelector(network.id ?? defaultNetwork.id)).reduce(([accounts, hiddeAccounts]: any, item: any) => {
            item.hidden ? hiddeAccounts.push(item) : accounts.push(item);
            return [accounts, hiddeAccounts];
        }, [[], []]);
    }, [allAccounts, network.id]);

    const mapedAccount = mapWalletAccountsToAccounts(accounts);

    return (
        <StyledBodyWrapper>
            <WindowWrapperCom>
                <WindowWrapperCom.Body>
                    <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                    <StyledLogo><LogoIcon /></StyledLogo>
                    <StyledH3>Social Recovery</StyledH3>
                    {
                        account ? <SocalRecoveryBody account={account} mapedAccount={mapedAccount} /> : <PasswordCom />
                    }
                </WindowWrapperCom.Body>
            </WindowWrapperCom>
        </StyledBodyWrapper>
    );
};

const SocalRecoveryBody: FC<any> = ({ account, mapedAccount }) => {
    const accountAddress = normalizeAddress(account?.address!);
    const storageKey = `${accountAddress},guardians`;
    // @ts-ignore
    const [localNameList, setLocalNameList] = useState<[string, string[]]>(JSON.parse(window.localStorage.getItem(storageKey)) || ['', []]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecoveried, setIsRecoviried] = useState(false);
    const [recoveryRadioValue, setRecoveryRadioValue] = useState(localNameList[0]);
    const [guardiansCheckValue, setGuardiansCheckValue] = useState<string[]>(localNameList[1]);
    const [guardianSize, setGuardianSize] = useState<1|3>(1);
    const [recoveriedAccount, setRecoveriedAccount] = useState();

    const { data: allUserList, isValidating, mutate } = useLocalCache(() => {
        return getAllAccounts(account?.address, 1, 200).then((res: any) => {
            if (res && res?.length) {
                const list = [];
                for (let i = 0; i < res[0].length; i++) {
                    res[0][i].length > 10 && list.push({
                        address: number.toHex(res[0][i]),
                        accountId: number.hexToDecimalString(res[1][i]),
                        nickname: decodeShortString(res[2][i])
                    });
                }
                return list;
            }
        });
    }, { key: 'allAccount', revalidateOnFocus: false, revalidateOnReconnect: false });

    useEffect(() => {
        const recoveriedAccounts = mapedAccount.filter((item:Account) => isEqualAddress(item.address, recoveryRadioValue)) || [];
        if (recoveriedAccounts.length > 0) {
            useSelectedAccountStore.setState({
                selectedAccount: recoveriedAccounts[0],
                showMigrationScreen: account ? isDeprecated(account) : false
            });
            connectAccount(recoveriedAccounts[0]);
            setRecoveriedAccount(recoveriedAccounts[0]);
        }
    }, [mapedAccount, recoveryRadioValue, account]);

    useEffect(() => {
        if (isRecoveried) {
            addRecoveriedAddress({ oldOwnerAddress: recoveryRadioValue });
        }
    }, [isRecoveried, recoveryRadioValue]);
    //
    const handleSendRecoveryMessageClick = async () => {
        if (account) {
            //
        } else {
            //
        }
    };

    const clearInterval = useInterval(async () => {
        console.log('wait messge');
    }, 5e3);

    const isValid = recoveryRadioValue && ((guardianSize === 1 && guardiansCheckValue.length >= 1) || (guardianSize === 3 && guardiansCheckValue.length >= 2));

    if (recoveriedAccount) {
        return <Navigate to='/account/home' />;
    }

    return (
        <StyledBody>
            <StyledList mode='card'>
                <StyledCard title='Account to recover'>
                    <AllUserList
                        gridType="listRadio"
                        list={allUserList}
                        checkValue={recoveryRadioValue}
                        handleCheckChange={(val: string) => {
                            setRecoveryRadioValue(val);
                            getGuardianSize(val).then((res: 1|3) => {
                                setGuardianSize(res || 1);
                            });
                        }}
                    />
                </StyledCard>
            </StyledList>
            <StyledList mode='card'>
                <StyledCard title='Guardians'>
                    <AllUserList
                        gridType="listCheck"
                        list={allUserList}
                        checkValue={guardiansCheckValue}
                        handleCheckChange={(val: string[]) => { setGuardiansCheckValue(val); }}
                    />
                </StyledCard>
            </StyledList>
            <StyledAcceptGroup>
                <StyledAcceptButton block type='submit' color='primary' size='large' loadingText='creating' onClick={handleSendRecoveryMessageClick} disabled={!isValid || localNameList[0].length > 10}>Submit recovery request</StyledAcceptButton>
            </StyledAcceptGroup>
            <LoadingCom visible={isLoading || isValidating || localNameList[0].length > 10} />
        </StyledBody>
    );
};

export default SocalRecoveryPage;
