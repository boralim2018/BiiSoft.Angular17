import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SelectComponentBase } from 'shared/select-component-base';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'select-account-type, [selectAccountType]',
    templateUrl: '../template/select-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectAccountTypeComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, MultiSelectModule, CheckboxModule, FormsModule, NgIf, InputTextModule]
})
export class SelectAccountTypeComponent extends SelectComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
        this.validateMessage = this.l("IsRequired", this.l('AccountType'));
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
