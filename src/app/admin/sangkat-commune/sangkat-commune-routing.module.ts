import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { SangkatCommuneComponent } from './sangkat-commune.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SangkatCommuneComponent, data: { Permissions: AppPermissions.pages.setup.currencies.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-sangkat-commune/view-sangkat-commune.component').then(c => c.ViewSangkatCommuneComponent), data: { Permissions: AppPermissions.pages.setup.currencies.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SangkatCommuneRoutingModule { }
