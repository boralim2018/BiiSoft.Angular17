import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateChartOfAccountInputDto, ChartOfAccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { SelectAccountTypeComponent } from "../../../../shared/components/select-account-type/select-account-type.component";
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { of } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-create-chart-of-account',
    templateUrl: './create-chart-of-account.component.html',
    providers: [ChartOfAccountServiceProxy],
    standalone: true,
    imports: [
        SelectAccountTypeComponent,
        FormsModule, ButtonModule, NgIf, NgFor, NgClass,
        BusyDirective, LocalizePipe,
        InputTextModule, AbpValidationSummaryComponent,         
        DropdownModule, ButtonDirective, Ripple, MessageModule]
})
export class CreateChartOfAccountComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateChartOfAccountInputDto = new CreateUpdateChartOfAccountInputDto();

    constructor(
        injector: Injector,
        public _chartOfaccountService: ChartOfAccountServiceProxy,
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
        this.model = this._dialogConfig.data.model ? this._dialogConfig.data.model : new CreateUpdateChartOfAccountInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._chartOfaccountService.create(this.model)
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
