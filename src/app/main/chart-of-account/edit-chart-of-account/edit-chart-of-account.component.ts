import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateChartOfAccountInputDto, ChartOfAccountDetailDto, ChartOfAccountServiceProxy } from '@shared/service-proxies/service-proxies';
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
import { SelectAccountTypeComponent } from '../../../../shared/components/select-account-type/select-account-type.component';
import { SelectSubAccountTypeComponent } from '../../../../shared/components/select-account-type/select-sub-account-type.component';
import { NgIf } from '@angular/common';
import { FindChartOfAccountComponent } from '../../../../shared/components/find-chart-of-account/find-chart-of-account.component';

@Component({
    selector: 'app-edit-chart-of-account',
    templateUrl: './edit-chart-of-account.component.html',
    providers: [ChartOfAccountServiceProxy],
    standalone: true,
    imports: [
        SelectAccountTypeComponent,
        SelectSubAccountTypeComponent,
        FindChartOfAccountComponent,
        FormsModule, NgIf,
        BusyDirective, LocalizePipe,
        InputTextModule, AbpValidationSummaryComponent,
        ButtonDirective, Ripple]
})
export class EditChartOfAccountComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateChartOfAccountInputDto = new CreateUpdateChartOfAccountInputDto();

    customCodeEnble: boolean;
    parentAccount: any;
    constructor(
        injector: Injector,
        public _chartOfAccountService: ChartOfAccountServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
        this.customCodeEnble = this.appSession.advanceSetting?.customAccountCodeEnable;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getDetail();
    }

    getDetail() {
        this.saving = true;
        this._chartOfAccountService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: ChartOfAccountDetailDto) => {
                this.model = new CreateUpdateChartOfAccountInputDto(result);
                this.parentAccount = result.parentId ? { id: result.parentId, name: result.parentAccountName } : undefined;
            });
    }

    save(): void {
        this.saving = true;

        this._chartOfAccountService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
