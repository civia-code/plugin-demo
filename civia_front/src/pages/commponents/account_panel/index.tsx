import { FC, useState, useEffect, ReactNode, Fragment } from 'react';
import { Toast, Grid, Avatar } from 'antd-mobile';
import { FolderOutline } from 'antd-mobile-icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { LoadingCom } from '@src/pages/commponents';
//
import { useGetAccountInfo, IAccountInfoData } from '@src/hooks/useAccount';
import { getAccountImageUrlByAddress } from '@src/ui/account/account.service';

import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { formatTruncatedAddress, isValidAddress, normalizeAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { getAccountName, useAccountMetadata } from '@argentx/packages/extension/src/ui/features/accounts/accountMetadata.state';
//
import FlashCom from '../flash';

const StyledAvatar = styled(Avatar)``;

const StyledCopyWrapper = styled.div`
    margin: auto;
    display: inline-block;
`;

const AccountGroup = styled.div`
    display: flex;
    width:250px;
    /* transform: translateX(25px); */
    margin:auto;
    align-items: center;

    ${StyledAvatar} {
        --size:64px;
        border:4px solid #fff;
        margin:8px auto;
        border-radius: 30px;
    }

    >div{
        vertical-align: middle;
        padding: 14px 0;
        &:first-child{
            width:100%;
            font-size:14px;
            font-weight: bold;
            text-align:center;
            p{
                line-height:15px;
                font-size: initial;
                font-weight: initial;
                font-size:12px;
                cursor: pointer;
                color:#fff;
            }
        }
    }
`;

const StyledInput = styled.input`
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width:100%;
    border:0;
    outline:0;
    padding: 5px 3px;
    border:1px solid transparent;
    background:transparent;
    color:#fff;
`;

const StyledP = styled.p`
    line-height:18px;
    padding:0 5px;
    border-radius: 9px;
    display: inline-block;
    &:hover{
        background:rgba(0,0,0,0.05);
    }
`;
interface IAccountPanelProps {
    children?: () => ReactNode
}

const AccountPanelCom: FC<IAccountPanelProps> = ({ children: funcChildren }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [seedPhraseCopied, setSeedPhraseCopied] = useState(false);
    const account = useSelectedAccount() as Account;
    const { accountNames, setAccountName } = useAccountMetadata();
    //
    const accountName = getAccountName(account, accountNames);
    const { accountInfoData = {}, accountInfoValidating, mutate } = useGetAccountInfo(account, account.address);
    const { sbtInfo = '0', idInfo = '0', nickName = null, domainInfo = '0' } = accountInfoData as IAccountInfoData;

    if (domainInfo && domainInfo !== '0' && domainInfo !== accountName) {
        setAccountName(account.networkId, account.address, domainInfo);
    }

    useEffect(() => {
        if (seedPhraseCopied) {
            Toast.show({ content: 'copyed' });
            setSeedPhraseCopied(false);
        }
    }, [seedPhraseCopied]);

    const inputValue = ['0', '0x0'].includes(idInfo) ? '-----' : `#${idInfo}`;

    return (
        <>
            <AccountHead
                address={account.address}
                nickName={nickName}
                isLoading={isLoading}
                isNameFlash={false}
                funcChildren={funcChildren}
                maxLength={30}
                inputRest={{
                    value: inputValue,
                    readOnly: true,
                    isShow: true
                }}
            />
        </>
    );
};

const AccountHead: FC<any> = ({ isNameFlash = false, address, nickName, inputRest = {}, funcChildren, isLoading, onHeaderClick = () => {} }) => {
    //
    const AccountNameWrapper = isNameFlash ? FlashCom : Fragment;
    //
    return (
        <>
            <AccountGroup>
                <div>
                    <StyledAvatar src={getAccountImageUrlByAddress({ accountAddress: address })} onClick={onHeaderClick} />
                    <AccountNameWrapper>
                        <StyledInput maxLength={30} value={nickName || '-----'} readOnly />
                    </AccountNameWrapper>
                    {/* {
                        inputRest.isShow && (
                            <div>
                                <CopyToClipboard
                                    onCopy={() => Toast.show({ content: 'copyed!' })}
                                    text={inputRest.value.slice(1)}
                                ><StyledP>{inputRest.value}</StyledP></CopyToClipboard>
                            </div>
                        )
                    } */}
                    <StyledCopyWrapper>
                        <CopyToClipboard
                            onCopy={() => Toast.show({ content: 'copyed!' })}
                            text={normalizeAddress(address)}
                        >
                            <StyledP>{formatTruncatedAddress(address)}&nbsp;<FolderOutline /></StyledP>
                        </CopyToClipboard>
                    </StyledCopyWrapper>
                </div>
            </AccountGroup>
            {
                funcChildren && funcChildren()
            }
            <LoadingCom visible={isLoading} />
        </>
    );
};

(AccountPanelCom as any).AccountHead = AccountHead;

export default AccountPanelCom as any;
