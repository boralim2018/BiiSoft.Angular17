import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { UserServiceProxy, UserDto, RoleDto } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgFor } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: './edit-user-dialog.component.html',
    providers: [UserServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, TabViewModule, InputTextModule, AbpValidationSummaryComponent, InputSwitchModule, NgIf, NgFor, CheckboxModule, ButtonDirective, Ripple, LocalizePipe]
})
export class EditUserDialogComponent extends DynamicDialogBase
    implements OnInit {
    saving = false;
    user = new UserDto();
    roles: RoleDto[] = [];  

    constructor(
        injector: Injector,
        public _userService: UserServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this._userService.getRoles().subscribe((result) => {
            this.roles = result.items;
        });

        this._userService.get(this._dialogConfig.data.id)
            .subscribe((result) => {
            this.user = result;
        });
    }

    save(): void {
        this.saving = true;

        this._userService.update(this.user)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(result)
            });
    }
}
