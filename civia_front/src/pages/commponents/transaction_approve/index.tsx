import { FC, useState, useEffect, useCallback } from 'react';
import { Modal } from 'antd-mobile';

import AproveTransactionCom from '@src/pages/dapp/commponents/approve_transaction';

const TransactionApproveCom: FC<any> = ({ actions, onReject, onApprove, simple }) => {
    if (actions.length < 1) {
        return null;
    }
    return (
        <>
            <Modal
                visible
                style={{ '--max-width': '320px' } as any}
                content={
                    <div style={{ width: '280px' }}><AproveTransactionCom actions={actions} mode='modal' onReject={onReject} onApprove={onApprove} simple={simple} /></div>
                }

            />
        </>
    );
};

export default TransactionApproveCom;
