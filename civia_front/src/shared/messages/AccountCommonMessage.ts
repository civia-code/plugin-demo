export type AccountCommonMessage =
  { type: 'CIVIA_MULTICALL'; data?: any }
  | { type: 'CIVIA_MULTICALL_RES'; data: any }
  | { type: 'CIVIA_MULTICALL_RJS'; data: any }

  | { type: 'CIVIA_GET_ACCOUNT_INFO'; data?: any }
  | { type: 'CIVIA_GET_ACCOUNT_INFO_RES'; data: any }
  | { type: 'CIVIA_GET_ACCOUNT_INFO_RJS'; data: any }

  | { type: 'CIVIA_REGISTER_ACCOUNT_INFO'; data?: any }
  | { type: 'CIVIA_REGISTER_ACCOUNT_INFO_RES'; data: any }
  | { type: 'CIVIA_REGISTER_ACCOUNT_INFO_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAININFO_AND_PRICE'; data: any }
  | { type: 'CIVIA_GET_DOMAININFO_AND_PRICE_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAININFO_AND_PRICE_RES'; data: any }

  | { type: 'CIVIA_SEARCH_ACCOUNT'; data?: any }
  | { type: 'CIVIA_SEARCH_ACCOUNT_RES'; data: any }
  | { type: 'CIVIA_SEARCH_ACCOUNT_RJS'; data: any }

  | { type: 'CIVIA_GET_TOKEN_ID'; data?: any }
  | { type: 'CIVIA_GET_TOKEN_ID_RES'; data: any }
  | { type: 'CIVIA_GET_TOKEN_ID_RJS'; data: any }

  | { type: 'CIVIA_GET_IDS_BY_ADDRESSLIST'; data?: any }
  | { type: 'CIVIA_GET_IDS_BY_ADDRESSLIST_RES'; data: any }
  | { type: 'CIVIA_GET_IDS_BY_ADDRESSLIST_RJS'; data: any }

  | { type: 'CIVIA_GET_NICKNAME'; data?: any }
  | { type: 'CIVIA_GET_NICKNAME_RES'; data: any }
  | { type: 'CIVIA_GET_NICKNAME_RJS'; data: any }
