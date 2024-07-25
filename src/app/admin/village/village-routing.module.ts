import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { VillageComponent } from './village.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: VillageComponent, data: { Permissions: AppPermissions.pages.setup.currencies.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-village/view-village.component').then(c => c.ViewVillageComponent), data: { Permissions: AppPermissions.pages.setup.currencies.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class VillageRoutingModule { }
