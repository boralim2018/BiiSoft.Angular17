import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { CountryComponent } from './country.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CountryComponent, data: { Permissions: AppPermissions.pages.setup.currencies.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-country/view-country.component').then(c => c.ViewCountryComponent), data: { Permissions: AppPermissions.pages.setup.currencies.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CountryRoutingModule { }
