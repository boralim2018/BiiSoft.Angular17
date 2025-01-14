import { Injector } from '@angular/core';
import { AppPermissions } from '@shared/AppPermissions';
import { AppComponentBase } from '@shared/app-component-base';

export abstract class AppMenuPermission extends AppComponentBase {
    constructor(injector: Injector) {
        super(injector);
    }

    showMenuItem(menuItem: any): boolean {

        if (menuItem.items && menuItem.items.length) {
            for (let item of menuItem.items) {
                if (this.showMenuItem(item)) return true;
            }
            return false;
        }
        else if (Array.isArray(menuItem.permissionName)) {
            for (let item of menuItem.permissionName) {
                if (this.isGranted(item.permissionName)) {
                    menuItem.routerLink = item.routerLink;
                    return true;
                }
            }
            return false;
        }
        else if (menuItem.permissionName) {
            return this.isGranted(menuItem.permissionName);
        }

        return true;
    }
}

export abstract class AppMenuBase extends AppMenuPermission {
    constructor(injector: Injector) {
        super(injector);
    }

    model: any[] = [
        {
            label: this.l('Home'),
            items: [
                { label: this.l('Apps'), icon: 'pi pi-microsoft', routerLink: ['/app/apps'], permissionName: '', apps: true },
                { label: this.l('Dashboard'), icon: 'fa-solid fa-chart-line', routerLink: ['/app/dashboard'], permissionName: AppPermissions.pages.dashboard },
                { label: this.l('Tenants'), icon: 'fa-solid fa-building-user', routerLink: ['/app/admin/tenants'], permissionName: AppPermissions.pages.tenants.page },
                { label: this.l('Editions'), icon: 'fa-solid fa-list-check', routerLink: ['/app/admin/editions'], permissionName: AppPermissions.pages.editions.page },

                { label: this.l('Company'), icon: 'fa-solid fa-building', routerLink: ['/app/main/company'], permissionName: AppPermissions.pages.company.page },
                { label: this.l('Branches'), icon: 'fa-solid fa-tents', routerLink: ['/app/main/branches'], permissionName: AppPermissions.pages.company.branches.page },
            ]
        }, 
        {
            label: this.l('Setup'),
            items: [
                { label: this.l('Languages'), icon: 'fa-solid fa-language', routerLink: ['/app/admin/languages'], permissionName: AppPermissions.pages.languages.page },
                { label: this.l('Settings'), icon: 'fa-solid fa-gear', routerLink: ['/app/admin/settings'], permissionName: AppPermissions.pages.settings.host },

                { label: this.l('Settings'), icon: 'fa-solid fa-gear', routerLink: ['/app/main/settings'], permissionName: AppPermissions.pages.settings.tenant },
                { label: this.l('Taxes'), icon: 'fa-solid fa-money-check-dollar', routerLink: ['/app/main/taxes'], permissionName: AppPermissions.pages.setup.taxes.page },
                { label: this.l('Currency'), icon: 'fa-solid fa-dollar-sign', routerLink: ['/app/admin/currencies'], permissionName: AppPermissions.pages.setup.currencies.page },
                {
                    label: this.l('Items'),
                    icon: 'fa-solid fa-cubes',
                    items: [
                        { label: this.l('ItemList'), icon: 'fa-solid fa-images', routerLink: ['/app/main/items'], permissionName: AppPermissions.pages.setup.items.itemList.page },
                        { label: this.l('Units'), icon: 'fa-solid fa-pen-ruler', routerLink: ['/app/main/units'], permissionName: AppPermissions.pages.setup.items.units.page },
                        { label: this.l('ItemGroups'), icon: 'fa-solid fa-object-group', routerLink: ['/app/main/item-groups'], permissionName: AppPermissions.pages.setup.items.itemGroups.page },
                        { label: this.l('ItemBrands'), icon: 'fa-solid fa-trademark', routerLink: ['/app/main/item-brands'], permissionName: AppPermissions.pages.setup.items.brands.page },
                        { label: this.l('ItemGrades'), icon: 'fa-solid fa-arrow-up-1-9', routerLink: ['/app/main/item-grades'], permissionName: AppPermissions.pages.setup.items.grades.page },
                        { label: this.l('ItemSizes'), icon: 'fa-solid fa-list-ol', routerLink: ['/app/main/item-sizes'], permissionName: AppPermissions.pages.setup.items.sizes.page },
                        { label: this.l('ItemModels'), icon: 'fa-solid fa-shapes', routerLink: ['/app/main/item-models'], permissionName: AppPermissions.pages.setup.items.models.page },
                        { label: this.l('ItemSeries'), icon: 'fa-solid fa-arrow-up-right-dots', routerLink: ['/app/main/item-series'], permissionName: AppPermissions.pages.setup.items.series.page },
                        { label: this.l('ColorPatterns'), icon: 'fa-solid fa-palette', routerLink: ['/app/main/color-patterns'], permissionName: AppPermissions.pages.setup.items.colorPatterns.page },
                        { label: this.l('CPUs'), icon: 'fa-solid fa-microchip', routerLink: ['/app/main/cpu'], permissionName: AppPermissions.pages.setup.items.cpus.page },
                        { label: this.l('RAMs'), icon: 'fa-solid fa-memory', routerLink: ['/app/main/ram'], permissionName: AppPermissions.pages.setup.items.rams.page },
                        { label: this.l('VGAs'), icon: 'fa-solid fa-computer', routerLink: ['/app/main/vga'], permissionName: AppPermissions.pages.setup.items.vgas.page },
                        { label: this.l('HDDs'), icon: 'fa-solid fa-hard-drive', routerLink: ['/app/main/hdd'], permissionName: AppPermissions.pages.setup.items.hdds.page },
                        { label: this.l('Screens'), icon: 'fa-solid fa-display', routerLink: ['/app/main/screens'], permissionName: AppPermissions.pages.setup.items.screens.page },
                        { label: this.l('Cameras'), icon: 'fa-solid fa-camera', routerLink: ['/app/main/cameras'], permissionName: AppPermissions.pages.setup.items.cameras.page },
                        { label: this.l('Batteries'), icon: 'fa-solid fa-battery-half', routerLink: ['/app/main/batteries'], permissionName: AppPermissions.pages.setup.items.batteries.page },
                        { label: this.l('FieldAs'), icon: 'fa-solid fa-database', routerLink: ['/app/main/field-a'], permissionName: AppPermissions.pages.setup.items.fieldAs.page },
                        { label: this.l('FieldBs'), icon: 'fa-solid fa-database', routerLink: ['/app/main/field-b'], permissionName: AppPermissions.pages.setup.items.fieldBs.page },
                        { label: this.l('FieldCs'), icon: 'fa-solid fa-database', routerLink: ['/app/main/field-c'], permissionName: AppPermissions.pages.setup.items.fieldCs.page },
                    ]
                },
                {
                    label: this.l('Warehouses'),
                    icon: 'fa-solid fa-boxes-packing',
                    items: [
                        { label: this.l('WarehouseList'), icon: 'fa-solid fa-warehouse', routerLink: ['/app/main/warehouses'], permissionName: AppPermissions.pages.setup.warehouses.warehouseList.page },
                        { label: this.l('Zone'), icon: 'fa-solid fa-pallet', routerLink: ['/app/main/zones'], permissionName: AppPermissions.pages.setup.warehouses.zones.page },
                    ]
                },
                {
                    label: this.l('Location'),
                    icon: 'fa-solid fa-earth-asia',
                    items: [
                        { label: this.l('LocationList'), icon: 'fa-solid fa-location-dot', routerLink: ['/app/admin/locations'], permissionName: AppPermissions.pages.setup.locations.locationList.page },
                        { label: this.l('Countries'), icon: 'fa-solid fa-flag', routerLink: ['/app/admin/countries'], permissionName: AppPermissions.pages.setup.locations.countries.page },
                        { label: this.l('CityProvinces'), icon: 'fa-solid fa-city', routerLink: ['/app/admin/city-provinces'], permissionName: AppPermissions.pages.setup.locations.cityProvinces.page },
                        { label: this.l('KhanDistricts'), icon: 'fa-solid fa-mountain-city', routerLink: ['/app/admin/khan-districts'], permissionName: AppPermissions.pages.setup.locations.khanDistricts.page },
                        { label: this.l('SangkatCommunes'), icon: 'fa-solid fa-building-flag', routerLink: ['/app/admin/sangkat-communes'], permissionName: AppPermissions.pages.setup.locations.sangkatCommunes.page },
                        { label: this.l('Villages'), icon: 'fa-solid fa-tree-city', routerLink: ['/app/admin/villages'], permissionName: AppPermissions.pages.setup.locations.villages.page },
                    ]
                },
            ]
        },
        {
            label: this.l('Accounting'),
            items: [
                { label: this.l('ChartOfAccounts'), icon: 'fa-solid fa-book', routerLink: ['/app/main/chart-of-accounts'], permissionName: AppPermissions.pages.accounting.chartOfAccounts.page },
            ]
        },
        {
            label: this.l('Administrations'),
            items: [
                { label: this.l('Roles'), icon: 'fa-solid fa-user-check', routerLink: ['/app/admin/roles'], permissionName: AppPermissions.pages.administrations.roles.page },
                { label: this.l('Users'), icon: 'fa-solid fa-user', routerLink: ['/app/admin/users'], permissionName: AppPermissions.pages.administrations.users.page },
                //{ label: this.l('UserGroups'), icon: 'fa-solid fa-user-group', routerLink: ['/app/admin/user-groups'], permissionName: AppPermissions.pages.administrations.groups.page },
                { label: this.l('AuditLogs'), icon: 'fa-solid fa-clock', routerLink: ['/app/admin/audit-log'], permissionName: AppPermissions.pages.administrations.auditLogs.page },
            ]
        }
    ];

}
