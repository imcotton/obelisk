
import $ from 'jquery';
import * as Rx from 'rxjs';



declare global {
    interface Window {
        $: JQueryStatic,
        jQuery: JQueryStatic,
        Rx: typeof Rx,
    }
}
