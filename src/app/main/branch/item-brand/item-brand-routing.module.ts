import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemBrandComponent } from './item-brand.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemBrandComponent, data: { Permissions: AppPermissions.pages.setup.items.brands.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-item-brand/view-item-brand.component').then(c => c.ViewItemBrandComponent), data: { Permissions: AppPermissions.pages.setup.items.brands.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemBrandRoutingModule { }
