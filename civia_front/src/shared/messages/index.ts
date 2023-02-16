import { AccountMessage } from './AccountMessage';
import { AccountSocalMessage } from './AccountSocalMessage';
import { AccountIdMessage } from './AccountIdMessage';
import { AccountDomainMessage } from './AccountDomainMessage';
import { AccountCommonMessage } from './AccountCommonMessage';
import { AccountTransactionMessage } from './AccountTransactionMessage';
export type CiviaMessageType = AccountMessage | AccountSocalMessage | AccountIdMessage | AccountDomainMessage | AccountCommonMessage | AccountTransactionMessage;
