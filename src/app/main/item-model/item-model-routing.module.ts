import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemModelComponent } from './item-model.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemModelComponent, data: { Permissions: AppPermissions.pages.setup.items.models.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-item-model/view-item-model.component').then(c => c.ViewItemModelComponent), data: { Permissions: AppPermissions.pages.setup.items.models.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemModelRoutingModule { }
