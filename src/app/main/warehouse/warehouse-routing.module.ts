import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { WarehouseComponent } from './warehouse.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: WarehouseComponent, data: { Permissions: AppPermissions.pages.setup.warehouses.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-warehouse/view-warehouse.component').then(c => c.ViewWarehouseComponent), data: { Permissions: AppPermissions.pages.setup.warehouses.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class WarehouseRoutingModule { }
