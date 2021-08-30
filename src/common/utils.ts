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
