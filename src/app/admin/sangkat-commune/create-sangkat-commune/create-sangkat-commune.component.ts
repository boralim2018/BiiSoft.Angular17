import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateSangkatCommuneInputDto, SangkatCommuneServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindKhanDistrictComponent } from '../../../../shared/components/find-khan-district/find-khan-district.component';
import { FindCityProvinceComponent } from '../../../../shared/components/find-city-province/find-city-province.component';
import { FindCountryComponent } from '../../../../shared/components/find-country/find-country.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

@Component({
    selector: 'app-create-sangkat-commune',
    templateUrl: './create-sangkat-commune.component.html',
    providers: [SangkatCommuneServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextComponent, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateSangkatCommuneComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateSangkatCommuneInputDto = new CreateUpdateSangkatCommuneInputDto();
    country: any;
    cityProvince: any;
    khanDistrict: any;

    constructor(
        injector: Injector,
        public _sangkatCommuneService: SangkatCommuneServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateSangkatCommuneInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._sangkatCommuneService.create(this.model)
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
