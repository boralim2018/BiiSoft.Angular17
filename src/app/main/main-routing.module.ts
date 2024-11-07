import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '../../shared/AppPermissions';
import { UnitComponent } from './unit/unit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            { path: 'company', loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent), data: { permission: AppPermissions.pages.company.page } },
            { path: 'branches', loadChildren: () => import('./branch/branch-routing.module').then(m => m.BranchRoutingModule), data: { permission: AppPermissions.pages.company.branches.page } },
            { path: 'chart-of-accounts', loadChildren: () => import('./chart-of-account/chart-of-account-routing.module').then(m => m.ChartOfAccountRoutingModule), data: { permission: AppPermissions.pages.accounting.chartOfAccounts.page } },
            { path: 'units', loadComponent: () => import('./unit/unit.component').then(m => m.UnitComponent), data: { permission: AppPermissions.pages.setup.items.units.page } },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
