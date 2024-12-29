import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemSizeComponent } from './item-size.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemSizeComponent, data: { Permissions: AppPermissions.pages.setup.items.sizes.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-item-size/view-item-size.component').then(c => c.ViewItemSizeComponent), data: { Permissions: AppPermissions.pages.setup.items.sizes.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemSizeRoutingModule { }
