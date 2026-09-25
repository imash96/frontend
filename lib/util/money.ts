import { isEmpty } from "./isEmpty";

export const convertToLocale = ({ amount, currency_code, minimumFractionDigits = 2, maximumFractionDigits = 2, locale = "en-US" }: ConvertToLocaleParams): string => {
    if (!currency_code || isEmpty(currency_code)) {
        return amount.toString();
    }

    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency_code,
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(amount);
    } catch (error) {
        console.error(`convertToLocale: invalid currency code "${currency_code}"`, error)
        return `${amount.toFixed(maximumFractionDigits ?? 2)} ${currency_code.toUpperCase()}`
    }
}

type ConvertToLocaleParams = {
    amount: number
    currency_code: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    locale?: string
}