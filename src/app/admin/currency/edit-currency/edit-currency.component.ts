import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateCurrencyInputDto, CurrencyDetailDto, CurrencyServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-currency',
    templateUrl: './edit-currency.component.html',
    providers: [CurrencyServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditCurrencyComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateCurrencyInputDto = new CreateUpdateCurrencyInputDto();

    constructor(
        injector: Injector,
        public _currencyService: CurrencyServiceProxy,
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
        this._currencyService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: CurrencyDetailDto) => {
                this.model = new CreateUpdateCurrencyInputDto();
                this.model.init(result);
            });
    }

    save(): void {
        this.saving = true;

        this._currencyService.update(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
