import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateCityProvinceInputDto, CityProvinceServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindCountryComponent } from '../../../../shared/components/find-country/find-country.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { of } from 'rxjs';

@Component({
    selector: 'app-create-city-province',
    templateUrl: './create-city-province.component.html',
    providers: [CityProvinceServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindCountryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateCityProvinceComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateCityProvinceInputDto = new CreateUpdateCityProvinceInputDto();
    
    constructor(
        injector: Injector,
        public _cityProvinceService: CityProvinceServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateCityProvinceInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._cityProvinceService.create(this.model)
            .pipe(
                finalize(() => this.saving = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                if (form) {
                    this.initModel();
                    form.resetForm();
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
