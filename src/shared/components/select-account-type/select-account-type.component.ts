import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SelectComponentBase } from 'shared/select-component-base';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'select-account-type, [selectAccountType]',
    templateUrl: './select-account-type.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectAccountTypeComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, PrimeTemplate, InputTextModule]
})
export class SelectAccountTypeComponent extends SelectComponentBase implements OnInit {

    @Input() label: string = this.l('AccountType');

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
        this.placeholder = this.l('Select_', this.label);
    }

    ngOnInit() {
        this.getModels();
    }

    getModels() {
        this.loading = true;
        this._service.getAccountTypes()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items;
            });
    }
}
