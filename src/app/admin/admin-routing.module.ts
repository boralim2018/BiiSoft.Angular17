import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '../../shared/AppPermissions';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            { path: 'tenants', loadComponent: () => import('./tenants/tenants.component').then(m => m.TenantsComponent), data: { permission: AppPermissions.pages.tenants.page } },
            { path: 'editions', loadComponent: () => import('./edition/edition.component').then(m => m.EditionComponent), data: { permission: AppPermissions.pages.editions.page } },
            { path: 'settings', loadComponent: () => import('./host-settings/host-settings.component').then(m => m.HostSettingsComponent), data: { permission: AppPermissions.pages.settings.host } },
            { path: 'users', loadComponent: () => import('./users/users.component').then(m => m.UsersComponent), data: { permission: AppPermissions.pages.administrations.users.page } },
            { path: 'roles', loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent), data: { permission: AppPermissions.pages.administrations.roles.page } },
            { path: 'audit-log', loadComponent: () => import('./audit-log/audit-log.component').then(m => m.AuditLogComponent), data: { permission: AppPermissions.pages.administrations.auditLogs.page } },
            { path: 'languages', loadChildren: () => import('./languages/languages-routing.module').then(m => m.LanguagesRoutingModule), data: { permission: AppPermissions.pages.languages.page } },
            { path: 'currencies', loadChildren: () => import('./currency/currency-routing.module').then(m => m.CurrencyRoutingModule), data: { permission: AppPermissions.pages.setup.currencies.page } },
            { path: 'locations', loadChildren: () => import('./location/location-routing.module').then(m => m.LocationRoutingModule), data: { permission: AppPermissions.pages.setup.locations.locationList.page } },
            { path: 'countries', loadChildren: () => import('./country/country-routing.module').then(m => m.CountryRoutingModule), data: { permission: AppPermissions.pages.setup.locations.countries.page } },
            { path: 'city-provinces', loadChildren: () => import('./city-province/city-province-routing.module').then(m => m.CityProvinceRoutingModule), data: { permission: AppPermissions.pages.setup.locations.cityProvinces.page } },
            { path: 'khan-districts', loadChildren: () => import('./khan-district/khan-district-routing.module').then(m => m.KhanDistrictRoutingModule), data: { permission: AppPermissions.pages.setup.locations.khanDistricts.page } },
            { path: 'sangkat-communes', loadChildren: () => import('./sangkat-commune/sangkat-commune-routing.module').then(m => m.SangkatCommuneRoutingModule), data: { permission: AppPermissions.pages.setup.locations.sangkatCommunes.page } },
            { path: 'villages', loadChildren: () => import('./village/village-routing.module').then(m => m.VillageRoutingModule), data: { permission: AppPermissions.pages.setup.locations.villages.page } },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule { }
