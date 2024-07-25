import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { KhanDistrictComponent } from './khan-district.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: KhanDistrictComponent, data: { Permissions: AppPermissions.pages.setup.currencies.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-khan-district/view-khan-district.component').then(c => c.ViewKhanDistrictComponent), data: { Permissions: AppPermissions.pages.setup.currencies.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class KhanDistrictRoutingModule { }
