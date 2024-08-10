import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { TenantServiceProxy, TenantDto } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { FindEditionComponent } from '../../../../shared/components/find-edition/find-edition.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    templateUrl: 'edit-tenant-dialog.component.html',
    providers: [TenantServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindEditionComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditTenantDialogComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    tenant: TenantDto = new TenantDto();
    edition: any;

    constructor(
        injector: Injector,
        public _tenantService: TenantServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this._tenantService.get(this._dialogConfig.data.id).subscribe((result: TenantDto) => {
            this.tenant = result;
            if (result.editionId) this.edition = { id: result.editionId, name: result.editionName };
        });
    }

    save(): void {
        this.saving = true;
        this._tenantService.update(this.tenant)
            .pipe(
                finalize(() => this.saving = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(result);
            });
    }

    onEditionChange(event) {
        this.tenant.editionId = event?.id;
    }
}
