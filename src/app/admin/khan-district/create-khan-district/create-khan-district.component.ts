import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateKhanDistrictInputDto, KhanDistrictServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindCityProvinceComponent } from '../../../../shared/components/find-city-province/find-city-province.component';
import { FindCountryComponent } from '../../../../shared/components/find-country/find-country.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { of } from 'rxjs';

@Component({
    selector: 'app-create-khan-district',
    templateUrl: './create-khan-district.component.html',
    providers: [KhanDistrictServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindCountryComponent, FindCityProvinceComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateKhanDistrictComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateKhanDistrictInputDto = new CreateUpdateKhanDistrictInputDto();
    country: any;

    constructor(
        injector: Injector,
        public _khanDistrictService: KhanDistrictServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateKhanDistrictInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._khanDistrictService.create(this.model)
            .pipe(finalize(() => this.saving = false))
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
