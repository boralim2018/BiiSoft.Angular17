import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateSangkatCommuneInputDto, SangkatCommuneDetailDto, SangkatCommuneServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindKhanDistrictComponent } from '../../../../shared/components/find-khan-district/find-khan-district.component';
import { FindCityProvinceComponent } from '../../../../shared/components/find-city-province/find-city-province.component';
import { FindCountryComponent } from '../../../../shared/components/find-country/find-country.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    selector: 'app-edit-sangkat-commune',
    templateUrl: './edit-sangkat-commune.component.html',
    providers: [SangkatCommuneServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditSangkatCommuneComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateSangkatCommuneInputDto = new CreateUpdateSangkatCommuneInputDto();
    country: any;
    cityProvince: any;
    khanDistrict: any;

    constructor(
        injector: Injector,
        public _sangkatCommuneService: SangkatCommuneServiceProxy,
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
        this._sangkatCommuneService
            .getDetail(this._dialogConfig.data.id)
            .pipe(
                finalize(() => this.saving = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result: SangkatCommuneDetailDto) => {
                this.model = new CreateUpdateSangkatCommuneInputDto();
                this.model.init(result);
                if (result.countryId) this.country = { id: result.countryId, name: result.countryName };
                if (result.cityProvinceId) this.cityProvince = { id: result.cityProvinceId, name: result.cityProvinceName };
                if (result.khanDistrictId) this.khanDistrict = { id: result.khanDistrictId, name: result.khanDistrictName };
            });
    }

    save(): void {
        this.saving = true;

        this._sangkatCommuneService.update(this.model)
            .pipe(
                finalize(() => this.saving = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
