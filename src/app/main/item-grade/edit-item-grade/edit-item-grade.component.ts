import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateItemGradeInputDto, ItemGradeDetailDto, ItemGradeServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { FindChartOfAccountComponent } from '../../../../shared/components/find-chart-of-account/find-chart-of-account.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-edit-item-grade',
    templateUrl: './edit-item-grade.component.html',
    providers: [ItemGradeServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindChartOfAccountComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditItemGradeComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateItemGradeInputDto = new CreateUpdateItemGradeInputDto();
    useCode: boolean = this.appSession.itemFieldSetting.useCode;

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
