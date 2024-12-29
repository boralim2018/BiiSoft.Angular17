import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { FieldCComponent } from './field-c.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FieldCComponent, data: { Permissions: AppPermissions.pages.setup.items.fieldCs.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-field-c/view-field-c.component').then(c => c.ViewFieldCComponent), data: { Permissions: AppPermissions.pages.setup.items.fieldCs.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FieldCRoutingModule { }
