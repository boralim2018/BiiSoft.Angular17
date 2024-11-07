import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ChartOfAccountComponent } from './chart-of-account.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ChartOfAccountComponent, data: { Permissions: AppPermissions.pages.accounting.chartOfAccounts.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-chart-of-account/view-chart-of-account.component').then(c => c.ViewChartOfAccountComponent), data: { Permissions: AppPermissions.pages.accounting.chartOfAccounts.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ChartOfAccountRoutingModule { }
