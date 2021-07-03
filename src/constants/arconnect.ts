export enum PERMISSIONS_TYPES {
    ACCESS_ADDRESS = 'ACCESS_ADDRESS',
    SIGN_TRANSACTION = 'SING_TRANSACTION',
    ENCRYPT = 'ENCRYPT',
    DECRYPT = 'DECRYPT'
}

export const PERMISSIONS: Array<PERMISSIONS_TYPES> = [
    PERMISSIONS_TYPES.ACCESS_ADDRESS,
    PERMISSIONS_TYPES.SIGN_TRANSACTION,
    PERMISSIONS_TYPES.ENCRYPT,
    PERMISSIONS_TYPES.DECRYPT
];
