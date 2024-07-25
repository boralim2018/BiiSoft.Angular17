import { Component, Injector, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindSangkatCommuneDialogComponent } from './find-sangkat-commune-dialog.component';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-sangkat-commune, [findSangkatCommune]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [DialogService],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindSangkatCommuneComponent extends FindComponentBase implements OnInit {

    @Input() countries: any;
    @Input() cityProvinces: any;
    @Input() khanDistricts: any;

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('SangkatCommune'));
    }

    find() {
        this._dialogService.open(FindSangkatCommuneDialogComponent, {
            data: {
                multiple: this.multiple,
                countries: this.countries,
                cityProvinces: this.cityProvinces,
                khanDistricts: this.khanDistricts
            },
            header: this.l('FindSangkatCommunes'),
            styleClass: this.responsiveDialogClass + ' find-sangkat-commune-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
