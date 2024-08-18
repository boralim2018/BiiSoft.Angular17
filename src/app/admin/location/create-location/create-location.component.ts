import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateLocationInputDto, LocationServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { of } from 'rxjs';

@Component({
    selector: 'app-create-location',
    templateUrl: './create-location.component.html',
    providers: [LocationServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateLocationComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateLocationInputDto = new CreateUpdateLocationInputDto();

    constructor(
        injector: Injector,
        public _locationService: LocationServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = this._dialogConfig.data.model ? this._dialogConfig.data.model : new CreateUpdateLocationInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._locationService.create(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                if (form) {
                    this.initModel();
                    form.resetForm();
                }
                else {
                    this.model.id = result;
                    this._dialogRef.close(this.model);
                }
            });
    }

    saveNew(form: NgForm) {
        this.save(form);
    }

}
