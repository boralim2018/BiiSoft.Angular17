import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateCityProvinceInputDto, CityProvinceDetailDto, CityProvinceServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindCountryComponent } from '../../../../shared/components/find-country/find-country.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

@Component({
    selector: 'app-edit-city-province',
    templateUrl: './edit-city-province.component.html',
    providers: [CityProvinceServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextComponent, FindCountryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditCityProvinceComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateCityProvinceInputDto = new CreateUpdateCityProvinceInputDto();
    country: any;

    constructor(
        injector: Injector,
        public _cityProvinceService: CityProvinceServiceProxy,
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
        this._cityProvinceService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: CityProvinceDetailDto) => {
                this.model = new CreateUpdateCityProvinceInputDto();
                this.model.init(result);
                if (result.countryId) this.country = { id: result.countryId, name: result.countryName };
            });
    }

    save(): void {
        this.saving = true;

        this._cityProvinceService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
