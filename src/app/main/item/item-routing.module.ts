import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemComponent } from './item.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemComponent, data: { Permissions: AppPermissions.pages.company.items.page },},
            { path: 'create', loadComponent: () => import('./create-item/create-item.component').then(m => m.CreateItemComponent), data: { Permissions: AppPermissions.pages.company.items.create }, },
            { path: 'edit/:id', loadComponent: () => import('./edit-item/edit-item.component').then(m => m.EditItemComponent), data: { Permissions: AppPermissions.pages.company.items.edit }, },
            { path: 'view-detail/:id', loadComponent: () => import('./view-item/view-item.component').then(m => m.ViewItemComponent), data: { Permissions: AppPermissions.pages.company.items.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemRoutingModule { }
