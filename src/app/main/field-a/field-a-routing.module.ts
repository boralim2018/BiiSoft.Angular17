import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { FieldAComponent } from './field-a.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FieldAComponent, data: { Permissions: AppPermissions.pages.setup.items.fieldAs.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-field-a/view-field-a.component').then(c => c.ViewFieldAComponent), data: { Permissions: AppPermissions.pages.setup.items.fieldAs.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FieldARoutingModule { }
