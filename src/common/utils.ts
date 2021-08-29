export const pad = function (num: number) { return ('00' + num).slice(-2) }

export const frameDbDate = (dateNow: Date): string => {
    return dateNow.getUTCFullYear() + '-'
        + pad(dateNow.getUTCMonth() + 1) + '-'
        + pad(dateNow.getUTCDate())
}
