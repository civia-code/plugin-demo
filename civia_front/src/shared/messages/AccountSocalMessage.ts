export type AccountSocalMessage =
  { type: 'CIVIA_GET_SBT'; data?: any }
  | { type: 'CIVIA_GET_SBT_RES'; data: any }
  | { type: 'CIVIA_GET_SBT_RJS'; data: any }

  | { type: 'CIVIA_CREATE_SBT'; data?: any }
  | { type: 'CIVIA_CREATE_SBT_RES'; data: any }
  | { type: 'CIVIA_CREATE_SBT_RJS'; data: any }

  | { type: 'CIVIA_SOCAL_FOLLOW'; data?: any }
  | { type: 'CIVIA_SOCAL_FOLLOW_RES'; data: any }
  | { type: 'CIVIA_SOCAL_FOLLOW_RJS'; data: any }

  | { type: 'CIVIA_SOCAL_UNFOLLOW'; data?: any }
  | { type: 'CIVIA_SOCAL_UNFOLLOW_RES'; data: any }
  | { type: 'CIVIA_SOCAL_UNFOLLOW_RJS'; data: any }

  | { type: 'CIVIA_GET_ALL_FOLLOWS'; data?: any }
  | { type: 'CIVIA_GET_ALL_FOLLOWS_RES'; data: any }
  | { type: 'CIVIA_GET_ALL_FOLLOWS_RJS'; data: any }

  | { type: 'CIVIA_GET_ALL_FOLLOWERS'; data?: any }
  | { type: 'CIVIA_GET_ALL_FOLLOWERS_RES'; data: any }
  | { type: 'CIVIA_GET_ALL_FOLLOWERS_RJS'; data: any }

  | { type: 'CIVIA_GET_ALL_SOCAL_LIST'; data?: any }
  | { type: 'CIVIA_GET_ALL_SOCAL_LIST_RES'; data: any }
  | { type: 'CIVIA_GET_ALL_SOCAL_LIST_RJS'; data: any }

  | { type: 'CIVIA_GET_ALL_ACCOUNTS'; data?: any }
  | { type: 'CIVIA_GET_ALL_ACCOUNTS_RES'; data: any }
  | { type: 'CIVIA_GET_ALL_ACCOUNTS_RJS'; data: any }
