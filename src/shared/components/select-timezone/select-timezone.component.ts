import { Component, Injector, OnInit } from '@angular/core';
import { CommonLookupServiceProxy, StringListResultDto } from '@shared/service-proxies/service-proxies';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SelectComponentBase } from 'shared/select-component-base';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { isArray } from 'lodash-es';

@Component({
    selector: 'app-select-timezone',
    templateUrl: './select-timezone.component.html',
    providers: [CommonLookupServiceProxy],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, PrimeTemplate, InputTextModule]
})
export class SelectTimezoneComponent extends SelectComponentBase implements OnInit {

    sortField: string;
    
    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('Timezone'));
    }

    onFilter(filter: string, callBack?: Function) {
        this.models = [];
        this.loading = true;

        let selected = !this.selectedModel ? []: this.multiple ? this.selectedModel : [this.selectedModel]; 

        this._service.getTimeZones(selected, filter, this.usePagination, this.skipCount, this.maxResultCount)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    callBack();
                }),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(new StringListResultDto({ items: [] }));
                })
            )
            .subscribe((result: any | null) => {
                this.mapResult(result.items);
            });
    }
}
