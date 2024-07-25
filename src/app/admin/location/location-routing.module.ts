import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { LocationComponent } from './location.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LocationComponent, data: { Permissions: AppPermissions.pages.setup.locations.locationList.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-location/view-location.component').then(c => c.ViewLocationComponent), data: { Permissions: AppPermissions.pages.setup.locations.locationList.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class LocationRoutingModule { }
