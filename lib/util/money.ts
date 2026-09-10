import { isEmpty } from "./isEmpty";

export const convertToLocale = ({ amount, currency_code, minimumFractionDigits, maximumFractionDigits, locale = "en-US" }: ConvertToLocaleParams): string => {
    if (!currency_code || isEmpty(currency_code)) {
        return amount.toString();
    }

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(amount);
}

type ConvertToLocaleParams = {
    amount: number
    currency_code: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    locale?: string
}