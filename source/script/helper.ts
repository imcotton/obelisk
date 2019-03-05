
export function identity <T> (value: T) {
    return value;
}



export function compare <T> (foo: T, bar: T) {

    if (foo === bar) return 0;

    return foo > bar ? 1 : -1;
}



export function pick <T, K extends keyof T>
    (source: T, ...keys: K[]) {

    const result = {} as Pick<T, K>;

    for (let key of keys) {
        result[key] = source[key];
    }

    return result;
}

