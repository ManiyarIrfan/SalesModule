import { Component, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'tweet',
    template: `<a href="https://twitter.com/share" [attr.data-text]="text" [attr.data-url]="url" class="twitter-share-button"></a>`,
    styles: ['.twitter-share-button { transform: translate(0px, 7px) !important; }']

    // styles: `[test{transform: translate(0px, 7px);}]`
})

export class TweetComponent implements AfterViewInit {
    @Input() url = location.href;
    @Input() text = '';

    constructor() {
        // load twitter sdk if required
        const url = 'https://platform.twitter.com/widgets.js';
        if (!document.querySelector(`script[src='${url}']`)) {
            let script = document.createElement('script');
            script.src = url;
            document.body.appendChild(script);
        }
    }

    ngAfterViewInit(): void {
        // render tweet button
        window['twttr'] && window['twttr'].widgets.load();
    }
}