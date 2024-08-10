import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateVillageInputDto, VillageDetailDto, VillageServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    selector: 'app-edit-village',
    templateUrl: './edit-village.component.html',
    providers: [VillageServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, FindSangkatCommuneComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditVillageComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateVillageInputDto = new CreateUpdateVillageInputDto();
    country: any;
    cityProvince: any;
    khanDistrict: any;
    sangkatCommune: any;

    constructor(
        injector: Injector,
        public _villageService: VillageServiceProxy,
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
        this._villageService
            .getDetail(this._dialogConfig.data.id)
            .pipe(
                finalize(() => this.saving = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result: VillageDetailDto) => {
                this.model = new CreateUpdateVillageInputDto();
                this.model.init(result);
                if (result.countryId) this.country = { id: result.countryId, name: result.countryName };
                if (result.cityProvinceId) this.cityProvince = { id: result.cityProvinceId, name: result.cityProvinceName };
                if (result.khanDistrictId) this.khanDistrict = { id: result.khanDistrictId, name: result.khanDistrictName };
                if (result.sangkatCommuneId) this.sangkatCommune = { id: result.sangkatCommuneId, name: result.sangkatCommuneName };
            });
    }

    save(): void {
        this.saving = true;

        this._villageService.update(this.model)
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
