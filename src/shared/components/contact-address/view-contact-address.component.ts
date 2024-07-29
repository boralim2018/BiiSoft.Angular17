import { Component, Injector, OnInit, Input } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { DividerModule } from 'primeng/divider';
import { NgIf } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
    selector: '[viewContactAddress], view-contact-address',
    templateUrl: './view-contact-address.component.html',
    standalone: true,
    imports: [NgIf, FormsModule, DividerModule, CheckboxModule]
})
export class ViewContactAddressComponent extends AppComponentBase implements OnInit {

    @Input() title: string = this.l('ContactAddress');
    @Input() model: any;
    @Input() isShippingAddress: boolean;
    @Input() sameAsBillingAddress: boolean;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        if (this.isShippingAddress) this.title = this.l('ShippingAddress');
    }
}
