import { number, shortString, Contract, Abi } from 'starknet';
import { sendMessage, waitForMessage } from '@argentx/packages/extension/src/shared/messages';
import { useSendCombinedTransaction as proxySendCombinedTransaction } from '@src/hooks/useTransaction';
import { Account } from '@argentx/packages/extension/src/ui/features/accounts/Account';
import { approveAction, rejectAction } from '@argentx/packages/extension/src/ui/services/backgroundActions';

const { encodeShortString, decodeShortString } = shortString;

export const getSigner = async ({ fromLocal = false, accountAddress }: any) => {
    return 1;
};

export const getGuardianSize = async (accountAddress: string | undefined = undefined) => {
    await sendMessage({
        type: 'CIVIA_GET_GUARDIANSIZE',
        data: {
            accountAddress
        }
    } as any);
    const res = await waitForMessage('CIVIA_GET_GUARDIANSIZE_RES' as any);
    return number.toBN(res).toNumber();
};

export const getEscapeOwner = async (accountAddress: string) => {
    await sendMessage({
        type: 'CIVIA_GET_ESCAPE_OWNER',
        data: {
            accountAddress
        }
    } as any);
    const res = await waitForMessage('CIVIA_GET_ESCAPE_OWNER_RES' as any);
    const [escapeTime, escapeId, guardian1, guardian2, guardian3, newOwner] = res as any;
    console.log(res);
    return [{
        escapeTime,
        escapeId: parseInt(escapeId, 16),
        guardian1: number.toHex(guardian1),
        guardian2: number.toHex(guardian2),
        guardian3: number.toHex(guardian3),
        newOwner: number.toHex(newOwner)
    }];
};

export const getAllEscapeOwner = async (accountAddressList: string[]) => {
    await sendMessage({
        type: 'CIVIA_GET_ALL_ESCAPE_OWNER',
        data: {
            accountAddressList
        }
    } as any);
    const res = await waitForMessage('CIVIA_GET_ALL_ESCAPE_OWNER_RES' as any) as string[][];
    const mapedRes = res.map(([escapeTime, escapeId, guardian1, guardian2, guardian3, newOwner]) => (
        {
            escapeTime,
            escapeId: parseInt(escapeId, 16),
            guardian1: number.toHex(guardian1),
            guardian2: number.toHex(guardian2),
            guardian3: number.toHex(guardian3),
            newOwner: number.toHex(newOwner)
        }
    )).filter(item => item.escapeId);
    return mapedRes;
};

export const getReplaceGuardian = async () => {
    await sendMessage({
        type: 'CIVIA_GET_REPLACE_GUARDIAN'
    } as any);
    const res = await waitForMessage('CIVIA_GET_REPLACE_GUARDIAN_RES' as any);
    console.log(res);
    return res;
};

export const initialize = async () => {
    await sendMessage({
        type: 'CIVIA_INITIALIZE'
    } as any);
    const res = await waitForMessage('CIVIA_INITIALIZE_RES' as any);
    console.log(res);
    return res;
};

export const changeGuardians = async (guardianLen: 3|5, guardians: Array<string>) => {
    const guardiansFelt = guardians.map(item => number.toFelt(item));
    await sendMessage({
        type: 'CIVIA_CHANGE_GUARDIANS',
        data: { guardianLen, guardians: guardiansFelt } as any
    } as any);
    const res = await waitForMessage('CIVIA_CHANGE_GUARDIANS_RES' as any);
    console.log(res);
    return res;
};

export const changeGuardiansTrans = async (guardianLen: number, guardians: Array<string>, account: Account) => {
    return null;
};

export const changeGuardiansTransAndApprove = async (guardianLen: number, guardians: Array<string>, account: Account) => {
    return null;
};

export const triggerEscapeOwner = async (data: { guardians: Array<string>; oldOwnerAddress: string, newOwner: string}) => {
    const { guardians, oldOwnerAddress, newOwner } = data;
    const [guardian1, guardian2, guardian3] = guardians;// .map(item => number.toFelt(item));
    await sendMessage({
        type: 'CIVIA_TRIGGER_ESCAPE_OWNER',
        data: {
            guardian1,
            guardian2,
            guardian3: 0,
            oldOwnerAddress,
            newOwner: number.toHex(newOwner)
        }
    } as any);
    const res = await waitForMessage('CIVIA_TRIGGER_ESCAPE_OWNER_RES' as any);
    console.log(res);
    return res;
};

export const triggerEscapeOwnerTrans = async (data: { guardians: Array<string>; oldOwnerAddress: string, newOwner: string}) => {
    const { guardians, oldOwnerAddress, newOwner } = data;
    const [guardian1, guardian2, guardian3] = guardians;
    // const params = [guardian1, guardian2, guardian3, newOwner];
    const res = await proxySendCombinedTransaction({
        transactions: [{
            contractAddress: oldOwnerAddress,
            entrypoint: 'triggerEscapeOwner',
            calldata: [guardian1, guardian2, guardian3, newOwner]
        }]
    });
    return res;
};

export const escapeOwner = async (oldOwnerAddress: string, escapeInfoArray: Array<{
    oldOwnerAddress: string;
    newOwnerPubKey: string;
    guardianAccount: string;
    guardianPublicKey: string;
    r: string;
    s: string;
}>) => {
    await sendMessage({
        type: 'CIVIA_ESCAPE_OWNER',
        data: {
            oldOwnerAddress,
            escapeInfoLen: escapeInfoArray.length * 6,
            escapeInfoArray
        }
    } as any);
    const res = await waitForMessage('CIVIA_ESCAPE_OWNER_RES' as any);
    console.log(res);
    return res;
};

export const escapeOwnerTransAndApprove = async (oldOwnerAddress: string, escapeInfoArray: Array<{
    oldOwnerAddress: string;
    newOwnerPubKey: string;
    guardianAccount: string;
    guardianPublicKey: string;
    r: string;
    s: string;
}>) => {
    const escapeInfoLen = escapeInfoArray.length * 6;
    const newEscapeInfoValueArray = escapeInfoArray.map((item: any) => Object.values(item));
    const params = ([escapeInfoLen, newEscapeInfoValueArray].flat(2));
    const action = await proxySendCombinedTransaction({
        transactions: [{
            contractAddress: oldOwnerAddress,
            entrypoint: 'escapeSigner',
            calldata: [...params]
        }]
    });
    await approveAction(action);
    const result = await Promise.race([
        waitForMessage(
            'TRANSACTION_SUBMITTED',
            ({ data }) => data.actionHash === action.meta.hash
        ),
        waitForMessage(
            'TRANSACTION_FAILED',
            ({ data }) => data.actionHash === action.meta.hash
        )
    ]);
    console.log(result);
    return result;
};

export const triggerReplaceGuardian = async () => {
    await sendMessage({
        type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN'
    } as any);
    const res = await waitForMessage('CIVIA_TRIGGER_REPLACE_GUARDIAN_RES' as any);
    console.log(res);
    return res;
};

export const replaceGuardianWithSign = async () => {
    await sendMessage({
        type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_WITH_SIGN'
    } as any);
    const res = await waitForMessage('CIVIA_TRIGGER_REPLACE_GUARDIAN_WITH_SIGN_RES' as any);
    console.log(res);
    return res;
};

export const replaceGuardianWithoutSign = async () => {
    await sendMessage({
        type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_WITHOUT_SIGN'
    } as any);
    const res = await waitForMessage('CIVIA_TRIGGER_REPLACE_GUARDIAN_WITHOUT_SIGN_RES' as any);
    console.log(res);
    return res;
};

export const getRecoverySignature = async (data: { oldOwnerAddress: string, newOwnerPubKey: string}) => {
    await sendMessage({
        type: 'CIVIA_GET_RECOVERY_SIGNATURE',
        data
    } as any);
    const res = await waitForMessage('CIVIA_GET_RECOVERY_SIGNATURE_RES' as any);
    console.log(res);
    return res;
};

export const addRecoveriedAddress = async (data: { oldOwnerAddress: string }) => {
    await sendMessage({
        type: 'CIVIA_ADD_RECOVERIED_ADDRESS',
        data
    } as any);
    const res = await waitForMessage('CIVIA_ADD_RECOVERIED_ADDRESS_RES' as any);
    console.log(res);
    return res;
};

export const getAccountImageUrlByAddress = ({ accountAddress }: { accountAddress: string }) => {
    const id = number.hexToDecimalString(accountAddress || '0').slice(-1);
    return `https://storage.fleek.zone/c33f0f64-9add-4351-ac8c-c869d382d4f8-bucket/civia/nft0${id}.jpg`;
};
