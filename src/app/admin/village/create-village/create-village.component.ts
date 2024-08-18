import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateVillageInputDto, VillageServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindSangkatCommuneComponent } from '../../../../shared/components/find-sangkat-commune/find-sangkat-commune.component';
import { FindKhanDistrictComponent } from '../../../../shared/components/find-khan-district/find-khan-district.component';
import { FindCityProvinceComponent } from '../../../../shared/components/find-city-province/find-city-province.component';
import { FindCountryComponent } from '../../../../shared/components/find-country/find-country.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { of } from 'rxjs';

@Component({
    selector: 'app-create-village',
    templateUrl: './create-village.component.html',
    providers: [VillageServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, FindSangkatCommuneComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateVillageComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateVillageInputDto = new CreateUpdateVillageInputDto();
    country: any;
    cityProvince: any;
    khanDistrict: any;

    constructor(
        injector: Injector,
        public _villageService: VillageServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateVillageInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._villageService.create(this.model)
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
