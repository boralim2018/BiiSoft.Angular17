import { Component, HostListener, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { EmailSettingsEditDto, GeneralSettingsEditDto, HostBillingSettingsEditDto, HostSettingsEditDto, HostSettingsServiceProxy, HostUserManagementSettingsEditDto, PasswordComplexitySetting, SecuritySettingsEditDto, TenantManagementSettingsEditDto, TwoFactorLoginSettingsEditDto, UserLockOutSettingsEditDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { FindEditionComponent } from '../../../shared/components/find-edition/find-edition.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectTimezoneComponent } from '../../../shared/components/select-timezone/select-timezone.component';
import { NgIf } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
    selector: 'app-host-settings',
    templateUrl: './host-settings.component.html',
    animations: [appModuleAnimation()],
    providers: [HostSettingsServiceProxy],
    standalone: true,
    imports: [
        NavBarComponent,
        FormsModule,
        BusyDirective,
        TabViewModule,
        NgIf,
        SelectTimezoneComponent,
        InputSwitchModule,
        FindEditionComponent,
        InputTextModule,
        AbpValidationSummaryComponent,
        InputTextareaModule,
        ButtonDirective,
        Ripple,
    ],
})
export class HostSettingsComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    saving: boolean;
    showTimezoneSelection = abp.clock.provider.supportsMultipleTimezone;
    hostSettings: HostSettingsEditDto = new HostSettingsEditDto({
        general: new GeneralSettingsEditDto(),
        tenantManagement: new TenantManagementSettingsEditDto(),
        userManagement: new HostUserManagementSettingsEditDto(),
        email: new EmailSettingsEditDto(),
        billing: new HostBillingSettingsEditDto(),
        security: new SecuritySettingsEditDto({
            useDefaultPasswordComplexitySettings: false,
            passwordComplexity: new PasswordComplexitySetting(),
            defaultPasswordComplexity: new PasswordComplexitySetting(),
            userLockOut: new UserLockOutSettingsEditDto(),
            twoFactorLogin: new TwoFactorLoginSettingsEditDto(),
        })
    });

    edition: any;

    constructor(
        injector: Injector,
        private _hostSettingsService: HostSettingsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.initNavBar();
        this.getAllSettings();
    }

    initNavBar() {
        this.title = this.l("Settings");
        this.setTitle();
    }


    getAllSettings() {
        this.saving = true;
        this._hostSettingsService.getAllSettings()
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(
                result => {
                    this.hostSettings = result;
                    if (result.tenantManagement?.defaultEditionId) this.edition = { id: result.tenantManagement.defaultEditionId, name: result.tenantManagement.defaultEditionName };
                },
                ex => {
                    this.saving = false;
                    this.message.error(ex.message);
                }
            );
    }

    saveAll() {
        this.saving = true;
        this._hostSettingsService.updateAllSettings(this.hostSettings)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(
                () => {
                    this.notify.success("SavedSuccessfully");
                    window.location.reload();
                },
                ex => {
                    this.saving = false;
                    this.message.error(ex.message);
                }
            );
    }


}
