import { Component, Injector, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindZoneDialogComponent } from './find-zone-dialog.component';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-zone, [findZone]',
    templateUrl: '../template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindZoneComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FindZoneComponent),
            multi: true,
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindZoneComponent extends FindComponentBase implements OnInit {

    @Input() warehouses: any;

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    find() {
        this._dialogService.open(FindZoneDialogComponent, {
            data: {
                multiple: this.multiple,
                warehouses: this.warehouses
            },
            header: this.l('FindZones'),
            styleClass: this.responsiveDialogClass + ' find-zone-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
