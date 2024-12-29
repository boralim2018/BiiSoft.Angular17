import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '../../shared/AppPermissions';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            { path: 'company', loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent), data: { permission: AppPermissions.pages.company.page } },
            { path: 'branches', loadChildren: () => import('./branch/branch-routing.module').then(m => m.BranchRoutingModule), data: { permission: AppPermissions.pages.company.branches.page } },
            { path: 'chart-of-accounts', loadChildren: () => import('./chart-of-account/chart-of-account-routing.module').then(m => m.ChartOfAccountRoutingModule), data: { permission: AppPermissions.pages.accounting.chartOfAccounts.page } },
            { path: 'taxes', loadChildren: () => import('./tax/tax-routing.module').then(m => m.TaxRoutingModule), data: { permission: AppPermissions.pages.setup.taxes.page } },

            { path: 'units', loadChildren: () => import('./unit/unit-routing.module').then(m => m.UnitRoutingModule), data: { permission: AppPermissions.pages.setup.items.units.page } },
            { path: 'item-groups', loadChildren: () => import('./item-group/item-group-routing.module').then(m => m.ItemGroupRoutingModule), data: { permission: AppPermissions.pages.setup.items.itemGroups.page } },
            { path: 'item-brands', loadChildren: () => import('./item-brand/item-brand-routing.module').then(m => m.ItemBrandRoutingModule), data: { permission: AppPermissions.pages.setup.items.brands.page } },
            { path: 'item-grades', loadChildren: () => import('./item-grade/item-grade-routing.module').then(m => m.ItemGradeRoutingModule), data: { permission: AppPermissions.pages.setup.items.grades.page } },
            { path: 'item-models', loadChildren: () => import('./item-model/item-model-routing.module').then(m => m.ItemModelRoutingModule), data: { permission: AppPermissions.pages.setup.items.models.page } },
            { path: 'item-sizes', loadChildren: () => import('./item-size/item-size-routing.module').then(m => m.ItemSizeRoutingModule), data: { permission: AppPermissions.pages.setup.items.sizes.page } },
            { path: 'item-series', loadChildren: () => import('./item-series/item-series-routing.module').then(m => m.ItemSeriesRoutingModule), data: { permission: AppPermissions.pages.setup.items.series.page } },
            { path: 'color-patterns', loadChildren: () => import('./color-pattern/color-pattern-routing.module').then(m => m.ColorPatternRoutingModule), data: { permission: AppPermissions.pages.setup.items.colorPatterns.page } },
            { path: 'cpu', loadChildren: () => import('./cpu/cpu-routing.module').then(m => m.CPURoutingModule), data: { permission: AppPermissions.pages.setup.items.cpus.page } },
            { path: 'ram', loadChildren: () => import('./ram/ram-routing.module').then(m => m.RAMRoutingModule), data: { permission: AppPermissions.pages.setup.items.rams.page } },
            { path: 'vga', loadChildren: () => import('./vga/vga-routing.module').then(m => m.VGARoutingModule), data: { permission: AppPermissions.pages.setup.items.vgas.page } },
            { path: 'hdd', loadChildren: () => import('./hdd/hdd-routing.module').then(m => m.HDDRoutingModule), data: { permission: AppPermissions.pages.setup.items.hdds.page } },
            { path: 'screens', loadChildren: () => import('./screen/screen-routing.module').then(m => m.ScreenRoutingModule), data: { permission: AppPermissions.pages.setup.items.screens.page } },
            { path: 'cameras', loadChildren: () => import('./camera/camera-routing.module').then(m => m.CameraRoutingModule), data: { permission: AppPermissions.pages.setup.items.cameras.page } },
            { path: 'batteries', loadChildren: () => import('./battery/battery-routing.module').then(m => m.BatteryRoutingModule), data: { permission: AppPermissions.pages.setup.items.batteries.page } },
            { path: 'field-a', loadChildren: () => import('./field-a/field-a-routing.module').then(m => m.FieldARoutingModule), data: { permission: AppPermissions.pages.setup.items.fieldAs.page } },
            { path: 'field-b', loadChildren: () => import('./field-b/field-b-routing.module').then(m => m.FieldBRoutingModule), data: { permission: AppPermissions.pages.setup.items.fieldBs.page } },
            { path: 'field-c', loadChildren: () => import('./field-c/field-c-routing.module').then(m => m.FieldCRoutingModule), data: { permission: AppPermissions.pages.setup.items.fieldCs.page } },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
