import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateItemSeriesInputDto, ItemSeriesDetailDto, ItemSeriesServiceProxy } from '@shared/service-proxies/service-proxies';
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
import { FindChartOfAccountComponent } from '../../../../shared/components/find-chart-of-account/find-chart-of-account.component';

@Component({
    selector: 'app-edit-item-series',
    templateUrl: './edit-item-series.component.html',
    providers: [ItemSeriesServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindChartOfAccountComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditItemSeriesComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateItemSeriesInputDto = new CreateUpdateItemSeriesInputDto();
  
    constructor(
        injector: Injector,
        public _itemSeriesService: ItemSeriesServiceProxy,
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
        this._itemSeriesService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: ItemSeriesDetailDto) => {
                this.model = new CreateUpdateItemSeriesInputDto(result);
            });
    }

    save(): void {
        this.saving = true;

        this._itemSeriesService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
