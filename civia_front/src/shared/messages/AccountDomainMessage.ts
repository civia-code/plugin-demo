export type AccountDomainMessage =
  { type: 'CIVIA_GET_DOMAIN_BUY_PRICE'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_BUY_PRICE_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_BUY_PRICE_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_RENEW_PRICE'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_RENEW_PRICE_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_RENEW_PRICE_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_ADDRESS'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_ADDRESS_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_ADDRESS_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_EXPIRY'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_EXPIRY_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_EXPIRY_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_OWNER'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_OWNER_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_OWNER_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_ADDRESS_OF'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_ADDRESS_OF_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_ADDRESS_OF_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_LIST'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_LIST_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_LIST_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_BUY'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_BUY_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_BUY_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_RENEW'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_RENEW_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_RENEW_RJS'; data: any }

  | { type: 'CIVIA_GET_DOMAIN_TRANSFER'; data?: any }
  | { type: 'CIVIA_GET_DOMAIN_TRANSFER_RES'; data: any }
  | { type: 'CIVIA_GET_DOMAIN_TRANSFER_RJS'; data: any }
