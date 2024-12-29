import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { FieldBComponent } from './field-b.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FieldBComponent, data: { Permissions: AppPermissions.pages.setup.items.fieldBs.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-field-b/view-field-b.component').then(c => c.ViewFieldBComponent), data: { Permissions: AppPermissions.pages.setup.items.fieldBs.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FieldBRoutingModule { }
