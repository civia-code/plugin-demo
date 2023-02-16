import { FC, useRef } from 'react';
import { ErrorBlock, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useActions } from '@argentx/packages/extension/src/ui/features/actions/actions.state';

import ConnectCom from './commponents/connect';
import ApproveTransactionCom from './commponents/approve_transaction';

const DappPage: FC<any> = () => {
    const navigate = useNavigate();
    const actions = useActions();
    const refActions = useRef(actions);

    const [action] = refActions.current;

    switch (action?.type) {
    case 'CONNECT_DAPP':
        return <ConnectCom host={action.payload.host} actions={refActions.current} />;
    case 'TRANSACTION':
        return <ApproveTransactionCom actions={refActions.current} />;
    default:
        return <ErrorBlock description={<Button onClick={() => { navigate('/account/tokens'); }} size='small'>Back</Button>} title='have no transaction' />;
    }
};

export default DappPage;
