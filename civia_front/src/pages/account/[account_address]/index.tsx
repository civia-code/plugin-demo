import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { WindowWrapperCom, AccountHeadPanelCom, AccountSbtCom, AccountPanelCom, TabsCom, AccountFollowCom, MessageListCom, NavBarCom } from '@src/pages/commponents';
import { getDynamicTest } from '@src/ui/account/accountSocal.service';
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';

const StyledBody = styled.div`
    min-height:320px;
    padding: 10px 14px;
`;

const AccountViewPage: FC<any> = () => {
    const [dynamicMessageList, setDynamicMessageList] = useState([]);
    const navigate = useNavigate();
    const account = useSelectedAccount() as any;

    const initDynamicsList = async () => {
        console.log('123');
        const res = await getDynamicTest(account?.address);
        console.log('getDynamicTest:res', res);
        setDynamicMessageList(res.result);
        // const res = await getUserDynamics({
        //     account: account?.address,
        //     followed_count: followedCount,
        //     max_block: maxBlock,
        //     limit
        // });
    };

    useEffect(() => {
        initDynamicsList()
        if (!account) {
            navigate('/account/list');
        }
    }, [account, navigate]);

    if (account) {
        return <AccountViewBody account={account} />;
    } else {
        return null;
    }
};

const AccountViewBody: FC<any> = ({ account }) => {
    const navigate = useNavigate();
    const [URLSearchParams] = useSearchParams();
    const { account_address: accountAddress } = useParams();
    const [dynamicMessageList, setDynamicMessageList] = useState([]);
    const id = URLSearchParams.get('id');
    const nickName = URLSearchParams.get('nick_name');

    const initDynamicsList = async () => {
        console.log('123');
        const res = await getDynamicTest(account?.address);
        console.log('getDynamicTest:res', res);
        setDynamicMessageList(res.result);
    };

    useEffect(() => {
        initDynamicsList();
    }, []);

    return (
        <WindowWrapperCom loading={false}>
            <WindowWrapperCom.Head>
                <AccountHeadPanelCom>
                    <NavBarCom left={<div onClick={() => { navigate(-1); }}>{NavBarCom.Back}</div>} />
                    <AccountPanelCom.AccountHead address={accountAddress} inputRest={{ value: `#${id}`, readOnly: true, isShow: true }} nickName={nickName} />
                    <AccountFollowCom accountAddress={accountAddress} account={account} />
                    <AccountSbtCom address={accountAddress} />
                    <TabsCom>
                        <TabsCom.Tab title='' key='1' />
                    </TabsCom>
                </AccountHeadPanelCom>
            </WindowWrapperCom.Head>
            <WindowWrapperCom.Body>
                <StyledBody>
                    <MessageListCom dynamicMessageList={dynamicMessageList} />
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default AccountViewPage;
