import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TenantChangeDialogComponent } from './tenant-change-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { NgIf } from '@angular/common';

@Component({
    selector: 'tenant-change',
    templateUrl: './tenant-change.component.html',
    providers: [DialogService],
    standalone: true,
    imports: [NgIf, LocalizePipe]
})
export class TenantChangeComponent extends AppComponentBase implements OnInit {
    tenancyName = '';
    name = '';

    isMultiTenancyEnabled: boolean = abp.multiTenancy.isEnabled;

    constructor(
        injector: Injector,
        public dialogService: DialogService) {
        super(injector);
    }

    ngOnInit() {
        if (this.appSession.tenant) {
            this.tenancyName = this.appSession.tenant.tenancyName;
            this.name = this.appSession.tenant.name;
        }
    }

    showChangeModal(): void {

        const ref = this.dialogService.open(TenantChangeDialogComponent, {
            data: {
                tenancyName: this.appSession.tenant ? this.appSession.tenant.tenancyName : "",
            },
            header: this.l('ChangeTenant'),
            autoZIndex: false,
            styleClass: this.responsiveDialogClass
        });
        
        
    }
}
