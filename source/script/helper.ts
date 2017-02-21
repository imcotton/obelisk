
import * as Rx from 'rxjs';



export function bootWith (dependencies: () => [any]) {

    const { setTimeout } = window;

    const config = {
        frequency: 0x42,
        iteration: 0xFF,
    };

    const start = Date.now();

    return new Promise<number>(function (resolve, reject) {

        const loop = function () {

            const lapsed = Date.now() - start;

            if (dependencies().every(Boolean) === true) {
                return resolve(lapsed);
            }

            if (config.iteration-- < 1) {
                return reject(lapsed);
            }

            setTimeout(loop, config.frequency);
        };

        loop();
    });
}



type Response = Rx.AjaxError | Rx.AjaxResponse;

export const ajax = new class {

    constructor (
    ) {
    }

    private get ajax () {
        return Rx.Observable.ajax;
    }

    get = (url: string) => {

        const auth = (function (cookie) {
            const access_token = (
                cookie.match(/(github_access_token=)([a-z0-9]{30,})/) || ['']
            ).pop();

            if (access_token) {
                return {
                    Authorization: `token ${ access_token }`,
                };
            }

            return {};
        }(window.document.cookie));

        return this.ajax
            .get(url, {...auth})
        ;
    }

}



export function querys (search = '') {
    return search
        .split('&')
        .map(pair => pair.split('='))
        .map(([key, value]) => ({[key]: value}))
        .reduce((hash, item) => ({...hash, ...item}), {});
}



export function identity <T> (value: T) {
    return value;
}



export function compare <T> (foo: T, bar: T) {

    if (foo === bar) return 0;

    return foo > bar ? 1 : -1;
}



export function setState <T extends Object, K extends keyof T>
    (target: T, source: Pick<T, K>) {

    for (let key in target) {
        if (target.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }

    return target;
}



export function pick <T, K extends keyof T>
    (source: T, ...keys: K[]) {

    const result = {} as Pick<T, K>;

    for (let key of keys) {
        result[key] = source[key];
    }

    return result;
}

