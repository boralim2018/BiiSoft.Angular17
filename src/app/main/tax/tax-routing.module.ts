import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { TaxComponent } from './tax.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: TaxComponent, data: { Permissions: AppPermissions.pages.setup.taxes.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-tax/view-tax.component').then(c => c.ViewTaxComponent), data: { Permissions: AppPermissions.pages.setup.taxes.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TaxRoutingModule { }
