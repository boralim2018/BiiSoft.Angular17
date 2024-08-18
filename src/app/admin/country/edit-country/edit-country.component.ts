import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateCountryInputDto, CountryDetailDto, CountryServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindCurrencyComponent } from '../../../../shared/components/find-currency/find-currency.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    selector: 'app-edit-country',
    templateUrl: './edit-country.component.html',
    providers: [CountryServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindCurrencyComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditCountryComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateCountryInputDto = new CreateUpdateCountryInputDto();
    currency: any;

    constructor(
        injector: Injector,
        public _countryService: CountryServiceProxy,
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
        this._countryService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: CountryDetailDto) => {
                this.model = new CreateUpdateCountryInputDto();
                this.model.init(result);
                if(result.currencyId) this.currency = { id: result.currencyId, code: result.currencyCode };
            });
    }

    save(): void {
        this.saving = true;

        this._countryService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
