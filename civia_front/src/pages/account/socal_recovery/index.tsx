import { FC, useEffect, useState } from 'react';
import { NavBar, List, Footer, Checkbox, SearchBar, Button, Card, Dialog, TextArea, Input, Toast, Empty, DotLoading } from 'antd-mobile';
import { CheckCircleFill, SearchOutline, DeleteOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import clone from 'clone';
import { useInterval } from 'ahooks';
import { ReactComponent as LogoIcon } from '@src/assets/icons/logo.svg';
import { WindowWrapperCom, NavBarCom, AllUserList } from '@src/pages/commponents';
import { getSessionToken, doLeaveMessage, getUserMessages, doReadMessage, getAllAccounts } from '@src/ui/account/accountSocal.service';
import { getSigner, getGuardianSize, changeGuardians, triggerEscapeOwner, escapeOwner, getAccountImageUrlByAddress } from '@src/ui/account/account.service';
import { getAccountInfo, getAddressByTokenId } from '@src/ui/account/accountCommon.service';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { formatTruncatedAddress, normalizeAddress, isEqualAddress, isValidAddress, formatFullAddress } from '@argentx/packages/extension/src/ui/services/addresses';
// import './index.less';

const StyledBodyWrapper = styled.div`
    background: rgba(249, 255, 247, 1);
    --body-wrapper-background: rgba(249, 255, 247, 1);
    height:100%;
    left:0;
    top:0;
    width:100%;
    min-height:100vh;
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
    min-height:100vh;
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
const StyledListItem = styled(List.Item)`
    text-align: right;
    .adm-list-item-content{
        border-top:0;
    }
`;

const StyledCardItem = styled.div`
    display: flex;
    align-items: center;
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

const StyledHandleButton = styled(Button)`
    width: 50px;
    height: 36px;
    svg {
        width: 20px;
        height: 20px;
        /* position: relative;
        top: 2px; */
    }
`;

const SocalRecoveryPage: FC<any> = () => {
    const navigate = useNavigate();
    const account = useSelectedAccount();
    const accountAddress = normalizeAddress(account?.address!);
    const storageKey = `${accountAddress},guardians`;
    // @ts-ignore
    const [localNameList, setLocalNameList] = useState<any[]>(JSON.parse(window.localStorage.getItem(storageKey)) || []);
    const [isLoading, setIsLoading] = useState(false);
    const [recoveryAddressForSearch, setRecoveryAddressForSearch] = useState('');
    const [addressForSearch, setAddressForSearch] = useState('');
    const [btnRecoveryLoading, setBtnRecoveryLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [msgList, setMsgList] = useState<any[]>([]);
    const [nameList, setNameList] = useState<any[]>(localNameList);
    const [userList, setUserList] = useState([]);
    const [recoveryRadioValue, setRecoveryRadioValue] = useState('');
    const [guardiansCheckValue, setGuardiansCheckValue] = useState([]);
    const [oldOwnerAddress, ...guardians] = nameList;
    const guardiansAddress = guardians.map(item => item.address);

    useEffect(() => {
        if (account) {
            // @ts-ignore
            getAllAccounts(account?.address, 1, 200).then((res: Array) => {
                // console.log('res -----', res);
                if (res && res?.length) {
                    const list = [];
                    for (let i = 0; i < res[0].length; i++) {
                        list.push({ address: res[0][i], accountId: res[1][i], nickname: res[2][i], isPending: false });
                    }
                    console.log('list -----', list);
                    // @ts-ignore
                    setUserList(list);
                }
            });
        }
    }, []);
    //
    const handleSendRecoveryMessageClick = async () => {
        if (account) {
            setIsLoading(true);
            getSigner({}).then(res => {
                if (res) {
                    return triggerEscapeOwner({ guardians: guardiansAddress, oldOwnerAddress: oldOwnerAddress.address, newOwner: (res as Array<string>)[0] }).then((result) => {
                        if (result) {
                            const data = {
                                oldOwnerAddress: oldOwnerAddress.address,
                                type: 98,
                                tx: result
                            };
                            for (const item of guardiansAddress) {
                                doLeaveMessage({
                                    account: accountAddress,
                                    from: accountAddress,
                                    to: item,
                                    title: 'Recovery',
                                    content: JSON.stringify(data)
                                }).catch((e) => {
                                    Toast.show({ content: JSON.stringify(e) });
                                });
                            }
                            window.localStorage.setItem(storageKey, JSON.stringify(nameList) || '');
                            setLocalNameList(nameList);
                        }
                        return result || 'Unknow Error';
                    });
                } else {
                    return 'Unknow Error';
                }
            }).then(res => {
                console.log(['tx', res]);
                Toast.show({ content: res as string });
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            //
        }
    };

    const handleRecoveryClick = async () => {
        try {
            setIsLoading(true);
            const tmpRecoveryMessage0 = msgList.filter(item => item.from === guardiansAddress[0])[0];
            const tmpRecoveryMessage1 = msgList.filter(item => item.from === guardiansAddress[1])[0];
            if (tmpRecoveryMessage0 && tmpRecoveryMessage1) {
                const res = await escapeOwner(oldOwnerAddress.address, [tmpRecoveryMessage0.content.res, tmpRecoveryMessage1.content.res]);
                Toast.show({ content: JSON.stringify(res) });
                msgList.forEach((item) => {
                    doReadMessage({ account: accountAddress, message_id: item.message_id });
                });
                window.localStorage.removeItem(storageKey);
                setLocalNameList([]);
                navigate(-1);
            }
        } catch (e) {
            Toast.show({ content: JSON.stringify(e) });
        } finally {
            setIsLoading(false);
        }
    };

    const searchRecoveryAddress = async () => {
        if (!recoveryAddressForSearch) {
            Toast.show('Enter To Recovery ID');
            return;
        }
        setBtnRecoveryLoading(true);
        const res = await getAddressByTokenId(recoveryAddressForSearch);
        if (/0x[\d\w]{61,62}/.test(res[0])) {
            const list = [{ address: normalizeAddress(res[0]), name: recoveryAddressForSearch }, ...(Array.from(nameList.slice(1)))];
            setNameList(list);

            setRecoveryAddressForSearch('');
        } else {
            Toast.show('Unknow Error');
        }
        setBtnRecoveryLoading(false);
    };

    const searchAddress = async () => {
        if (!addressForSearch) {
            Toast.show('Enter Guardians ID');
            return;
        }
        setBtnLoading(true);
        const res = await getAddressByTokenId(addressForSearch);
        if (/0x[\d\w]{61,62}/.test(res[0])) {
            const list = [nameList[0], ...(Array.from(nameList.slice(1))), { address: normalizeAddress(res[0]), name: addressForSearch }];
            setNameList(list);

            setAddressForSearch('');
        } else {
            Toast.show('Unknow Error');
        }
        setBtnLoading(false);
    };

    // const handleDelete = (index: number) => {
    //     const list = clone(nameList);
    //     index === 0 ? list[0] = null : list.splice(index, 1);
    //     setNameList(list);
    // };

    const handleRecoveryRadioChange = (val: any) => {
        setRecoveryRadioValue(val);
    };

    const handleGuardiansCheckChange = (val: any) => {
        setGuardiansCheckValue(val);
    };

    useInterval(() => {
        if (accountAddress && localNameList.length > 2) {
            getSessionToken({ account: accountAddress });
            getUserMessages({
                account: accountAddress,
                limit: 10,
                page_no: 1
            }).then(res => {
                const msgList = res.result.messages;
                const uniqAddress: string[] = [];
                const list = msgList.reduce((list: any[], item: any) => {
                    if (uniqAddress.includes(item.from)) {
                        //
                    } else if (guardiansAddress.includes(item.from)) {
                        uniqAddress.push(item.from);
                        list.push({ ...item, content: (JSON.parse(item.content)), timestamp: new Date(item.timestamp).getTime() });
                    }
                    return list;
                }, []).filter((item: any) => item.content.msgType === 99);
                setMsgList(list);
            });
        }
    }, 10e3);

    const isWaitMessage = localNameList.length > 2;

    console.log(msgList);

    return (
        <StyledBodyWrapper>
            <WindowWrapperCom loading={isLoading}>
                <WindowWrapperCom.Body>
                    <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                    <StyledLogo><LogoIcon /></StyledLogo>
                    <StyledH3>Social Recovery</StyledH3>
                    <StyledBody>
                        <StyledList mode='card'>
                            <Card title='To Recovery' style={{ maxHeight: 220, overflow: 'scroll' }}>
                                <AllUserList
                                    gridType="listRadio"
                                    list={userList}
                                    checkValue={recoveryRadioValue}
                                    handleCheckChange={handleRecoveryRadioChange}
                                />
                            </Card>
                        </StyledList>
                        <StyledList mode='card'>
                            <Card title='Guardians' style={{ maxHeight: 220, overflow: 'scroll' }}>
                                <AllUserList
                                    gridType="listCheck"
                                    list={userList}
                                    checkValue={guardiansCheckValue}
                                    handleCheckChange={handleGuardiansCheckChange}
                                />
                            </Card>
                        </StyledList>
                        <StyledAcceptGroup>
                            {
                                localNameList.length <= 0 ? (
                                    <StyledAcceptButton block type='submit' color='primary' size='large' loadingText='creating' onClick={handleSendRecoveryMessageClick} disabled={nameList.length < 3 || !nameList[0]}>Start recovery</StyledAcceptButton>
                                ) : (
                                    <StyledAcceptButton block type='submit' color='primary' size='large' loadingText='creating' onClick={handleRecoveryClick} disabled={msgList.length < 2} >Recovery</StyledAcceptButton>
                                )
                            }
                        </StyledAcceptGroup>
                    </StyledBody>
                    <Footer content='Need help? Contact Civia support' style={{ '--background-color': 'transparent', '--adm-color-light': '#000', margin: '0px auto 0' } as any} />
                </WindowWrapperCom.Body>
            </WindowWrapperCom>
        </StyledBodyWrapper>
    );
};

export default SocalRecoveryPage;
