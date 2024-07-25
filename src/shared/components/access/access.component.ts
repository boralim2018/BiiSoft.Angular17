import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '../../app-component-base';

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
    standalone: true,
})
export class AccessComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }
}
