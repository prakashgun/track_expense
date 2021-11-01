import AccountInterface from "../interfaces/AccountInterface"

export const pad = function (num: number) { return ('00' + num).slice(-2) }

//Converting Javascript date to SQL datetime
//https://stackoverflow.com/a/21482470/6842203
export const frameDbDate = (date: Date): string => {
    return date.getUTCFullYear() + '-'
        + pad(date.getUTCMonth() + 1) + '-'
        + pad(date.getUTCDate())
}

export const frameDbDateTime = (date: Date): string => {
    return date.getUTCFullYear() + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + ' ' +
        pad(date.getUTCHours()) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds())
}

export const getCurrentBalance = (account: AccountInterface): number => {
    let total_income = account.total_income !== undefined ? account.total_income : 0
    let total_expense = account.total_expense !== undefined ? account.total_expense : 0
    
    return (account.initial_balance + total_income - total_expense)
}
