import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateItemGradeInputDto, ItemGradeDetailDto, ItemGradeServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

@Component({
    selector: 'app-edit-item-grade',
    templateUrl: './edit-item-grade.component.html',
    providers: [ItemGradeServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditItemGradeComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateItemGradeInputDto = new CreateUpdateItemGradeInputDto();
    

    constructor(
        injector: Injector,
        public _itemGradeService: ItemGradeServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getDetail();
    }

    getDetail() {
        this.saving = true;
        this._itemGradeService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: ItemGradeDetailDto) => {
                this.model = new CreateUpdateItemGradeInputDto(result);
            });
    }

    save(): void {
        this.saving = true;

        this._itemGradeService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
