import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateZoneInputDto, ZoneServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FindWarehouseComponent } from '../../../../shared/components/find-warehouse/find-warehouse.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-create-zone',
    templateUrl: './create-zone.component.html',
    providers: [ZoneServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindWarehouseComponent, FindWarehouseComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateZoneComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateZoneInputDto = new CreateUpdateZoneInputDto();
    warehouse: any;

    constructor(
        injector: Injector,
        public _zoneService: ZoneServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateZoneInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._zoneService.create(this.model)
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
