import { Component, Injector, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindVillageDialogComponent } from './find-village-dialog.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-village, [findVillage]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindVillageComponent),
            multi: true
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindVillageComponent extends FindComponentBase implements OnInit {

    @Input() countries: any;
    @Input() cityProvinces: any;
    @Input() khanDistricts: any;
    @Input() sangkatCommunes: any;

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('Village'));
    }

    find() {
        this._dialogService.open(FindVillageDialogComponent, {
            data: {
                multiple: this.multiple,
                countries: this.countries,
                cityProvinces: this.cityProvinces,
                khanDistricts: this.khanDistricts,
                sangkatCommunes: this.sangkatCommunes
            },
            header: this.l('FindVillages'),
            styleClass: this.responsiveDialogClass + ' find-village-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
