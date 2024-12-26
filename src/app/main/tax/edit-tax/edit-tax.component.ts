import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateTaxInputDto, TaxDetailDto, TaxServiceProxy } from '@shared/service-proxies/service-proxies';
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

@Component({
    selector: 'app-edit-tax',
    templateUrl: './edit-tax.component.html',
    providers: [TaxServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindChartOfAccountComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditTaxComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateTaxInputDto = new CreateUpdateTaxInputDto();
    purchaseAccount: any;
    saleAccount: any;

    constructor(
        injector: Injector,
        public _taxService: TaxServiceProxy,
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
        this._taxService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: TaxDetailDto) => {
                this.model = new CreateUpdateTaxInputDto();
                this.model.init(result);
                if (result.purchaseAccountId) this.purchaseAccount = { id: result.purchaseAccountId, name: result.purchaseAccountName };
                if (result.saleAccountId) this.saleAccount = { id: result.saleAccountId, name: result.saleAccountName };
            });
    }

    save(): void {
        this.saving = true;

        this._taxService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
