import { Component, forwardRef, Injector, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SelectComponentBase } from 'shared/select-component-base';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'select-sub-account-type, [selectSubAccountType]',
    templateUrl: '../template/select-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectSubAccountTypeComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, MultiSelectModule, CheckboxModule, FormsModule, NgIf, PrimeTemplate, InputTextModule]
})
export class SelectSubAccountTypeComponent extends SelectComponentBase implements OnInit, OnChanges {

    @Input() accountTypeExclude: boolean;
    @Output() accountTypeExcludeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() accountTypeIds: any;
    @Output() accountTypeIdsChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
        this.validateMessage = this.l("IsRequired", this.l('SubAccountType'));
    }

    ngOnInit() {
        this.getModels();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['accountTypeExclude'] && !changes['accountTypeExclude'].firstChange) {
            this.getModels();
        }

        if (changes['accountTypeIds'] && !changes['accountTypeIds'].firstChange) {
            this.getModels();
        }
    }

    getModels() {
        this.loading = true;

        let accountTypeIds = !this.accountTypeIds ? [] : Array.isArray(this.accountTypeIds) ? this.accountTypeIds : [this.accountTypeIds];

        this._service.getSubAccountTypes(this.accountTypeExclude, accountTypeIds)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items;
            });
    }
}
