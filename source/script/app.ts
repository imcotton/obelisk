
import $ from 'jquery';
import * as Rx from 'rxjs';


import { bootWith } from './helper';


import DataPresent from './data-present';



function main () {

    new DataPresent($('#data-present'));

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
