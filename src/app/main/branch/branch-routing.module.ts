import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { BranchComponent } from './branch.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: BranchComponent, data: { Permissions: AppPermissions.pages.company.branches.page },},
            { path: 'create', loadComponent: () => import('./create-branch/create-branch.component').then(m => m.CreateBranchComponent), data: { Permissions: AppPermissions.pages.company.branches.create }, },
            { path: 'edit/:id', loadComponent: () => import('./edit-branch/edit-branch.component').then(m => m.EditBranchComponent), data: { Permissions: AppPermissions.pages.company.branches.edit }, },
            { path: 'view-detail/:id', loadComponent: () => import('./view-branch/view-branch.component').then(m => m.ViewBranchComponent), data: { Permissions: AppPermissions.pages.company.branches.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BranchRoutingModule { }
