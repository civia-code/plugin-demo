import { FC } from 'react';
import styled from 'styled-components';

import { useDisplayTokenAmountAndCurrencyValue } from '@argentx/packages/extension/src/ui/features/accountTokens/useDisplayTokenAmountAndCurrencyValue';
import {
    TokenApproveTransaction,
    TokenMintTransaction,
    TokenTransferTransaction
} from '@argentx/packages/extension/src/ui/features/accountActivity/transform/type';

export interface TransferAccessoryProps {
    transaction:
    | TokenTransferTransaction
    | TokenMintTransaction
    | TokenApproveTransaction
}

const StyledFlex = styled.div`
    display: flex;
`;

export const TransferAccessory: FC<TransferAccessoryProps> = ({
    transaction
}) => {
    const { action, amount, tokenAddress } = transaction;
    const { displayAmount, displayValue } = useDisplayTokenAmountAndCurrencyValue(
        { amount, tokenAddress }
    );
    if (!displayAmount) {
        return null;
    }
    const prefix = action === 'SEND' ? <>&minus;</> : action === 'RECEIVE' ? <>+</> : null;
    return (
        <StyledFlex>
            <div>
                {prefix}
                {displayAmount}
            </div>
            {displayValue && (
                <div>
                    {prefix}
                    {displayValue}
                </div>
            )}
        </StyledFlex>
    );
};
