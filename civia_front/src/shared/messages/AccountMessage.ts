export type AccountMessage =

  | { type: 'CIVIA_GET_GUARDIANSIZE'; data?: any }
  | { type: 'CIVIA_GET_GUARDIANSIZE_RES'; data: any }
  | { type: 'CIVIA_GET_GUARDIANSIZE_RJS'; data: any }

  | { type: 'CIVIA_GET_ESCAPE_OWNER'; data?: any }
  | { type: 'CIVIA_GET_ESCAPE_OWNER_RES'; data: any }
  | { type: 'CIVIA_GET_ESCAPE_OWNER_RJS'; data: any }

  | { type: 'CIVIA_GET_ALL_ESCAPE_OWNER'; data?: any }
  | { type: 'CIVIA_GET_ALL_ESCAPE_OWNER_RES'; data: any }
  | { type: 'CIVIA_GET_ALL_ESCAPE_OWNER_RJS'; data: any }

  | { type: 'CIVIA_GET_REPLACE_GUARDIAN'; data?: any }
  | { type: 'CIVIA_GET_REPLACE_GUARDIAN_RES'; data: any }
  | { type: 'CIVIA_GET_REPLACE_GUARDIAN_RJS'; data: any }

  | { type: 'CIVIA_INITIALIZE'; data?: any }
  | { type: 'CIVIA_INITIALIZE_RES'; data: any }
  | { type: 'CIVIA_INITIALIZE_RJS'; data: any }

  | { type: 'CIVIA_CHANGE_GUARDIANS'; data?: any }
  | { type: 'CIVIA_CHANGE_GUARDIANS_RES'; data: any }
  | { type: 'CIVIA_CHANGE_GUARDIANS_RJS'; data: any }

  | { type: 'CIVIA_TRIGGER_ESCAPE_OWNER'; data?: any }
  | { type: 'CIVIA_TRIGGER_ESCAPE_OWNER_RES'; data: any }
  | { type: 'CIVIA_TRIGGER_ESCAPE_OWNER_RJS'; data: any }

  | { type: 'CIVIA_ESCAPE_OWNER'; data?: any }
  | { type: 'CIVIA_ESCAPE_OWNER_RES'; data: any }
  | { type: 'CIVIA_ESCAPE_OWNER_RJS'; data: any }

  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN'; data?: any }
  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_RES'; data: any }
  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_RJS'; data: any }

  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_WITH_SIGN'; data?: any }
  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_WITH_SIGN_RES'; data: any }
  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_WITH_SIGN_RJS'; data: any }

  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_WITHOUT_SIGN'; data?: any }
  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_WITHOUT_SIGN_RES'; data: any }
  | { type: 'CIVIA_TRIGGER_REPLACE_GUARDIAN_WITHOUT_SIGN_RJS'; data: any }

  | { type: 'CIVIA_GET_RECOVERY_SIGNATURE'; data?: any }
  | { type: 'CIVIA_GET_RECOVERY_SIGNATURE_RES'; data: any }
  | { type: 'CIVIA_GET_RECOVERY_SIGNATURE_RJS'; data: any }

  | { type: 'CIVIA_ESCAPE_SIGNER'; data?: any }
  | { type: 'CIVIA_ESCAPE_SIGNER_RES'; data: any }
  | { type: 'CIVIA_ESCAPE_SIGNER_RJS'; data: any }

  | { type: 'CIVIA_GET_ESCAPE_SIGNER'; data?: any }
  | { type: 'CIVIA_GET_ESCAPE_SIGNER_RES'; data: any }
  | { type: 'CIVIA_GET_ESCAPE_SIGNER_RJS'; data: any }

  | { type: 'CIVIA_ADD_RECOVERIED_ADDRESS'; data?: any }
  | { type: 'CIVIA_ADD_RECOVERIED_ADDRESS_RES'; data: any }
  | { type: 'CIVIA_ADD_RECOVERIED_ADDRESS_RJS'; data: any }
