import { Component, Injector, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindCityProvinceDialogComponent } from './find-city-province-dialog.component';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-city-province, [findCityProvince]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [DialogService],
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
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('CityProvince'));
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
