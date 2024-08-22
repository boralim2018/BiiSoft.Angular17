import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, first } from 'rxjs/operators';
import { SelectComponentBase } from 'shared/select-component-base';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate, ScrollerOptions } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'select-timezone, [selectTimezone]',
    templateUrl: './select-timezone.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectTimezoneComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, PrimeTemplate, InputTextModule]
})
export class SelectTimezoneComponent extends SelectComponentBase implements OnInit {

    sortField: string;
    //usePagination: boolean = false;
    
    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('Timezone'));
    }
    
    onFilter(filter: string) {
        this.models = [];
        this.loading = true;

        this.skipCount = 0;
        
        let selected = !this.value ? [] : this.value instanceof Array ? this.value : [this.value]; 

        this._service.getTimeZones(selected, filter, this.usePagination, this.skipCount, this.maxResultCount)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items
            });
    }

    onLazyLoad(event, selectedValue?: any) {

        if (!this.models) this.models = [];

        let page = Math.ceil(this.models.length / this.maxResultCount);
        this.skipCount = page * this.maxResultCount;

        if (this.totalRecords > 0 && this.totalRecords <= this.skipCount) return; 

        this.loading = true;
        let selected = !selectedValue ? [] : selectedValue instanceof Array ? selectedValue : [selectedValue];

        this._service.getTimeZones(selected, "", this.usePagination, this.skipCount, this.maxResultCount)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = [...new Set([...this.models, ...result.items])];
                this.totalRecords = result.totalCount;
            });
    }

}
