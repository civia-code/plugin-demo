import { FC, useState, useCallback } from 'react';
import { List, Avatar, Toast } from 'antd-mobile';
import { useInterval } from 'ahooks';
import styled from 'styled-components';

import { useLocalCache } from '@src/hooks/useAccount';

import { LoadingCom } from '@src/pages/commponents';
import { getUserMessages, doLeaveMessage, doReadMessage } from '@src/ui/account/accountSocal.service';
import { getEscapeOwner, getAllEscapeOwner, getRecoverySignature, getAccountImageUrlByAddress, escapeOwner, escapeOwnerTransAndApprove } from '@src/ui/account/account.service';
import { formatTruncatedAddress, normalizeAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const mon = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const data = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
    const hour = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();
    const min = date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes();
    const seon = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds();

    const newDate = mon + '-' + data + ' ' + hour + ':' + min + ':' + seon;
    return newDate;
};

const StyledList = styled(List)`
    --align-items: top;
    --size:48px;
    --border-top: 0;
    --padding-left:0;
    --padding-right:0;
    --font-size: var(--adm-font-size-6);
    --border-bottom: 0;
    --adm-color-background: transparent;
    background: #efefef;
    border-radius: 15px;
    padding:0 5px;
    .adm-list-item-content-prefix{
        padding: 10px 10px 0 0;
        .adm-avatar{
            border-radius:30px;
        }
    }
    .adm-list-item-content-main{
        padding: 10px 0;
    }
`;

const StyledListItem = styled(List.Item)`

`;

const StyledMessage = styled.div`
    .gray, .link{
        display: inline-block;
        padding: 0 4px;
    }
    .gray{
        color:var(--adm-color-weak);
    }
    .link{
        color: var(--color-primary);
        &:hover{
            color:var(--color-hover);
        }
        &:active{
            color:var(--color-active);
        }
    }
`;

const useGetAllEscapeOwner = (options: Object) => {
    const [messageList, setMessageList] = useState<Map<string, Object>>();
    const { data: escapeOwnerList, isValidating, mutate } = useLocalCache(async () => {
        if (messageList && messageList.size) {
            const keys: string[] = Array.from(messageList.keys());
            const res = await getAllEscapeOwner(keys);
            return res.map((item, index) => (
                {
                    ...messageList.get(keys[index]),
                    ...item
                }
            ));
        } else {
            return [];
        }
    }, { ...options });

    const refreshEscapeOwnerList = useCallback((messageList: Map<string, Object>) => {
        //
        setMessageList(messageList);
        mutate();
    }, [mutate]);

    return {
        escapeOwnerList: escapeOwnerList || [],
        refreshEscapeOwnerList,
        mutate
    };
};

const SocalRecoveryMessageListCom: FC<any> = () => {
    const account = useSelectedAccount();
    const accountAddress = normalizeAddress(account?.address!);
    const [isLoading, setIsLoading] = useState(false);
    const [msgList, setMsgList] = useState([]);

    const clearInterval = useInterval(async () => {
        if (account && accountAddress) {
            getUserMessages({ account: accountAddress, limit: 20, page_no: 1 }).then(async (result) => {
                const msgList = result.result.messages;
                const list = msgList.reduce((list: Map<string, Object>, item: any) => {
                    if (item.content.includes('oldOwnerAddress')) {
                        const { oldOwnerAddress, newOwnerPubKey } = JSON.parse(JSON.stringify(JSON.parse(item.content)));
                        if (!list.has(oldOwnerAddress)) {
                            list.set(oldOwnerAddress, { ...item, oldOwnerAddress, newOwnerPubKey });
                        }
                    }
                    return list;
                }, new Map<string, Object>());
                setMsgList(Array.from(list.values()));
            });
        }
    }, 5e3);

    const handleSign = async (oldOwnerAddress: string, newOwner: string, newOwnerPubKey: string, from: string, messageId: string, tx: string) => {
        if (account) {
            try {
                setIsLoading(true);
                const escapeParams = await getRecoverySignature({ oldOwnerAddress, newOwnerPubKey }).then(res => {
                    const { signature, guardianAddress, guradianPublicKey } = res as any;
                    const data = {
                        res: {
                            oldOwnerAddress,
                            newOwnerPubKey,
                            guardianAccount: guardianAddress,
                            guardianPublicKey: guradianPublicKey,
                            r: signature[0],
                            s: signature[1]
                        },
                        tx,
                        msgType: 99
                    };
                    return data;
                });
                //
                const escapeRes = await escapeOwnerTransAndApprove(oldOwnerAddress, [{
                    oldOwnerAddress,
                    newOwnerPubKey,
                    guardianAccount: escapeParams.res.guardianAccount,
                    guardianPublicKey: escapeParams.res.guardianPublicKey,
                    r: escapeParams.res.r,
                    s: escapeParams.res.s
                }]);
                //
                await doLeaveMessage({
                    account: accountAddress,
                    from: accountAddress,
                    to: normalizeAddress(from),
                    title: 'reply message',
                    content: JSON.stringify({ ...escapeParams, tx: (escapeRes as any).txHash })
                });
                await doReadMessage({ account: accountAddress, message_id: messageId });
                Toast.show({
                    content: 'Success'
                });
            } catch (e) {
                Toast.show({
                    content: JSON.stringify(e)
                });
            } finally {
                setIsLoading(false);
            }
        } else {
        //
        }
    };

    if (msgList.length < 1) {
        return null;
    }

    return (
        <>
            <StyledList>
                {
                    msgList.map((item: any, index: number) => (
                        <StyledListItem
                            key={index}
                            prefix={<Avatar src={getAccountImageUrlByAddress({ accountAddress: item.from })} />}
                        >
                            <StyledMessage>
                                <div style={{ fontWeight: 'bold' }}>Account recover request<span className='gray'>{formatDate(new Date(item.timestamp))}</span></div>
                                <div style={{ width: 285, wordBreak: 'break-all' }}>Wallet address to recover: {formatTruncatedAddress(item.oldOwnerAddress)}<a className='link' onClick={() => { handleSign(item.oldOwnerAddress, item.from, item.newOwnerPubKey, item.from, item.message_id, item.tx); }}>Sign</a></div>
                            </StyledMessage>
                        </StyledListItem>
                    ))
                }
            </StyledList>
            <LoadingCom visible={isLoading} />
        </>
    );
};

export default SocalRecoveryMessageListCom;
