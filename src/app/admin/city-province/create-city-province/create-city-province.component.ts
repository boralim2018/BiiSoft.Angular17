import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateCityProvinceInputDto, CityProvinceServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindCountryComponent } from '../../../../shared/components/find-country/find-country.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

@Component({
    selector: 'app-create-city-province',
    templateUrl: './create-city-province.component.html',
    providers: [CityProvinceServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextComponent, FindCountryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateCityProvinceComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateCityProvinceInputDto = new CreateUpdateCityProvinceInputDto();
    country: any;
    
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
