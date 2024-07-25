import {
    Component,
    OnInit,
    ViewEncapsulation,
    Injector
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AccountFooterComponent } from './account-footer.component';
import { AccountLanguagesComponent } from './account-languages.component';
import { RouterOutlet } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TenantChangeComponent } from './tenant/tenant-change.component';
import { NgIf } from '@angular/common';
import { AccountHeaderComponent } from './account-header.component';

@Component({
    templateUrl: './account-layout.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [AccountHeaderComponent, NgIf, TenantChangeComponent, DividerModule, RouterOutlet, AccountLanguagesComponent, AccountFooterComponent]
})
export class AccountLayoutComponent extends AppComponentBase implements OnInit {
   
    constructor(injector: Injector) {
        super(injector);
    }

    showTenantChange: boolean = abp.multiTenancy.isEnabled;

    ngOnInit(): void {
    }
}
