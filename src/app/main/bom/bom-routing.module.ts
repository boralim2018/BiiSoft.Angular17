import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { BOMComponent } from './bom.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: BOMComponent, data: { Permissions: AppPermissions.pages.setup.items.boms.page }, },
            { path: 'create', loadComponent: () => import('./create-bom/create-bom.component').then(m => m.CreateBOMComponent), data: { Permissions: AppPermissions.pages.setup.items.boms.create }, },
            { path: 'edit/:id', loadComponent: () => import('./edit-bom/edit-bom.component').then(m => m.EditBOMComponent), data: { Permissions: AppPermissions.pages.setup.items.boms.edit }, },
            { path: 'view-detail/:id', loadComponent: () => import('./view-bom/view-bom.component').then(c => c.ViewBOMComponent), data: { Permissions: AppPermissions.pages.setup.items.boms.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BOMRoutingModule { }
