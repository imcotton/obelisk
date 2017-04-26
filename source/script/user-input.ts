
import * as Rx from 'rxjs';


import { ajax } from './helper';



export default class UserInput {

    constructor (private $node: JQuery) {

        this.$node.removeClass('hidden').find('.username').focus();

        Rx.Observable
            .fromEvent(this.$node.find('.username').get(0), 'keyup')
            .map((event: KeyboardEvent) => event.target as HTMLInputElement)
            .map(input => input.value.trim())
            .debounceTime(700)
            .distinctUntilChanged()
            .filter(text => text.length > 0)

            .do(name => {
                const errorClass = this.$node.find('.info-input').data('css-error');

                this.$node
                    .find('.avatar').attr('src', '').end()
                    .find('.info-input').removeClass(errorClass).end()
                    .find('.fullname').text('').end()
                ;
            })

            .map(name => `https://api.github.com/users/${ name }`)
            .switchMap(Rx.Observable.ajax)

            .materialize()

            .filter(notification => notification.hasValue)

            .map(notification => notification.value)

            // .dematerialize()

/*
            .switchMap(ajax.get)
            .do(net => {
                if (net instanceof Rx.AjaxError) {
                    const errorClass = this.$node.find('.info-input').data('css-error');

                    this.$node
                        .find('.avatar').attr('src', '').end()
                        .find('.info-input').toggleClass(errorClass).end()
                        .find('.error').text(net.xhr.statusText).end()
                        .find('.username').select().end()
                    ;
                }
            })

            .filter<Rx.AjaxResponse>(net => net instanceof Rx.AjaxResponse)

*/
            .do(({xhr}) => {
                this.$node.find('.counter').text(
                    ~~Number(xhr.getResponseHeader('X-RateLimit-Remaining'))
                );
            })

            .map(net => net.response)

            .subscribe(
                ({name, avatar_url, bio}) => {
                    this.$node
                        .find('.avatar').attr('src', avatar_url + '&s=80').end()
                        .find('.fullname').text(name).end()
                    ;
                },
                console.info,
            )
        ;

    }
}

