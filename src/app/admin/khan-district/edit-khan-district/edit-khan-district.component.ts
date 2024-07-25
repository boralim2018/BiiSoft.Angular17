import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateKhanDistrictInputDto, KhanDistrictDetailDto, KhanDistrictServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindCityProvinceComponent } from '../../../../shared/components/find-city-province/find-city-province.component';
import { FindCountryComponent } from '../../../../shared/components/find-country/find-country.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-khan-district',
    templateUrl: './edit-khan-district.component.html',
    providers: [KhanDistrictServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindCountryComponent, FindCityProvinceComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditKhanDistrictComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateKhanDistrictInputDto = new CreateUpdateKhanDistrictInputDto();
    country: any;
    cityProvince: any;

    constructor(
        injector: Injector,
        public _khanDistrictService: KhanDistrictServiceProxy,
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
        this._khanDistrictService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: KhanDistrictDetailDto) => {
                this.model = new CreateUpdateKhanDistrictInputDto();
                this.model.init(result);
                if (result.countryId) this.country = { id: result.countryId, name: result.countryName };
                if (result.cityProvinceId) this.cityProvince = { id: result.cityProvinceId, name: result.cityProvinceName };
            });
    }

    save(): void {
        this.saving = true;

        this._khanDistrictService.update(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
