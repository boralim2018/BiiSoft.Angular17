import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemGroupComponent } from './item-group.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemGroupComponent, data: { Permissions: AppPermissions.pages.setup.items.itemGroups.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-item-group/view-item-group.component').then(c => c.ViewItemGroupComponent), data: { Permissions: AppPermissions.pages.setup.items.itemGroups.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemGroupRoutingModule { }
