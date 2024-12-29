import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { CameraComponent } from './camera.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CameraComponent, data: { Permissions: AppPermissions.pages.setup.items.cameras.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-camera/view-camera.component').then(c => c.ViewCameraComponent), data: { Permissions: AppPermissions.pages.setup.items.cameras.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CameraRoutingModule { }
