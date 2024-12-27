import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { UnitComponent } from './unit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: UnitComponent, data: { Permissions: AppPermissions.pages.setup.items.units.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-unit/view-unit.component').then(c => c.ViewUnitComponent), data: { Permissions: AppPermissions.pages.setup.items.units.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class UnitRoutingModule { }
