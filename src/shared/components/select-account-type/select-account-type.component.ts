import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SelectComponentBase } from 'shared/select-component-base';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'select-tccount-type, [selectAccountType]',
    templateUrl: './select-tccount-type.component.html',
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

    sortField: string;
    usePagination: boolean = true;
    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
        this.placeholder = this.l('Select_', this.l('AccountType'));
    }

    ngOnInit() {
        super.ngOnInit();
    }
    
    onFilter(filter: string) {
        this.models = [];
        this.loading = true;

        this.skipCount = 0;
        
        let selected = !this.model ? [] : this.model instanceof Array ? this.model : [this.model]; 

        this._service.getAccountTypes(selected, filter, this.usePagination, this.skipCount, this.maxResultCount)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items
            });
    }

    onLazyLoad(event, selectedValue?: any) {

        if (this.filter) return;

        if (!this.models) this.models = [];

        let page = Math.ceil(this.models.length / this.maxResultCount);
        this.skipCount = page * this.maxResultCount;

        if (this.totalRecords > 0 && this.totalRecords <= this.skipCount) return; 

        this.loading = true;
        let selected = !selectedValue ? [] : selectedValue instanceof Array ? selectedValue : [selectedValue];

        this._service.getAccountTypes(selected, "", this.usePagination, this.skipCount, this.maxResultCount)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = [...new Set([...this.models, ...result.items])];
                this.totalRecords = result.totalCount;
            });
    }

}
