import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemGradeComponent } from './item-grade.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemGradeComponent, data: { Permissions: AppPermissions.pages.setup.items.grades.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-item-grade/view-item-grade.component').then(c => c.ViewItemGradeComponent), data: { Permissions: AppPermissions.pages.setup.items.grades.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemGradeRoutingModule { }
