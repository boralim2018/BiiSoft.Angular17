import { Component, Injector, OnInit, Output } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-location',
    templateUrl: './confirm-delete.component.html',
    standalone: true,
    imports: [FormsModule, InputTextModule, ButtonDirective, LocalizePipe]
})
export class ConfirmDeleteComponent extends DynamicDialogBase implements OnInit {
    model: string | undefined;

    deleteObj: string;
    deleteLabel: string;

    constructor(
        injector: Injector,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
        if (this._dialogConfig.data.containerClass) this.containerClass = this._dialogConfig.data.containerClass;
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.deleteLabel = this._dialogConfig.data.deleteLabel ? this._dialogConfig.data.deleteLabel : '';
        this.deleteObj = this._dialogConfig.data.deleteObj ? this._dialogConfig.data.deleteObj : '';
    }

    close() {
        this._dialogRef.close(false);
    }

    save(): void {
        this._dialogRef.close(true);
    }

}
