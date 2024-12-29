import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ScreenComponent } from './screen.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ScreenComponent, data: { Permissions: AppPermissions.pages.setup.items.screens.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-screen/view-screen.component').then(c => c.ViewScreenComponent), data: { Permissions: AppPermissions.pages.setup.items.screens.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ScreenRoutingModule { }
