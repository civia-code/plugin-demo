import { FC, useMemo, useState, useCallback, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, Form, Input, Popover, DotLoading, Image } from 'antd-mobile';
import { CloseCircleOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
import { utils } from 'ethers';
//
import { TokenIcon, AddressPanelCom } from '@src/pages/commponents';
import useProxySendTransaction from '@src/hooks/useTransaction';
//
import { useSelectedAccount } from '@argentx/packages/extension/src/ui/features/accounts/accounts.state';
import { TokenDetailsWithBalance } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.state';
import { formatTokenBalance, toTokenView } from '@argentx/packages/extension/src/ui/features/accountTokens/tokens.service';
import { parseAmount } from '@argentx/packages/extension/src/shared/token/amount';
import { getFeeToken } from '@argentx/packages/extension/src/shared/token/utils';
import { useMaxFeeEstimateForTransfer } from '@argentx/packages/extension/src/ui/features/accountTokens/useMaxFeeForTransfer';
import { getAccountName, useAccountMetadata } from '@argentx/packages/extension/src/ui/features/accounts/accountMetadata.state';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { AddressBookContact } from '@argentx/packages/extension/src/shared/addressBook';
import { getUint256CalldataFromBN } from '@argentx/packages/extension/src/ui/services/transactions';
import { getNetworkAccountImageUrl } from '@argentx/packages/extension/src/ui/features/accounts/accounts.service';
import { prettifyTokenBalance } from '@argentx/packages/extension/src/shared/token/price';

const StyledListItem = styled(List.Item)`
    position: relative;
    padding-bottom:10px;
    .error{
        color:red;
        position: absolute;
        bottom:3px;
        left:16px;
        line-height:15px;
        visibility: hidden;
        &.on{
            visibility: visible;
            font-size:12px;
        }
    }
`;

const StyledItemWrapper = styled.div`
    width:100%;
    position:relative;
    display:flex;
    align-items: center;
    >div{
        vertical-align: middle;
       

        &:nth-of-type(1){
            width:100%;
        }
        &:nth-of-type(2){
            
        }
    }
`;

const StyledBalance = styled.div`
    text-align: center;
`;

const StyledMax = styled.div`
    display: flex;

    Button{
        border-radius: 25px;
        min-width:25px;
        height:100%;
        color:#fff;
        padding:0 5px;
        margin:0 5px;
    }
`;

const StyledForm = styled(Form)`
    
`;

const TokenSendCom:FC<any> = ({ tokenAddress, currentToken }) => {
    const navigate = useNavigate();
    const { sendTransaction: proxySendTransaction } = useProxySendTransaction();
    const [amount, setAmount] = useReducer((state: string, { type, inputVal } : any) => {
        return inputVal.match(/^\d+\.?\d{0,18}/g)?.join('') || '';
    }, '');
    const [address, setAddress] = useState<string|undefined>();
    const account = useSelectedAccount() as any;
    const feeToken = account && getFeeToken(account.networkId);
    const [addressBookRecipient, setAddressBookRecipient] = useState<Account | AddressBookContact | undefined>();

    const { accountNames } = useAccountMetadata();

    const accountName = useMemo(
        () =>
            addressBookRecipient
                ? 'name' in addressBookRecipient
                    ? addressBookRecipient.name
                    : getAccountName(addressBookRecipient, accountNames)
                : undefined,
        [accountNames, addressBookRecipient]
    );

    const { address: currentTokenAddress, name, symbol, balance, decimals, image } = toTokenView(currentToken);

    const {
        maxFee,
        error: maxFeeError,
        loading: maxFeeLoading
    } = useMaxFeeEstimateForTransfer(currentToken?.address, currentToken?.balance, account);
    //

    console.log(maxFee);
    const parsedInputAmount = amount
        ? parseAmount(amount, decimals)
        : parseAmount('0', decimals);

    const parsedTokenBalance = currentToken.balance || parseAmount('0', decimals);

    const isInputAmountGtBalance =
    parsedInputAmount.gt(currentToken.balance?.toString() ?? 0) ||
    (feeToken?.address === currentToken.address &&
      (amount === balance ||
        parsedInputAmount.add(maxFee?.toString() ?? 0).gt(parsedTokenBalance)));

    const disableSubmit = !amount || isInputAmountGtBalance || !(address || addressBookRecipient);

    const setMaxInputAmount = useCallback(
        (token: TokenDetailsWithBalance, maxFee?: string) => {
            const tokenDecimals = token.decimals ?? 18;
            const tokenBalance = formatTokenBalance(token.balance, tokenDecimals);

            if (token.balance && maxFee) {
                const balanceBn = token.balance;

                const maxAmount =
              account?.networkId ===
              'localhost' /** FIXME: workaround for localhost fee estimate with devnet 0.3.4 */
                  ? balanceBn.sub(maxFee).sub(100000000000000)
                  : balanceBn.sub(maxFee);

                const formattedMaxAmount = utils.formatUnits(maxAmount, tokenDecimals);
                const maxInputAmount = maxAmount.lte(0) ? tokenBalance : formattedMaxAmount;
                console.log(maxInputAmount);
                setAmount({ inputVal: maxInputAmount });
            }
        },
        [account?.networkId]
    );

    const handleSubmit = async () => {
        await proxySendTransaction({
            to: currentTokenAddress,
            method: 'transfer',
            calldata: {
                recipient: (address || addressBookRecipient?.address)!,
                amount: getUint256CalldataFromBN(parseAmount(amount!, decimals))
            }
        });
        navigate('/dapp');
    };

    const handleMaxClick = (token: any) => {
        if (maxFee && token) {
            setMaxInputAmount(token, maxFee);
        }
    };

    return (
        <>
            <StyledBalance>{prettifyTokenBalance(currentToken)}</StyledBalance>
            <StyledForm
                layout='horizontal'
                onFinish={handleSubmit}
                style={{ '--border-bottom': '0px', '--border-top': '0px' }}
                footer={
                    <Button block type='submit' color='primary' disabled={disableSubmit} style={{ borderRadius: '20px', padding: '10px 12px' }}>Next</Button>
                }
            >
                <StyledListItem prefix={<div style={{ lineHeight: '100%' }}><TokenIcon name={name} url={image} size={24} /></div>}>
                    <StyledItemWrapper>
                        <div>
                            <Input value={amount} onChange={(val) => { setAmount({ inputVal: val }); }} placeholder='Amount' />
                        </div>
                        {
                            amount ? null : (
                                <div>
                                    <StyledMax>
                                        <div>{currentToken.symbol}</div>
                                        <div><Button onClick={() => { handleMaxClick(currentToken); }} color='primary'>{
                                            maxFeeLoading ? (<DotLoading style={{ fontSize: 16 }} color='white' />) : (<>Max</>)
                                        }</Button></div>
                                    </StyledMax>
                                </div>
                            )
                        }
                    </StyledItemWrapper>
                    <div className={`error ${(amount && isInputAmountGtBalance) ? 'on' : ''}`}>Insufficient balance</div>
                </StyledListItem>
                {
                    addressBookRecipient && accountName ? (
                        <StyledListItem prefix={
                            <Image
                                src={getNetworkAccountImageUrl({
                                    accountName,
                                    accountAddress: account.address,
                                    networkId: account.networkId,
                                    backgroundColor: account.hidden ? '333332' : undefined
                                })}
                                style={{ borderRadius: 12 }}
                                fit='cover'
                                width={24}
                                height={24}
                            />
                        }>
                            <StyledItemWrapper>
                                <div>
                                    <div>{accountName}</div>
                                    <div style={{ fontSize: 12 }}>{formatTruncatedAddress(addressBookRecipient.address)}</div>
                                </div>
                                <div onClick={() => { setAddressBookRecipient(undefined); }}>
                                    <CloseCircleOutline />
                                </div>
                            </StyledItemWrapper>
                        </StyledListItem>
                    ) : (
                        <StyledListItem>
                            <StyledItemWrapper>
                                <div>
                                    <Input value={address} onChange={(val) => { setAddress(val); }} placeholder={'Recipient\'s address'} />
                                </div>
                                {/* <div>
                                    <StyledMax>
                                        <div>
                                            <Popover
                                                trigger='click'
                                                content={<AddressPanelCom onChange={(account: Account) => {
                                                    setAddress(undefined);
                                                    setAddressBookRecipient(account);
                                                }}
                                                />}
                                            >
                                                <Button color='primary'>@</Button>
                                            </Popover>
                                        </div>
                                    </StyledMax>
                                </div> */}
                            </StyledItemWrapper>
                        </StyledListItem>
                    )
                }
            </StyledForm>
        </>
    );
};

export default TokenSendCom;
