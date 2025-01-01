import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateFieldAInputDto, FieldADetailDto, FieldAServiceProxy } from '@shared/service-proxies/service-proxies';
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
    selector: 'app-edit-field-a',
    templateUrl: './edit-field-a.component.html',
    providers: [FieldAServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindChartOfAccountComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditFieldAComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateFieldAInputDto = new CreateUpdateFieldAInputDto();
    useCode: boolean = this.appSession.itemFieldSetting.useCode;

    constructor(
        injector: Injector,
        public _fieldAService: FieldAServiceProxy,
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
        this._fieldAService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: FieldADetailDto) => {
                this.model = new CreateUpdateFieldAInputDto(result);
            });
    }

    save(): void {
        this.saving = true;

        this._fieldAService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
