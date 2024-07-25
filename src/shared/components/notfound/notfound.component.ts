import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '../../app-component-base';

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
    standalone: true,
})
export class NotfoundComponent extends AppComponentBase implements OnInit {

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }
}
