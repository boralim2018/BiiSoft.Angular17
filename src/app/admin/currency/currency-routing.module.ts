import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { CurrencyComponent } from './currency.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CurrencyComponent, data: { Permissions: AppPermissions.pages.setup.currencies.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-currency/view-currency.component').then(c => c.ViewCurrencyComponent), data: { Permissions: AppPermissions.pages.setup.currencies.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CurrencyRoutingModule { }
