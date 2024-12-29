import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { VGAComponent } from './vga.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: VGAComponent, data: { Permissions: AppPermissions.pages.setup.items.vgas.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-vga/view-vga.component').then(c => c.ViewVGAComponent), data: { Permissions: AppPermissions.pages.setup.items.vgas.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class VGARoutingModule { }
