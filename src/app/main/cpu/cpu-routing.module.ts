import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { CPUComponent } from './cpu.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CPUComponent, data: { Permissions: AppPermissions.pages.setup.items.cpus.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-cpu/view-cpu.component').then(c => c.ViewCPUComponent), data: { Permissions: AppPermissions.pages.setup.items.cpus.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CPURoutingModule { }
