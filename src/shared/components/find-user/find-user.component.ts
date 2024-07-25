import { Component, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindUserDialogComponent } from './find-user-dialog.component';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-user, [findUser]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [DialogService],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindUserComponent extends FindComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
        this.optionLabel = 'userName';
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('User'));
    }

    find() {
        this._dialogService.open(FindUserDialogComponent, {
            data: {
                multiple: this.multiple
            },
            header: this.l('FindUsers'),
            styleClass: this.responsiveDialogClass + ' find-user-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
