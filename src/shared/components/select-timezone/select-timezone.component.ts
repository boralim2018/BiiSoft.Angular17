import { Component, Injector, OnInit } from '@angular/core';
import { HostSettingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SelectComponentBase } from 'shared/select-component-base';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-select-timezone',
    templateUrl: './select-timezone.component.html',
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, PrimeTemplate, InputTextModule]
})
export class SelectTimezoneComponent extends SelectComponentBase implements OnInit {

    sortField: string;
    
    constructor(injector: Injector,
        private _settingService: HostSettingsServiceProxy
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
        this._settingService.getTimeZones(filter, this.usePagination, this.skipCount, this.maxResultCount)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe(result => {
                this.mapResult(result.items);
                if (callBack) callBack();
            },
            err => { callBack(); this.message.error(err.message) });
    }
}
