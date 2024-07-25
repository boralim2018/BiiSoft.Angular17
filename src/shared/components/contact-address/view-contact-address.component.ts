import { Component, Injector, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { DividerModule } from 'primeng/divider';
import { NgIf } from '@angular/common';

@Component({
    selector: '[viewContactAddress], view-contact-address',
    templateUrl: './view-contact-address.component.html',
    standalone: true,
    imports: [NgIf, DividerModule]
})
export class ViewContactAddressComponent extends AppComponentBase implements OnInit {

    @Input() title: string = this.l('ContactAddress');
    @Input() model: any;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        
    }
}
