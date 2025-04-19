import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateCountryInputDto, CountryServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindCurrencyComponent } from '../../../../shared/components/find-currency/find-currency.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

@Component({
    selector: 'app-create-country',
    templateUrl: './create-country.component.html',
    providers: [CountryServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextComponent, FindCurrencyComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateCountryComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateCountryInputDto = new CreateUpdateCountryInputDto();
    currency: any;

    constructor(
        injector: Injector,
        public _countryService: CountryServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateCountryInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._countryService.create(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                if (form) {
                    this.initModel();
                    form.resetForm(this.model);
                }
                else {
                    this._dialogRef.close(result);
                }
            });
    }

    saveNew(form: NgForm) {
        this.save(form);
    }
}
