
import $ from 'jquery';
import * as Rx from 'rxjs';


import { bootWith } from './helper';

import UserInput from './user-input';
import APIMeter from './api-meter';


function main () {

    new APIMeter($('#api-meter'));

    const { hash } = window.location;

    if (hash.length > 1) {
        console.info(hash);
    } else {
        new UserInput($('#user-input'));
    }


    /*
    return;

    const { Observable } = Rx;

    const user = 'imcotton';

    const urls = {
        repos: `https://api.github.com/users/${ user }/repos`,
    };



    Observable
        .ajax(urls.repos)

        .do(({xhr, response, request}) => {
            $('#header .num').text(
                ~~xhr.getResponseHeader('X-RateLimit-Remaining')
            );
        })

        .flatMap(ajax => ajax.response as [{fork: Boolean}])
        .filter(item => item.fork === true)
        .pluck('url')
        .take(8)
        .flatMap(Observable.ajax)
        .pluck('response', 'parent', 'url')
        .map(url => url + `/commits?author=${ user }`)
        .flatMap(Observable.ajax)
        .pluck('response')
        .filter((item: Array<any>) => item.length > 0)

        .subscribe(console.info)
    ;

    */
}










bootWith(() => [window.Rx, window.jQuery])
    .then(lapsed => {
        $(main);
    })
    .catch(lapsed => {
        console.error(`[failed after ${ lapsed }ms]`);
    })
;

void([$, Rx]);
