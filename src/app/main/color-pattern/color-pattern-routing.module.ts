import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ColorPatternComponent } from './color-pattern.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ColorPatternComponent, data: { Permissions: AppPermissions.pages.setup.items.colorPatterns.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-color-pattern/view-color-pattern.component').then(c => c.ViewColorPatternComponent), data: { Permissions: AppPermissions.pages.setup.items.colorPatterns.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ColorPatternRoutingModule { }
