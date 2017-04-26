
import * as Rx from 'rxjs';


import { ajax } from './helper';



export default class APIMeter {

    constructor (
        private $node: JQuery,
        private remaining = 0,
        private limit = 0,
        private reset = new Date(),
    ) {
        this.$node.removeClass('hidden');

        const parse = (xhr: XMLHttpRequest) => {
            this.update(
                ~~Number(xhr.getResponseHeader('X-RateLimit-Remaining')),
                ~~Number(xhr.getResponseHeader('X-RateLimit-Limit')),
                ~~Number(xhr.getResponseHeader('X-RateLimit-Reset')) * 1000,
            );
        };

        Rx.Observable.ajax.get('https://api.github.com').subscribe(
            ({xhr}) => parse(xhr),
            ({xhr}) => parse(xhr),
        );
    }

    public get rate () {
        return ~~(this.remaining / this.limit * 100);
    }

    public update (remaining = 0, limit = 0, reset = 0) {
        this.remaining = remaining;
        this.limit = limit;
        this.reset = new Date(reset);

        this.$node.find('.counter').text(this.rate);
    }
}
