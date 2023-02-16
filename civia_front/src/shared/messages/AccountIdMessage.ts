export type AccountIdMessage =
  { type: 'CIVIA_GET_ACCOUNT_ID'; data?: any }
  | { type: 'CIVIA_GET_ACCOUNT_ID_RES'; data: any }
  | { type: 'CIVIA_GET_ACCOUNT_ID_RJS'; data: any }

  | { type: 'CIVIA_REGIST_ACCOUNT_ID'; data?: any }
  | { type: 'CIVIA_REGIST_ACCOUNT_ID_RES'; data: any }
  | { type: 'CIVIA_REGIST_ACCOUNT_ID_RJS'; data: any }

  | { type: 'CIVIA_GET_TOKEN_ID'; data?: any }
  | { type: 'CIVIA_REGIST_TOKEN_ID_RES'; data: any }
  | { type: 'CIVIA_REGIST_TOKEN_ID_RJS'; data: any }

  | { type: 'CIVIA_GET_NICKNAME'; data?: any }
  | { type: 'CIVIA_GET_NICKNAME_RES'; data: any }
  | { type: 'CIVIA_GET_NICKNAME_RJS'; data: any }
