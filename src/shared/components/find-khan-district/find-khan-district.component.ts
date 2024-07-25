import { Component, Injector, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindKhanDistrictDialogComponent } from './find-khan-district-dialog.component';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-khan-district, [findKhanDistrict]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [DialogService],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindKhanDistrictComponent extends FindComponentBase implements OnInit {

    @Input() countries: any;
    @Input() cityProvinces: any;

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('KhanDistrict'));
    }

    find() {
        this._dialogService.open(FindKhanDistrictDialogComponent, {
            data: {
                multiple: this.multiple,
                countries: this.countries,
                cityProvinces: this.cityProvinces
            },
            header: this.l('FindKhanDistricts'),
            styleClass: this.responsiveDialogClass + ' find-khan-district-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
