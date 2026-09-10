import { isArray } from "./isEmpty";
// TODO delete
type ClassValue = ClassValue[] | Record<string, any> | string | number | bigint | null | boolean | undefined;

function toVal(mix: ClassValue) {
    let k, y, str = '';

    if (typeof mix === 'string' || typeof mix === 'number') {
        str += mix;
    } else if (typeof mix === 'object') {
        if (isArray(mix)) {
            const len = mix.length;
            for (k = 0; k < len; k++) {
                if (mix[k]) {
                    if (y = toVal(mix[k])) {
                        if (str) str += ' ';
                        str += y;
                    }
                }
            }
        } else {
            for (y in mix) {
                if (mix && mix[y]) {
                    if (str) str += ' ';
                    str += y;
                }
            }
        }
    }

    return str;
}

export default function clx(...inputs: ClassValue[]) {
    let tmp, x, str = ''
    for (let i = 0; i < inputs.length; i++) {
        if (tmp = inputs[i]) {
            if (x = toVal(tmp)) {
                if (str) str += ' ';
                str += x
            }
        }
    }
    return str;
}