import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemSeriesComponent } from './item-series.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemSeriesComponent, data: { Permissions: AppPermissions.pages.setup.items.series.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-item-series/view-item-series.component').then(c => c.ViewItemSeriesComponent), data: { Permissions: AppPermissions.pages.setup.items.series.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemSeriesRoutingModule { }
