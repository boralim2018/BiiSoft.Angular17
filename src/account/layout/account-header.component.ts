import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '../../shared/AppConsts';

@Component({
    selector: 'account-header',
    templateUrl: './account-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AccountHeaderComponent extends AppComponentBase {

    darkMode: boolean;

    constructor(injector: Injector) {
        super(injector);
        this.darkMode = abp.utils.getCookieValue(AppConsts.ui.theme.colorScheme) === 'dark';
    }
}
