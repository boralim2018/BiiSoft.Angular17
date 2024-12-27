import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '../../shared/AppPermissions';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            { path: 'company', loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent), data: { permission: AppPermissions.pages.company.page } },
            { path: 'branches', loadChildren: () => import('./branch/branch-routing.module').then(m => m.BranchRoutingModule), data: { permission: AppPermissions.pages.company.branches.page } },
            { path: 'chart-of-accounts', loadChildren: () => import('./chart-of-account/chart-of-account-routing.module').then(m => m.ChartOfAccountRoutingModule), data: { permission: AppPermissions.pages.accounting.chartOfAccounts.page } },
            { path: 'taxes', loadChildren: () => import('./tax/tax-routing.module').then(m => m.TaxRoutingModule), data: { permission: AppPermissions.pages.setup.taxes.page } },
            { path: 'units', loadChildren: () => import('./unit/unit-routing.module').then(m => m.UnitRoutingModule), data: { permission: AppPermissions.pages.setup.items.units.page } },
            { path: 'item-groups', loadChildren: () => import('./item-group/item-group-routing.module').then(m => m.ItemGroupRoutingModule), data: { permission: AppPermissions.pages.setup.items.itemGroups.page } },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
