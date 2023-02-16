export type AccountTransactionMessage =
  { type: 'CIVIA_SILENCE_TRANSACTION'; data?: any }
  | { type: 'CIVIA_SILENCE_TRANSACTION_RES'; data: any }
  | { type: 'CIVIA_SILENCE_TRANSACTION_RJS'; data: any }
