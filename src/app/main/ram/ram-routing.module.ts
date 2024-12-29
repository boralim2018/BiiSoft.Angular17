import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { RAMComponent } from './ram.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: RAMComponent, data: { Permissions: AppPermissions.pages.setup.items.rams.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-ram/view-ram.component').then(c => c.ViewRAMComponent), data: { Permissions: AppPermissions.pages.setup.items.rams.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class RAMRoutingModule { }
