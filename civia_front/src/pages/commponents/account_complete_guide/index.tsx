import { FC, useEffect, useState } from 'react';
import { Modal, Card, Button, Grid } from 'antd-mobile';
import styled from 'styled-components';

import TransactionApproveCom from '@src/pages/commponents/transaction_approve';
import { registerAccountInfoTrans } from '@src/ui/account/accountCommon.service';
import { useActions } from '@argentx/packages/extension/src/ui/features/actions/actions.state';
import { useGetAccountInfo, IAccountInfoData } from '@src/hooks/useAccount';

const StyledButton = styled(Button)`
    border-radius: 20px;
    padding: 10px 12px;
`;

const StyledTip = styled.div`
    padding-bottom: 10px;
`;

const StyledModal = styled(Modal)`
    .adm-center-popup-wrap {
        max-width: 400px!important;
    }
`;

export const AccountCompleteGuideCom: FC<any> = ({ account }) => {
    const [step, setStep] = useState(0);
    const { accountInfoData = {}, accountInfoValidating, mutate } = useGetAccountInfo(account, account.address);
    const actions = useActions();

    const userActions = actions.filter(item => {
        const { transactions: [{ calldata, entrypoint }] } = item.payload as any;
        if (entrypoint === 'create_sbt' || entrypoint === 'register') {
            return (calldata as string[]).includes(account.address);
        }
        return false;
    });

    const handleCancel = () => {
        setStep(-1);
    };
    const handleContinue = async () => {
        setStep(1);
        const res = await registerAccountInfoTrans(account.address);
        console.log(res);
    };

    if (accountInfoValidating) {
        return null;
    }

    return (
        <>
            {
                step === 0 ? (
                    <>
                        <StyledModal
                            visible
                            content={
                                <div>
                                    <StyledTip>You have not created id and other information. If you want to use all functions, please click the Continue button below to complete the overall process.</StyledTip>
                                    <div>
                                        <Grid columns={2} gap={32}>
                                            <Grid.Item>
                                                <StyledButton onClick={handleCancel} block style={{ width: '100px', margin: 'auto' }}>Cancel</StyledButton>
                                            </Grid.Item>
                                            <Grid.Item>
                                                <StyledButton color='primary' onClick={handleContinue} block style={{ width: '100px', margin: 'auto' }}>Continue</StyledButton>
                                            </Grid.Item>
                                        </Grid>
                                    </div>
                                </div>
                            }
                        />
                    </>
                ) : null
            }
            {
                userActions.length > 0 ? (<TransactionApproveCom actions={userActions} />) : null
            }
        </>
    );
};
