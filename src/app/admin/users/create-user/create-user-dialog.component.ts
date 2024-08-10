import {
    Component,
    Injector,
    OnInit,
    EventEmitter,
    Output
} from '@angular/core';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import {
    UserServiceProxy,
    CreateUserDto,
    RoleDto,
    ProfileServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { PasswordComponentBase } from '@shared/app-component-base';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EqualValidator } from '../../../../shared/directives/equal-validator.directive';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    templateUrl: './create-user-dialog.component.html',
    providers: [UserServiceProxy, ProfileServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, TabViewModule, InputTextModule, AbpValidationSummaryComponent, NgClass, EqualValidator, InputSwitchModule, NgIf, NgFor, CheckboxModule, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateUserDialogComponent extends Mixin(PasswordComponentBase, DynamicDialogBase) implements OnInit {

    saving = false;
    user = new CreateUserDto();
    roles: RoleDto[] = [];

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.user.isActive = true;
        this._userService.getRoles().subscribe((result) => {
            this.roles = result.items;           
        });

        this.getPasswordComplexity();
    }

    save(): void {
        this.saving = true;

        this._userService.create(this.user)
            .pipe(
                finalize(() => this.saving = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((user) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(user);
            });
    }
}
