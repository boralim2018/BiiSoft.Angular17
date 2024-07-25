import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateTenantDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FindEditionComponent } from '../../../../shared/components/find-edition/find-edition.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: 'create-tenant-dialog.component.html',
    providers: [TenantServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, FindEditionComponent, InputSwitchModule, MessageModule, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateTenantDialogComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    tenant: CreateTenantDto = new CreateTenantDto();
    edition: any;

    constructor(
        injector: Injector,
        public _tenantService: TenantServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.tenant.isActive = true;
    }

    save(): void {
        this.saving = true;

        this._tenantService.create(this.tenant)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(result);
            });
    }

}
