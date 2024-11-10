import { Component, Injector, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindCityProvinceDialogComponent } from './find-city-province-dialog.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-city-province, [findCityProvince]',
    templateUrl: '../template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindCityProvinceComponent),
            multi: true
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindCityProvinceComponent extends FindComponentBase implements OnInit {

    @Input() countries: any;

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
        this.placeholder = this.l('Select_', this.l('CityProvince'));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    find() {
        this._dialogService.open(FindCityProvinceDialogComponent, {
            data: {
                multiple: this.multiple,
                countries: this.countries
            },
            header: this.l('FindCityProvinces'),
            styleClass: this.responsiveDialogClass + ' find-city-province-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
