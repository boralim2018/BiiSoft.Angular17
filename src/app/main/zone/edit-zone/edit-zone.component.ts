import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateZoneInputDto, ZoneDetailDto, ZoneServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { FindWarehouseComponent } from '../../../../shared/components/find-warehouse/find-warehouse.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-edit-zone',
    templateUrl: './edit-zone.component.html',
    providers: [ZoneServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindWarehouseComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditZoneComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateZoneInputDto = new CreateUpdateZoneInputDto();
    warehouse: any;

    constructor(
        injector: Injector,
        public _zoneService: ZoneServiceProxy,
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
        this._zoneService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: ZoneDetailDto) => {
                this.model = new CreateUpdateZoneInputDto(result);
                this.warehouse = result.warehouseId ? { id: result.warehouseId, name: result.warehouseName } : undefined;
            });
    }

    save(): void {
        this.saving = true;

        this._zoneService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
