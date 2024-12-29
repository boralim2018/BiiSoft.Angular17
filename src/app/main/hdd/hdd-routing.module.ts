import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { HDDComponent } from './hdd.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HDDComponent, data: { Permissions: AppPermissions.pages.setup.items.hdds.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-hdd/view-hdd.component').then(c => c.ViewHDDComponent), data: { Permissions: AppPermissions.pages.setup.items.hdds.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class HDDRoutingModule { }
