import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ZoneComponent } from './zone.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ZoneComponent, data: { Permissions: AppPermissions.pages.setup.warehouses.zones.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-zone/view-zone.component').then(c => c.ViewZoneComponent), data: { Permissions: AppPermissions.pages.setup.warehouses.zones.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ZoneRoutingModule { }
