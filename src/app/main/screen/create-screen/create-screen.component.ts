import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateScreenInputDto, ScreenServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { of } from 'rxjs';
import { FindChartOfAccountComponent } from '../../../../shared/components/find-chart-of-account/find-chart-of-account.component';

@Component({
    selector: 'app-create-screen',
    templateUrl: './create-screen.component.html',
    providers: [ScreenServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindChartOfAccountComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateScreenComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateScreenInputDto = new CreateUpdateScreenInputDto();
   
    constructor(
        injector: Injector,
        public _screenService: ScreenServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateScreenInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._screenService.create(this.model)
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
