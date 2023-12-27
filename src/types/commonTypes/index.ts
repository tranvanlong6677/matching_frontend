export interface LocalStorageType {
    key: string,
    value: any | null,
    time: number
}

export interface CheckAgeType {
    year : number,
    month: number,
    day: number
}

export interface SuccessActionPropsType {
    title? : string,
    textDescription? : any,
    deleteCast?: boolean,
    castRegister?: boolean,
    castEdit?: boolean
    noImage?:boolean
    mail?:boolean,
    deleteAccount?:boolean
}