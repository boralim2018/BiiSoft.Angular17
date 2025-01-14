import { Component, forwardRef, Injector, OnInit } from '@angular/core';
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
    selector: 'select-item-category, [selectItemCategory]',
    templateUrl: '../template/select-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectItemCategoryComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, MultiSelectModule, CheckboxModule, FormsModule, NgIf, PrimeTemplate, InputTextModule]
})
export class SelectItemCategoryComponent extends SelectComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
        this.validateMessage = this.l("IsRequired", this.l('ItemCategory'));
    }

    ngOnInit() {
        this.getModels();
    }

    getModels() {
        this.loading = true;

        this._service.getItemCategories()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items;
            });
    }
}
