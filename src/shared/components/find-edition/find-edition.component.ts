import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindEditionDialogComponent } from './find-edition-dialog.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-edition, [findEdition]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindEditionComponent),
            multi: true
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindEditionComponent extends FindComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
        this.placeholder = this.l('Select_', this.l('Edition'));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    find() {
        this._dialogService.open(FindEditionDialogComponent, {
            data: {
                multiple: this.multiple
            },
            header: this.l('FindEditions'),
            styleClass: this.responsiveDialogClass + ' find-edition-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
