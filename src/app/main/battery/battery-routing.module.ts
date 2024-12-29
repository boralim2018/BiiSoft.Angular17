import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { BatteryComponent } from './battery.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: BatteryComponent, data: { Permissions: AppPermissions.pages.setup.items.batteries.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-battery/view-battery.component').then(c => c.ViewBatteryComponent), data: { Permissions: AppPermissions.pages.setup.items.batteries.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BatteryRoutingModule { }
