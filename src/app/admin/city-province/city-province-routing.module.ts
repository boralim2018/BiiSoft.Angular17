import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { CityProvinceComponent } from './city-province.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CityProvinceComponent, data: { Permissions: AppPermissions.pages.setup.currencies.page }, },
            { path: 'view-detail/:id', loadComponent: () => import('./view-city-province/view-city-province.component').then(c => c.ViewCityProvinceComponent), data: { Permissions: AppPermissions.pages.setup.currencies.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CityProvinceRoutingModule { }
