import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemTabComponent } from './item-tab/item-tab.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemTabComponent, data: { Permissions: AppPermissions.pages.setup.items.itemList.page },},
            { path: 'create', loadComponent: () => import('./create-item/create-item.component').then(m => m.CreateItemComponent), data: { Permissions: AppPermissions.pages.setup.items.itemList.create }, },
            { path: 'edit/:id', loadComponent: () => import('./edit-item/edit-item.component').then(m => m.EditItemComponent), data: { Permissions: AppPermissions.pages.setup.items.itemList.edit }, },
            { path: 'view-detail/:id', loadComponent: () => import('./view-item/view-item.component').then(m => m.ViewItemComponent), data: { Permissions: AppPermissions.pages.setup.items.itemList.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemRoutingModule { }
