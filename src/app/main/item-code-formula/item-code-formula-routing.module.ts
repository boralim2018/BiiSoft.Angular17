import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '@shared/AppPermissions';
import { ItemCodeFormulaComponent } from './item-code-formula.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemCodeFormulaComponent, data: { Permissions: AppPermissions.pages.setup.items.itemCodeFormulas.page },},
            { path: 'view-detail/:id', loadComponent: () => import('./view-item-code-formula/view-item-code-formula.component').then(c => c.ViewItemCodeFormulaComponent), data: { Permissions: AppPermissions.pages.setup.items.itemCodeFormulas.view }, }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ItemCodeFormulaRoutingModule { }
