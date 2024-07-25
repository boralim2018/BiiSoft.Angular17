import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { AuditLogServiceProxy, AuditLogListDto } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { BusyDirective } from '../../../../shared/directives/busy.directive';

@Component({
    selector: 'app-view-audit-log',
    templateUrl: './view-audit-log.component.html',
    providers: [AuditLogServiceProxy],
    standalone: true,
    imports: [BusyDirective, ButtonDirective, Ripple, LocalizePipe]
})
export class ViewAuditLogComponent extends DynamicDialogBase implements OnInit {
    loading = false;
    auditLog: AuditLogListDto = new AuditLogListDto();

    constructor(
        injector: Injector,
        public _tenantService: AuditLogServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.auditLog = this._dialogConfig.data;
    }

    close() {
        this._dialogRef.close();
    }

}
