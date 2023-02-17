import { FC, useEffect, useState, Fragment } from 'react';
import { Rate, Button, Toast, Dropdown, Radio, Space, Card } from 'antd-mobile';
import { getGuardianSize, changeGuardiansTrans, getAccountImageUrlByAddress } from '@src/ui/account/account.service';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { WindowWrapperCom, NavBarCom, AllUserList } from '@src/pages/commponents';
import TransactionApproveCom from '@src/pages/commponents/transaction_approve';
import { useActions } from '@argentx/packages/extension/src/ui/features/actions/actions.state';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { isEqualAddress, formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { useLocalCache, useGetIdsByAddressList, useGetAccountInfo, IAccountInfoData } from '@src/hooks/useAccount';
import { getAllSocalList } from '@src/ui/account/accountSocal.service';
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';
import { getAccountIdentifier } from '@argentx/packages/extension/src/shared/wallet.service';
import { useAccountTransactions } from '@argentx/packages/extension/src/ui/features/accounts/accountTransactions.state';

const StyledGrayBtn = styled.div`
    svg{
        path{
            fill: #4A4A4A!important;
        }
    }
`;

const StyledBody = styled.div`
     margin:0 32px;
     position: relative;
     .adm-card-body {
        padding: 0;
    }
     .adm-list-body{
        --border-bottom: 0px;
     }
     .adm-dropdown-item-title-text {
        font-size: 16px;
        font-weight: bold;
     }
`;

const StyleH1Title = styled.h1`
  text-align: center;
  margin-top: 20px;
`;

const StyledUsername = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;

const StyledH2 = styled.h2`
  margin-left: 10px;
`;

const StyledBodyWrapper = styled.div`
  background: #fff;
  border-radius: 5px;
  /* padding-top: 20px; */
  /* padding-bottom: 20px; */
`;

const StyledLevel = styled.div`
  width: 11%;
  font-size: 30px;
  position: absolute;
  top: 68px;
  left: 70%;
`;

const StyleSubmitButton = styled(Button)`
  width: 90%;
  margin-left: 50%;
  transform: translateX(-50%);
  margin-top: 40px;
  margin-bottom: 20px;
  border-radius: 20px;
`;

const StyledScrollCard = styled(Card)`
    .adm-card-body{
        max-height: 200px;
        overflow: scroll;
        scroll-behavior:smooth;
        ::-webkit-scrollbar {
            display: none;
        }
    }
`;

const SecruityLevelPage: FC<any> = () => {
    const navigate = useNavigate();
    const account: any = useSelectedAccount();
    const accountIdentifier = account && getAccountIdentifier(account);
    const { accountInfoData = {} } = useGetAccountInfo(account, account.address);
    const { nickName = null } = accountInfoData as IAccountInfoData;
    const [isLoading, setIsLoading] = useState(false);
    const LevelEnum = [
        { level: 1, name: 'Secruity level 1' },
        { level: 2, name: 'Secruity level 2' }
    ];
    const [level, setLevel] = useState(1);
    const [levelName, setLevelName] = useState('Secruity level 1');
    const { mapAddress2Id } = useGetIdsByAddressList();
    const storageKey = `${account?.address},guardians`;
    const [localNameList, setLocalNameList] = useState<any[]>(swrCacheProvider.get(storageKey) || []);
    const [guardiansSize, setGuardiansSize] = useState(localNameList.length);
    const { transactions } = useAccountTransactions(account);

    const hasAddGuardians = (transactions.some((trans: any) => {
        return ['ACCEPTED_ON_L1', 'ACCEPTED_ON_L2'].includes(trans.status) && trans.meta?.title === 'Add guardians' && trans.meta?.transactions[0].calldata.length > 1;
    }));

    const { data: socalList = { followingData: [], followersData: [] }, isValidating } = useLocalCache(() => {
        return getAllSocalList().then((res) => {
            if (res) {
                return res;
            } else {
                const localRes = swrCacheProvider.get(`@"${accountIdentifier}","socalList"`);
                return localRes ? JSON.parse(localRes) : { followingData: [], followersData: [] };
            }
        });
    }, { key: `@"${accountIdentifier}","socalList"`, revalidateOnFocus: false, revalidateOnReconnect: false, refreshInterval: 60e3, dedupingInterval: 10e3 });
    const { followingData } = socalList;
    const [checkValue, setCheckValue] = useState<string[]>([]);
    const actions = useActions();
    const changeGuardiansActions = actions.filter(item => {
        const { transactions: [{ calldata, entrypoint, contractAddress }] } = item.payload as any;
        if (entrypoint === 'addGuardians') {
            return isEqualAddress(contractAddress, account!.address);
        }
        return false;
    });

    useEffect(() => {
        setLevel(guardiansSize > 0 ? 2 : 1);
        setLevelName(guardiansSize > 0 ? 'Secruity level 2' : 'Secruity level 1');
    }, [guardiansSize]);

    useEffect(() => {
        // 获取守护者数量
        hasAddGuardians && setGuardiansSize(3);
        getGuardianSize().then((res) => {
            setGuardiansSize((size) => Math.max(res, size));
        });
    }, [hasAddGuardians]);

    const currentGuardians = followingData.reduce((list: any[], item: any) => {
        for (const obj of localNameList) {
            if (obj && isEqualAddress(item.address, obj.addressResult)) {
                list.push(item);
            }
        }
        return list;
    }, []);

    const isValid = (() => {
        console.log('isValid: guardiansSize ---', guardiansSize);
        if (level === 1) {
            switch (guardiansSize) {
            case -1:
                return true;
            case 0:
                if (checkValue.length !== 1) {
                    return false;
                } else {
                    return true;
                }
            case 1:
                return false;
            case 2:
                return false;
            case 3:
                return false;
            default:
                return true;
            }
        }
        if (level === 2) {
            switch (guardiansSize) {
            case -1:
                return true;
            case 0:
                if (checkValue.length !== 3) {
                    return false;
                } else {
                    return true;
                }
            case 1:
                if (checkValue.length !== 2) {
                    return false;
                } else {
                    return true;
                }
            case 2:
                if (checkValue.length !== 1) {
                    return false;
                } else {
                    return true;
                }
            case 3:
                return false;
            default:
                return true;
            }
        }
    })();

    // 提交守护者
    const handleSubmit = () => {
        console.log('checkValue', checkValue);
        if (isValid) {
            setIsLoading(true);
            changeGuardiansTrans(checkValue.length, checkValue, account as any).then(res => {
                console.log('changeGuardiansTrans -----', res);
            }).catch((e) => {
                Toast.show({ content: String(e) });
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    const onApprove = (res: any) => {
        const guards = [];
        for (const item of checkValue) {
            guards.push({
                address: formatAddressId(formatTruncatedAddress(item), mapAddress2Id(item)).substring(1),
                addressResult: item
            });
        }
        for (const item of currentGuardians) {
            guards.push({
                address: '',
                addressResult: item.address
            });
        }
        swrCacheProvider.set(storageKey, guards);
        navigate(-1);
    };

    const formatAddressId = (address: string, id: string | null) => {
        return id ? `#${id}` : '#';
    };

    const handleCheckChange = (val: string[]) => {
        if (!val || !val.length) {
            console.log('no guard');
            setCheckValue([]);
            return;
        }
        const [currentGuardian] = currentGuardians.filter((item: any) => val.includes(item.address));
        if (currentGuardian) {
            Toast.show(`${currentGuardian.nickname} is guardian already!`);
            return;
        }
        if (level === 1 && guardiansSize === 0 && val.length > 1) {
            Toast.show({ content: 'Select at most one guardian when level one!' });
            return;
        }
        if (level === 1 && guardiansSize > 0) {
            Toast.show({ content: 'Select at most one guardian when level one!' });
            return;
        }
        if (level === 2 && guardiansSize === 0 && val.length > 3) {
            Toast.show({ content: 'Select at most three guardians when level two!' });
            return;
        }
        if (level === 2 && guardiansSize === 1 && val.length > 2) {
            Toast.show({ content: 'Select at most three guardians when level two!' });
            return;
        }
        if (level === 2 && guardiansSize === 2 && val.length > 1) {
            Toast.show({ content: 'Select at most three guardians when level two!' });
            return;
        }
        if (level === 2 && guardiansSize === 3 && val.length > 0) {
            Toast.show({ content: 'Select at most three guardians when level two!' });
            return;
        }
        setCheckValue(val);
        return true;
    };

    const handleRadioChange = (e: any) => {
        console.log('e', e);
        const result: any = LevelEnum.find((item) => item.level === e);
        if (result) {
            console.log('result', result);
            setCheckValue([]);
            setLevel(result.level);
            setLevelName(result.name);
        }
    };

    return (
        <WindowWrapperCom loading={isLoading}>
            <WindowWrapperCom.Body>
                <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                <StyledBody >
                    <StyleH1Title>Guardians</StyleH1Title>
                    <StyledUsername>
                        <img style={{ width: 20, height: 20, borderRadius: '50%' }} src={getAccountImageUrlByAddress({ accountAddress: account?.address })} />
                        <StyledH2>{nickName}</StyledH2>
                    </StyledUsername>
                    <StyledBodyWrapper>
                        <Dropdown>
                            <Dropdown.Item
                                key='1'
                                title={levelName}
                            >
                                <div style={{ padding: 20 }}>
                                    <Radio.Group defaultValue={level} onChange={handleRadioChange}>
                                        <Space direction='vertical' block>
                                            {
                                                LevelEnum.map((item: any) => {
                                                    return <Radio key={item.level} style={{
                                                        '--icon-size': '22px',
                                                        '--font-size': '16px',
                                                        '--gap': '8px'
                                                    }} block value={item.level} disabled={guardiansSize > 1 && item.level === 1}>
                                                        {item.name}
                                                    </Radio>;
                                                })
                                            }
                                        </Space>
                                    </Radio.Group>
                                </div>
                            </Dropdown.Item>
                        </Dropdown>
                        <StyledLevel>
                            <Rate
                                allowHalf
                                value={level / 2}
                                count={1}
                                readOnly={true}
                                style={{ '--star-size': '20px', marginLeft: 5 }}
                            />
                        </StyledLevel>
                        <StyledScrollCard title='Followings'>
                            <AllUserList
                                gridType="listCheck"
                                list={followingData}
                                isValidating={isValidating}
                                checkValue={checkValue}
                                handleCheckChange={handleCheckChange}
                            />
                        </StyledScrollCard>
                        <Card title='Current Guardians'>
                            <AllUserList
                                gridType="listNoNav"
                                currentList={currentGuardians}
                                list={followingData.filter((item: any) => checkValue.includes(item?.address))}
                            />
                        </Card>
                    </StyledBodyWrapper>
                    <div style={{ paddingBottom: '16px' }}>
                        <StyleSubmitButton block color='primary' size='large' onClick={handleSubmit} disabled={!isValid}>Add Guardians</StyleSubmitButton>
                    </div>
                </StyledBody>
                {
                    changeGuardiansActions.length > 0 ? (<TransactionApproveCom actions={changeGuardiansActions} onApprove={onApprove} simple={true} />) : null
                }
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default SecruityLevelPage;
