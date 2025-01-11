export class AppPermissions {

    static pages = {
        page: "Pages",
        dashboard: "Pages.Dashboard",

        //#region Tenants
        tenants: {
            page: "Pages.Tenants",
            create: "Pages.Tenants.Create",
            edit: "Pages.Tenants.Edit",
            changeFeatures: "Pages.Tenants.ChangeFeatures",
            delete: "Pages.Tenants.Delete",
            exportExcel: "Pages.Tenants.ExportExcel",
            enable: "Pages.Tenants.Enable",
            disable: "Pages.Tenants.Disable",
            impersonation: "Pages.Tenants.Impersonation",
        },
        //#endregion

        //#region Editions
        editions: {
            page: "Pages.Editions",
            create: "Pages.Editions.Create",
            edit: "Pages.Editions.Edit",
            delete: "Pages.Editions.Delete",
            exportExcel: "Pages.Editions.ExportExcel",
        },
        //#endregion

        //#region Languages
        languages: {
            page: "Pages.Languages",
            create: "Pages.Languages.Create",
            edit: "Pages.Languages.Edit",
            delete: "Pages.Languages.Delete",
            enable: "Pages.Languages.Enable",
            disable: "Pages.Languages.Disable",
            changeTexts: "Pages.Languages.ChangeTexts"
        },
        //#endregion

        //#region MailServer
        settings: {
            host: "Pages.Settings.Host",
            tenant: "Pages.Settings.Tenanat",
        },
        //#endregion

        //#region Setup
        setup: {
            page: "Pages.Setup",
            //#region Currencies
            currencies: {
                page: "Pages.Setup.Currencies",
                create: "Pages.Setup.Currencies.Create",
                view: "Pages.Setup.Currencies.View",
                edit: "Pages.Setup.Currencies.Edit",
                delete: "Pages.Setup.Currencies.Delete",
                importExcel: "Pages.Setup.Currencies.ImportExcel",
                exportExcel: "Pages.Setup.Currencies.ExportExcel",
                enable: "Pages.Setup.Currencies.Enable",
                disable: "Pages.Setup.Currencies.Disable",
                setAsDefault: "Pages.Setup.Currencies.SetAsDefault",
            },

            //#endregion

            //#region Locations
            locations: {
                page: "Pages.Setup.Locations",
                locationList: {
                    page: "Pages.Setup.Locations_List",
                    create: "Pages.Setup.Locations.Create",
                    view: "Pages.Setup.Locations.View",
                    edit: "Pages.Setup.Locations.Edit",
                    delete: "Pages.Setup.Locations.Delete",
                    importExcel: "Pages.Setup.Locations.ImportExcel",
                    exportExcel: "Pages.Setup.Locations.ExportExcel",
                    enable: "Pages.Setup.Locations.Enable",
                    disable: "Pages.Setup.Locations.Disable",
                },

                countries: {
                    page: "Pages.Setup.Locations.Countries",
                    create: "Pages.Setup.Locations.Countries.Create",
                    view: "Pages.Setup.Locations.Countries.View",
                    edit: "Pages.Setup.Locations.Countries.Edit",
                    delete: "Pages.Setup.Locations.Countries.Delete",
                    importExcel: "Pages.Setup.Locations.Countries.ImportExcel",
                    exportExcel: "Pages.Setup.Locations.Countries.ExportExcel",
                    enable: "Pages.Setup.Locations.Countries.Enable",
                    disable: "Pages.Setup.Locations.Countries.Disable",
                },

                cityProvinces: {
                    page: "Pages.Setup.Locations.CityProvinces",
                    create: "Pages.Setup.Locations.CityProvinces.Create",
                    view: "Pages.Setup.Locations.CityProvinces.View",
                    edit: "Pages.Setup.Locations.CityProvinces.Edit",
                    delete: "Pages.Setup.Locations.CityProvinces.Delete",
                    importExcel: "Pages.Setup.Locations.CityProvinces.ImportExcel",
                    exportExcel: "Pages.Setup.Locations.CityProvinces.ExportExcel",
                    enable: "Pages.Setup.Locations.CityProvinces.Enable",
                    disable: "Pages.Setup.Locations.CityProvinces.Disable",
                },

                khanDistricts: {
                    page: "Pages.Setup.Locations.KhanDistricts",
                    create: "Pages.Setup.Locations.KhanDistricts.Create",
                    view: "Pages.Setup.Locations.KhanDistricts.View",
                    edit: "Pages.Setup.Locations.KhanDistricts.Edit",
                    delete: "Pages.Setup.Locations.KhanDistricts.Delete",
                    importExcel: "Pages.Setup.Locations.KhanDistricts.ImportExcel",
                    exportExcel: "Pages.Setup.Locations.KhanDistricts.ExportExcel",
                    enable: "Pages.Setup.Locations.KhanDistricts.Enable",
                    disable: "Pages.Setup.Locations.KhanDistricts.Disable",
                },

                sangkatCommunes: {
                    page: "Pages.Setup.Locations.SangkatCommunes",
                    create: "Pages.Setup.Locations.SangkatCommunes.Create",
                    view: "Pages.Setup.Locations.SangkatCommunes.View",
                    edit: "Pages.Setup.Locations.SangkatCommunes.Edit",
                    delete: "Pages.Setup.Locations.SangkatCommunes.Delete",
                    importExcel: "Pages.Setup.Locations.SangkatCommunes.ImportExcel",
                    exportExcel: "Pages.Setup.Locations.SangkatCommunes.ExportExcel",
                    enable: "Pages.Setup.Locations.SangkatCommunes.Enable",
                    disable: "Pages.Setup.Locations.SangkatCommunes.Disable",
                },

                villages: {
                    page: "Pages.Setup.Locations.Villages",
                    create: "Pages.Setup.Locations.Villages.Create",
                    view: "Pages.Setup.Locations.Villages.View",
                    edit: "Pages.Setup.Locations.Villages.Edit",
                    delete: "Pages.Setup.Locations.Villages.Delete",
                    importExcel: "Pages.Setup.Locations.Villages.ImportExcel",
                    exportExcel: "Pages.Setup.Locations.Villages.ExportExcel",
                    enable: "Pages.Setup.Locations.Villages.Enable",
                    disable: "Pages.Setup.Locations.Villages.Disable",
                },
            },
            //#endregion

            //#region Items
            items: {
                page: "Pages.Setup.Items",
                itemGroups: {
                    page: "Pages.Setup.Items.ItemGroups",
                    create: "Pages.Setup.Items.ItemGroups.Create",
                    view: "Pages.Setup.Items.ItemGroups.View",
                    edit: "Pages.Setup.Items.ItemGroups.Edit",
                    delete: "Pages.Setup.Items.ItemGroups.Delete",
                    importExcel: "Pages.Setup.Items.ItemGroups.ImportExcel",
                    exportExcel: "Pages.Setup.Items.ItemGroups.ExportExcel",
                    enable: "Pages.Setup.Items.ItemGroups.Enable",
                    disable: "Pages.Setup.Items.ItemGroups.Disable",
                    setAsDefault: "Pages.Setup.Items.ItemGroups.SetAsDefault",
                },

                itemList: {
                    page: "Pages.Setup.Items.List",
                    create: "Pages.Setup.Items.List.Create",
                    view: "Pages.Setup.Items.List.View",
                    edit: "Pages.Setup.Items.List.Edit",
                    editAccount: "Pages.Setup.Items.List.EditAccount",
                    seeAccount: "Pages.Setup.Items.List.SeeAccount",
                    delete: "Pages.Setup.Items.List.Delete",
                    importExcel: "Pages.Setup.Items.List.ImportExcel",
                    exportExcel: "Pages.Setup.Items.List.ExportExcel",
                    enable: "Pages.Setup.Items.List.Enable",
                    disable: "Pages.Setup.Items.List.Disable",
                },

                units: {
                    page: "Pages.Setup.Units",
                    create: "Pages.Setup.Items.Units.Create",
                    view: "Pages.Setup.Items.Units.View",
                    edit: "Pages.Setup.Items.Units.Edit",
                    delete: "Pages.Setup.Items.Units.Delete",
                    importExcel: "Pages.Setup.Items.Units.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Units.ExportExcel",
                    enable: "Pages.Setup.Items.Units.Enable",
                    disable: "Pages.Setup.Items.Units.Disable",
                    setAsDefault: "Pages.Setup.Items.Units.SetAsDefault",
                },

                models: {
                    page: "Pages.Setup.Items.Models",
                    create: "Pages.Setup.Items.Models.Create",
                    view: "Pages.Setup.Items.Models.View",
                    edit: "Pages.Setup.Items.Models.Edit",
                    delete: "Pages.Setup.Items.Models.Delete",
                    importExcel: "Pages.Setup.Items.Models.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Models.ExportExcel",
                    enable: "Pages.Setup.Items.Models.Enable",
                    disable: "Pages.Setup.Items.Models.Disable",
                    setAsDefault: "Pages.Setup.Items.Models.SetAsDefault",
                },

                grades: {
                    page: "Pages.Setup.Items.Grades",
                    create: "Pages.Setup.Items.Grades.Create",
                    view: "Pages.Setup.Items.Grades.View",
                    edit: "Pages.Setup.Items.Grades.Edit",
                    delete: "Pages.Setup.Items.Grades.Delete",
                    importExcel: "Pages.Setup.Items.Grades.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Grades.ExportExcel",
                    enable: "Pages.Setup.Items.Grades.Enable",
                    disable: "Pages.Setup.Items.Grades.Disable",
                    setAsDefault: "Pages.Setup.Items.Grades.SetAsDefault",
                },

                sizes: {
                    page: "Pages.Setup.Items.Sizes",
                    create: "Pages.Setup.Items.Sizes.Create",
                    view: "Pages.Setup.Items.Sizes.View",
                    edit: "Pages.Setup.Items.Sizes.Edit",
                    delete: "Pages.Setup.Items.Sizes.Delete",
                    importExcel: "Pages.Setup.Items.Sizes.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Sizes.ExportExcel",
                    enable: "Pages.Setup.Items.Sizes.Enable",
                    disable: "Pages.Setup.Items.Sizes.Disable",
                    setAsDefault: "Pages.Setup.Items.Sizes.SetAsDefault",
                },

                colorPatterns: {
                    page: "Pages.Setup.Items.ColorPatterns",
                    create: "Pages.Setup.Items.ColorPatterns.Create",
                    view: "Pages.Setup.Items.ColorPatterns.View",
                    edit: "Pages.Setup.Items.ColorPatterns.Edit",
                    delete: "Pages.Setup.Items.ColorPatterns.Delete",
                    importExcel: "Pages.Setup.Items.ColorPatterns.ImportExcel",
                    exportExcel: "Pages.Setup.Items.ColorPatterns.ExportExcel",
                    enable: "Pages.Setup.Items.ColorPatterns.Enable",
                    disable: "Pages.Setup.Items.ColorPatterns.Disable",
                    setAsDefault: "Pages.Setup.Items.ColorPatterns.SetAsDefault",
                },

                brands: {
                    page: "Pages.Setup.Items.Brands",
                    create: "Pages.Setup.Items.Brands.Create",
                    view: "Pages.Setup.Items.Brands.View",
                    edit: "Pages.Setup.Items.Brands.Edit",
                    delete: "Pages.Setup.Items.Brands.Delete",
                    importExcel: "Pages.Setup.Items.Brands.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Brands.ExportExcel",
                    enable: "Pages.Setup.Items.Brands.Enable",
                    disable: "Pages.Setup.Items.Brands.Disable",
                    setAsDefault: "Pages.Setup.Items.Brands.SetAsDefault",
                },

                series: {
                    page: "Pages.Setup.Items.Series",
                    create: "Pages.Setup.Items.Series.Create",
                    view: "Pages.Setup.Items.Series.View",
                    edit: "Pages.Setup.Items.Series.Edit",
                    delete: "Pages.Setup.Items.Series.Delete",
                    importExcel: "Pages.Setup.Items.Series.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Series.ExportExcel",
                    enable: "Pages.Setup.Items.Series.Enable",
                    disable: "Pages.Setup.Items.Series.Disable",
                    setAsDefault: "Pages.Setup.Items.Series.SetAsDefault",
                },

                cpus: {
                    page: "Pages.Setup.Items.CPUs",
                    create: "Pages.Setup.Items.CPUs.Create",
                    view: "Pages.Setup.Items.CPUs.View",
                    edit: "Pages.Setup.Items.CPUs.Edit",
                    delete: "Pages.Setup.Items.CPUs.Delete",
                    importExcel: "Pages.Setup.Items.CPUs.ImportExcel",
                    exportExcel: "Pages.Setup.Items.CPUs.ExportExcel",
                    enable: "Pages.Setup.Items.CPUs.Enable",
                    disable: "Pages.Setup.Items.CPUs.Disable",
                    setAsDefault: "Pages.Setup.Items.CPUs.SetAsDefault",
                },

                rams: {
                    page: "Pages.Setup.Items.RAMs",
                    create: "Pages.Setup.Items.RAMs.Create",
                    view: "Pages.Setup.Items.RAMs.View",
                    edit: "Pages.Setup.Items.RAMs.Edit",
                    delete: "Pages.Setup.Items.RAMs.Delete",
                    importExcel: "Pages.Setup.Items.RAMs.ImportExcel",
                    exportExcel: "Pages.Setup.Items.RAMs.ExportExcel",
                    enable: "Pages.Setup.Items.RAMs.Enable",
                    disable: "Pages.Setup.Items.RAMs.Disable",
                    setAsDefault: "Pages.Setup.Items.RAMs.SetAsDefault",
                },

                vgas: {
                    page: "Pages.Setup.Items.VGAs",
                    create: "Pages.Setup.Items.VGAs.Create",
                    view: "Pages.Setup.Items.VGAs.View",
                    edit: "Pages.Setup.Items.VGAs.Edit",
                    delete: "Pages.Setup.Items.VGAs.Delete",
                    importExcel: "Pages.Setup.Items.VGAs.ImportExcel",
                    exportExcel: "Pages.Setup.Items.VGAs.ExportExcel",
                    enable: "Pages.Setup.Items.VGAs.Enable",
                    disable: "Pages.Setup.Items.VGAs.Disable",
                    setAsDefault: "Pages.Setup.Items.VGAs.SetAsDefault",
                },

                hdds: {
                    page: "Pages.Setup.Items.HDDs",
                    create: "Pages.Setup.Items.HDDs.Create",
                    view: "Pages.Setup.Items.HDDs.View",
                    edit: "Pages.Setup.Items.HDDs.Edit",
                    delete: "Pages.Setup.Items.HDDs.Delete",
                    importExcel: "Pages.Setup.Items.HDDs.ImportExcel",
                    exportExcel: "Pages.Setup.Items.HDDs.ExportExcel",
                    enable: "Pages.Setup.Items.HDDs.Enable",
                    disable: "Pages.Setup.Items.HDDs.Disable",
                    setAsDefault: "Pages.Setup.Items.HDDs.SetAsDefault",
                },

                screens: {
                    page: "Pages.Setup.Items.Screens",
                    create: "Pages.Setup.Items.Screens.Create",
                    view: "Pages.Setup.Items.Screens.View",
                    edit: "Pages.Setup.Items.Screens.Edit",
                    delete: "Pages.Setup.Items.Screens.Delete",
                    importExcel: "Pages.Setup.Items.Screens.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Screens.ExportExcel",
                    enable: "Pages.Setup.Items.Screens.Enable",
                    disable: "Pages.Setup.Items.Screens.Disable",
                    setAsDefault: "Pages.Setup.Items.Screens.SetAsDefault",
                },

                cameras: {
                    page: "Pages.Setup.Items.Cameras",
                    create: "Pages.Setup.Items.Cameras.Create",
                    view: "Pages.Setup.Items.Cameras.View",
                    edit: "Pages.Setup.Items.Cameras.Edit",
                    delete: "Pages.Setup.Items.Cameras.Delete",
                    importExcel: "Pages.Setup.Items.Cameras.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Cameras.ExportExcel",
                    enable: "Pages.Setup.Items.Cameras.Enable",
                    disable: "Pages.Setup.Items.Cameras.Disable",
                    setAsDefault: "Pages.Setup.Items.Cameras.SetAsDefault",
                },

                batteries: {
                    page: "Pages.Setup.Items.Batteries",
                    create: "Pages.Setup.Items.Batteries.Create",
                    view: "Pages.Setup.Items.Batteries.View",
                    edit: "Pages.Setup.Items.Batteries.Edit",
                    delete: "Pages.Setup.Items.Batteries.Delete",
                    importExcel: "Pages.Setup.Items.Batteries.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Batteries.ExportExcel",
                    enable: "Pages.Setup.Items.Batteries.Enable",
                    disable: "Pages.Setup.Items.Batteries.Disable",
                    setAsDefault: "Pages.Setup.Items.Batteries.SetAsDefault",
                },

                fieldAs: {
                    page: "Pages.Setup.Items.FieldAs",
                    create: "Pages.Setup.Items.FieldAs.Create",
                    view: "Pages.Setup.Items.FieldAs.View",
                    edit: "Pages.Setup.Items.FieldAs.Edit",
                    delete: "Pages.Setup.Items.FieldAs.Delete",
                    importExcel: "Pages.Setup.Items.FieldAs.ImportExcel",
                    exportExcel: "Pages.Setup.Items.FieldAs.ExportExcel",
                    enable: "Pages.Setup.Items.FieldAs.Enable",
                    disable: "Pages.Setup.Items.FieldAs.Disable",
                    setAsDefault: "Pages.Setup.Items.FieldAs.SetAsDefault",
                },

                fieldBs: {
                    page: "Pages.Setup.Items.FieldBs",
                    create: "Pages.Setup.Items.FieldBs.Create",
                    view: "Pages.Setup.Items.FieldBs.View",
                    edit: "Pages.Setup.Items.FieldBs.Edit",
                    delete: "Pages.Setup.Items.FieldBs.Delete",
                    importExcel: "Pages.Setup.Items.FieldBs.ImportExcel",
                    exportExcel: "Pages.Setup.Items.FieldBs.ExportExcel",
                    enable: "Pages.Setup.Items.FieldBs.Enable",
                    disable: "Pages.Setup.Items.FieldBs.Disable",
                    setAsDefault: "Pages.Setup.Items.FieldBs.SetAsDefault",
                },

                fieldCs: {
                    page: "Pages.Setup.Items.FieldCs",
                    create: "Pages.Setup.Items.FieldCs.Create",
                    view: "Pages.Setup.Items.FieldCs.View",
                    edit: "Pages.Setup.Items.FieldCs.Edit",
                    delete: "Pages.Setup.Items.FieldCs.Delete",
                    importExcel: "Pages.Setup.Items.FieldCs.ImportExcel",
                    exportExcel: "Pages.Setup.Items.FieldCs.ExportExcel",
                    enable: "Pages.Setup.Items.FieldCs.Enable",
                    disable: "Pages.Setup.Items.FieldCs.Disable",
                    setAsDefault: "Pages.Setup.Items.FieldCs.SetAsDefault",
                },

                priceList: {
                    page: "Pages.Setup.Items.PriceList",
                    create: "Pages.Setup.Items.PriceList.Create",
                    view: "Pages.Setup.Items.PriceList.View",
                    edit: "Pages.Setup.Items.PriceList.Edit",
                    delete: "Pages.Setup.Items.PriceList.Delete",
                    importExcel: "Pages.Setup.Items.PriceList.ImportExcel",
                    exportExcel: "Pages.Setup.Items.PriceList.ExportExcel",
                    enable: "Pages.Setup.Items.PriceList.Enable",
                    disable: "Pages.Setup.Items.PriceList.Disable",
                },

                promotions: {
                    page: "Pages.Setup.Items.Promotions",
                    create: "Pages.Setup.Items.Promotions.Create",
                    view: "Pages.Setup.Items.Promotions.View",
                    edit: "Pages.Setup.Items.Promotions.Edit",
                    delete: "Pages.Setup.Items.Promotions.Delete",
                    importExcel: "Pages.Setup.Items.Promotions.ImportExcel",
                    exportExcel: "Pages.Setup.Items.Promotions.ExportExcel",
                    enable: "Pages.Setup.Items.Promotions.Enable",
                    disable: "Pages.Setup.Items.Promotions.Disable",
                }
            },
            //#endregion

            //#region Payment Methods
            paymentMethods: {
                page: "Pages.Setup.PaymentMethods",
                view: "Pages.Setup.PaymentMethods.View",
                editAccount: "Pages.Setup.PaymentMethods.EditAccount",
                seeAccount: "Pages.Setup.PaymentMethods.SeeAccount",
                exportExcel: "Pages.Setup.PaymentMethods.ExportExcel",
                enable: "Pages.Setup.PaymentMethods.Enable",
                disable: "Pages.Setup.PaymentMethods.Disable",
            },
            //#endregion

            //#region Classes
            classes: {
                page: "Pages.Setup.Classes",
                create: "Pages.Setup.Classes.Create",
                view: "Pages.Setup.Classes.View",
                edit: "Pages.Setup.Classes.Edit",
                delete: "Pages.Setup.Classes.Delete",
                importExcel: "Pages.Setup.Classes.ImportExcel",
                exportExcel: "Pages.Setup.Classes.ExportExcel",
                enable: "Pages.Setup.Classes.Enable",
                disable: "Pages.Setup.Classes.Disable",
            },
            //#endregion

            //#region Warehoues
            warehouses: {
                page: "Pages.Setup.Warehouses",
                warehouseList: {
                    page: "Pages.Setup.Warehouses.List",
                    create: "Pages.Setup.Warehouses.Create",
                    view: "Pages.Setup.Warehouses.View",
                    edit: "Pages.Setup.Warehouses.Edit",
                    delete: "Pages.Setup.Warehouses.Delete",
                    importExcel: "Pages.Setup.Warehouses.ImportExcel",
                    exportExcel: "Pages.Setup.Warehouses.ExportExcel",
                    enable: "Pages.Setup.Warehouses.Enable",
                    disable: "Pages.Setup.Warehouses.Disable",
                    setAsDefault: "Pages.Setup.Warehouses.SetAsDefault",
                },
                zones: {
                    page: "Pages.Setup.Warehouses.Zones",
                    create: "Pages.Setup.Warehouses.Zones.Create",
                    view: "Pages.Setup.Warehouses.Zones.View",
                    edit: "Pages.Setup.Warehouses.Zones.Edit",
                    delete: "Pages.Setup.Warehouses.Zones.Delete",
                    importExcel: "Pages.Setup.Warehouses.Zones.ImportExcel",
                    exportExcel: "Pages.Setup.Warehouses.Zones.ExportExcel",
                    enable: "Pages.Setup.Warehouses.Zones.Enable",
                    disable: "Pages.Setup.Warehouses.Zones.Disable",
                    setAsDefault: "Pages.Setup.Warehouses.Zones.SetAsDefault",
                },
            },
            
            //#endregion

            //#region Form Templates
            formTemplates: {
                page: "Pages.Setup.FormTemplates",
                create: "Pages.Setup.FormTemplates.Create",
                view: "Pages.Setup.FormTemplates.View",
                edit: "Pages.Setup.FormTemplates.Edit",
                delete: "Pages.Setup.FormTemplates.Delete",
                enable: "Pages.Setup.FormTemplates.Enable",
                disable: "Pages.Setup.FormTemplates.Disable",
            },
            //#endregion

            taxes: {
                page: "Pages.Setup.Taxes",
                create: "Pages.Setup.Taxes.Create",
                view: "Pages.Setup.Taxes.View",
                edit: "Pages.Setup.Taxes.Edit",
                delete: "Pages.Setup.Taxes.Delete",
                importExcel: "Pages.Setup.Taxes.ImportExcel",
                exportExcel: "Pages.Setup.Taxes.ExportExcel",
                enable: "Pages.Setup.Taxes.Enable",
                disable: "Pages.Setup.Taxes.Disable",
                setAsDefault: "Pages.Setup.Taxes.SetAsDefault",
            },
        },

        //#endregion

        //#region Company
        company: {
            page: "Pages.Company",
            setting: "Pages.Company.CompanySetting",
            edit: "Pages.Company.CompanySetting.Edit",
            branches: {
                page: "Pages.Company.Branches",
                create: "Pages.Company.Branches.Create",
                view: "Pages.Company.Branches.View",
                edit: "Pages.Company.Branches.Edit",
                delete: "Pages.Company.Branches.Delete",
                enable: "Pages.Company.Branches.Enable",
                disable: "Pages.Company.Branches.Disable",
                importExcel: "Pages.Company.Branches.ImportExcel",
                exportExcel: "Pages.Company.Branches.ExportExcel",
                setAsDefault: "Pages.Company.Branches.SetAsDefault",
            },

            exchangeRates: {
                page: "Pages.Company.ExchangeRates",
                create: "Pages.Company.ExchangeRates.Create",
                view: "Pages.Company.ExchangeRates.View",
                edit: "Pages.Company.ExchangeRates.Edit",
                delete: "Pages.Company.ExchangeRates.Delete",
                exportExcel: "Pages.Company.ExchangeRates.ExportExcel",
            },
        },        

        //#endregion

        //#region Files
        files: {
            page: "Pages.Files",
            create: "Pages.Files.Create",
            view: "Pages.Files.View",
            edit: "Pages.Files.Edit",
            delete: "Pages.Files.Delete",
            exportExcel: "Pages.Files.ExportExcel",
            createFolder: "Pages.Files.CreateFolder",
            editFolder: "Pages.Files.EditFolder",
            renameFolder: "Pages.Files.RenameFolder",
            deleteFolder: "Pages.Files.DeleteFolder",
            changeFolder: "Pages.Files.ChangeFolder",
        },
        //#endregion

        //#region POS
        pos: {
            page: "Pages.POSs",
            tables: {
                page: "Pages.POSs.Tables",
                create: "Pages.POSs.Tables.Create",
                view: "Pages.POSs.Tables.View",
                edit: "Pages.POSs.Tables.Edit",
                delete: "Pages.POSs.Tables.Delete",
                exportExcel: "Pages.POSs.Tables.ExportExcel",
                importExcel: "Pages.POSs.Tables.ImportExcel",
                enable: "Pages.POSs.Tables.Enable",
                disable: "Pages.POSs.Tables.Disable",
            },

            tableGroups: {
                page: "Pages.POSs.Tables.Groups",
                create: "Pages.POSs.Tables.Groups.Create",
                view: "Pages.POSs.Tables.Groups.View",
                edit: "Pages.POSs.Tables.Groups.Edit",
                delete: "Pages.POSs.Tables.Groups.Delete",
                exportExcel: "Pages.POSs.Tables.Groups.ExportExcel",
                importExcel: "Pages.POSs.Tables.Groups.ImportExcel",
                enable: "Pages.POSs.Tables.Groups.Enable",
                disable: "Pages.POSs.Tables.Groups.Disable",
            },

            rooms: {
                page: "Pages.POSs.Rooms",
                create: "Pages.POSs.Rooms.Create",
                view: "Pages.POSs.Rooms.View",
                edit: "Pages.POSs.Rooms.Edit",
                delete: "Pages.POSs.Rooms.Delete",
                exportExcel: "Pages.POSs.Rooms.ExportExcel",
                importExcel: "Pages.POSs.Rooms.ImportExcel",
                enable: "Pages.POSs.Rooms.Enable",
                disable: "Pages.POSs.Rooms.Disable",
                split: "Pages.POSs.Rooms.Split",
                merge: "Pages.POSs.Rooms.Merge",
            },

            roomGroups: {
                page: "Pages.POSs.Rooms.Groups",
                create: "Pages.POSs.Rooms.Groups.Create",
                view: "Pages.POSs.Rooms.Groups.View",
                edit: "Pages.POSs.Rooms.Groups.Edit",
                delete: "Pages.POSs.Rooms.Groups.Delete",
                exportExcel: "Pages.POSs.Rooms.Groups.ExportExcel",
                importExcel: "Pages.POSs.Rooms.Groups.ImportExcel",
                enable: "Pages.POSs.Rooms.Groups.Enable",
                disable: "Pages.POSs.Rooms.Groups.Disable",
            },

            counters: {
                page: "Pages.POSs.Counters",
                create: "Pages.POSs.Counters.Create",
                view: "Pages.POSs.Counters.View",
                edit: "Pages.POSs.Counters.Edit",
                delete: "Pages.POSs.Counters.Delete",
                exportExcel: "Pages.POSs.Counters.ExportExcel",
                importExcel: "Pages.POSs.Counters.ImportExcel",
                enable: "Pages.POSs.Counters.Enable",
                disable: "Pages.POSs.Counters.Disable",
            },

            membersCards: {
                page: "Pages.POSs.MembersCards",
                create: "Pages.POSs.MembersCards.Create",
                view: "Pages.POSs.MembersCards.View",
                edit: "Pages.POSs.MembersCards.Edit",
                delete: "Pages.POSs.MembersCards.Delete",
                exportExcel: "Pages.POSs.MembersCards.ExportExcel",
                importExcel: "Pages.POSs.MembersCards.ImportExcel",
                enable: "Pages.POSs.MembersCards.Enable",
                disable: "Pages.POSs.MembersCards.Disable",
            },

            saleOrders: {
                page: "Pages.POSs.SaleOrders",
                create: "Pages.POSs.SaleOrders.Create",
                convertToInvoice: "Pages.POSs.SaleOrders.ConvertToInvoice",
                view: "Pages.POSs.SaleOrders.View",
                edit: "Pages.POSs.SaleOrders.Edit",
                delete: "Pages.POSs.SaleOrders.Delete",
                exportExcel: "Pages.POSs.SaleOrders.ExportExcel",
                print: "Pages.POSs.SaleOrders.Print",
                void: "Pages.POSs.SaleOrders.Void",
                over24Modify: "Pages.POSs.SaleOrders.Over24Modify",
                reorder: "Pages.POSs.SaleOrders.Reorder",
            },

            invoices: {
                page: "Pages.POSs.Invoices",
                create: "Pages.POSs.Invoices.Create",
                fromSaleOrder: "Pages.POSs.Invoices.Create.FromSaleOrder",
                view: "Pages.POSs.Invoices.View",
                edit: "Pages.POSs.Invoices.Edit",
                delete: "Pages.POSs.Invoices.Delete",
                exportExcel: "Pages.POSs.Invoices.ExportExcel",
                print: "Pages.POSs.Invoices.Print",
                void: "Pages.POSs.Invoices.Void",
                creditSale: "Pages.POSs.Invoices.CreditSale",
                over24Modify: "Pages.POSs.Invoices.Over24Modify",
            },

            saleReturns: {
                page: "Pages.POSs.SaleReturns",
                create: "Pages.POSs.SaleReturns.Create",
                view: "Pages.POSs.SaleReturns.View",
                edit: "Pages.POSs.SaleReturns.Edit",
                delete: "Pages.POSs.SaleReturns.Delete",
                exportExcel: "Pages.POSs.SaleReturns.ExportExcel",
                void: "Pages.POSs.SaleReturns.Void",
                refund: "Pages.POSs.SaleReturns.Refund",
                over24Modify: "Pages.POSs.SaleReturns.Over24Modify",
            },
        },
        //#endregion

        //#region Vendors
        vendors: {
            page: "Pages.Vendors",
            vendorGroups: {
                page: "Pages.Vendors.VendorGroups",
                create: "Pages.Vendors.VendorGroups.Create",
                view: "Pages.Vendors.VendorGroups.View",
                edit: "Pages.Vendors.VendorGroups.Edit",
                delete: "Pages.Vendors.VendorGroups.Delete",
                exportExcel: "Pages.Vendors.VendorGroups.ExportExcel",
                importExcel: "Pages.Vendors.VendorGroups.ImportExcel",
                enable: "Pages.Vendors.VendorGroups.Enable",
                disable: "Pages.Vendors.VendorGroups.Disable",
            },

            vendorList: {
                page: "Pages.Vendors.List",
                create: "Pages.Vendors.List.Create",
                view: "Pages.Vendors.List.View",
                edit: "Pages.Vendors.List.Edit",
                editAccount: "Pages.Vendors.List.EditAccount",
                seeAccount: "Pages.Vendors.List.SeeAccount",
                delete: "Pages.Vendors.List.Delete",
                exportExcel: "Pages.Vendors.List.ExportExcel",
                importExcel: "Pages.Vendors.List.ImportExcel",
                enable: "Pages.Vendors.List.Enable",
                disable: "Pages.Vendors.List.Disable",
            },

            purchaseTypes: {
                page: "Pages.Vendors.PurchaseTypes",
                create: "Pages.Vendors.PurchaseTypes.Create",
                view: "Pages.Vendors.PurchaseTypes.View",
                edit: "Pages.Vendors.PurchaseTypes.Edit",
                delete: "Pages.Vendors.PurchaseTypes.Delete",
                importExcel: "Pages.Vendors.PurchaseTypes.ImportExcel",
                exportExcel: "Pages.Vendors.PurchaseTypes.ExportExcel",
                enable: "Pages.Vendors.PurchaseTypes.Enable",
                disable: "Pages.Vendors.PurchaseTypes.Disable",
            },

            purchaseOrders: {
                page: "Pages.Vendors.PurchaseOrders",
                create: "Pages.Vendors.PurchaseOrders.Create",
                convertToBill: "Pages.Vendors.PurchaseOrders.ConvertToBill",
                view: "Pages.Vendors.PurchaseOrders.View",
                edit: "Pages.Vendors.PurchaseOrders.Edit",
                delete: "Pages.Vendors.PurchaseOrders.Delete",
                exportExcel: "Pages.Vendors.PurchaseOrders.ExportExcel",
                print: "Pages.Vendors.PurchaseOrders.Print",
                void: "Pages.Vendors.PurchaseOrders.Void",
                over24Modify: "Pages.Vendors.PurchaseOrders.Over24Modify",
                reorder: "Pages.Vendors.PurchaseOrders.Reorder",
            },

            bills: {
                page: "Pages.Vendors.Bills",
                createExpenseBill: "Pages.Vendors.Bills.CreateAccountBill",
                createPurchaseBill: {
                    fromNone: "Pages.Vendors.Bills.CreatePurchaseBill",
                    fromPurchaseOrder: "Pages.Vendors.Bills.CreatePurchaseBill.FromPurchaseOrder",
                    fromInventoryPurchase: "Pages.Vendors.Bills.CreatePurchaseBill.FromInventoryPurchase",
                    fromInventoryPurchaseEditQty: "Pages.Vendors.Bills.CreatePurchaseBill.FromInventoryPurchase.EditQty",
                },
                createPurchaseReturn: {
                    fromNone: "Pages.Vendors.Bills.CreatePurchaseReturn",
                    fromInventoryPurchase: "Pages.Vendors.Bills.CreatePurchaseReturn.FromInventoryPurchase",
                    fromInventoryPurchaseReturn: "Pages.Vendors.Bills.CreatePurchaseReturn.FromInventoryPurchaseReturn",
                    fromInventoryPurchaseReturnEditQty: "Pages.Vendors.Bills.CreatePurchaseReturn.FromInventoryPurchaseReturn.EditQty",
                },
                createAdvancePayment: "Pages.Vendors.Bills.CreateAdvancePayment",
                createDebitNote: "Pages.Vendors.Bills.CreateDebitNote",
                view: "Pages.Vendors.Bills.View",
                edit: "Pages.Vendors.Bills.Edit",
                ditAccount: "Pages.Vendors.Bills.EditAccount",
                seeAccount: "Pages.Vendors.Bills.SeeAccount",
                delete: "Pages.Vendors.Bills.Delete",
                exportExcel: "Pages.Vendors.Bills.ExportExcel",
                payBill: "Pages.Vendors.Bills.PayBill",
                paymentHistory: "Pages.Vendors.Bills.PaymentHistory",
                void: "Pages.Vendors.Bills.Void",
                over24Modify: "Pages.Vendors.Bills.Over24Modify",
            },

            billPayments: {
                page: "Pages.Vendors.BillPayments",
                create: "Pages.Vendors.BillPayments.Create",
                view: "Pages.Vendors.BillPayments.View",
                edit: "Pages.Vendors.BillPayments.Edit",
                editAccount: "Pages.Vendors.BillPayments.EditAccount",
                seeAccount: "Pages.Vendors.BillPayments.SeeAccount",
                delete: "Pages.Vendors.BillPayments.Delete",
                exportExcel: "Pages.Vendors.BillPayments.ExportExcel",
                print: "Pages.Vendors.BillPayments.Print",
                void: "Pages.Vendors.BillPayments.Void",
                over24Modify: "Pages.Vendors.BillPayments.Over24Modify",
            }
        },
        //#endregion

        //#region Customers
        customers: {
            page: "Pages.Customers",
            customerGroups: {
                page: "Pages.CustomerGroups",
                create: "Pages.CustomerGroups.Create",
                view: "Pages.CustomerGroups.View",
                edit: "Pages.CustomerGroups.Edit",
                delete: "Pages.CustomerGroups.Delete",
                exportExcel: "Pages.CustomerGroups.ExportExcel",
                importExcel: "Pages.CustomerGroups.ImportExcel",
                enable: "Pages.Customers.CustomerGroups.Enable",
                disable: "Pages.Customers.CustomerGroups.Disable",
            },

            customerList: {
                page: "Pages.Customers.List",
                create: "Pages.Customers.List.Create",
                view: "Pages.Customers.List.View",
                edit: "Pages.Customers.List.Edit",
                editAccount: "Pages.Customers.List.EditAccount",
                seeAccount: "Pages.Customers.List.SeeAccount",
                delete: "Pages.Customers.List.Delete",
                exportExcel: "Pages.Customers.List.ExportExcel",
                importExcel: "Pages.Customers.List.ImportExcel",
                enable: "Pages.Customers.List.Enable",
                disable: "Pages.Customers.List.Disable",
            },

            saleTypes: {
                page: "Pages.Customers.SaleTypes",
                create: "Pages.Customers.SaleTypes.Create",
                view: "Pages.Customers.SaleTypes.View",
                edit: "Pages.Customers.SaleTypes.Edit",
                delete: "Pages.Customers.SaleTypes.Delete",
                importExcel: "Pages.Customers.SaleTypes.ImportExcel",
                exportExcel: "Pages.Customers.SaleTypes.ExportExcel",
                enable: "Pages.Customers.SaleTypes.Enable",
                disable: "Pages.Customers.SaleTypes.Disable",
            },

            quotations: {
                page: "Pages.Customers.Quotations",
                create: "Pages.Customers.Quotations.Create",
                convertToContract: "Pages.Customers.Quotations.ConvertToContract",
                convertToInvoice: "Pages.Customers.Quotations.ConvertToInvoice",
                view: "Pages.Customers.Quotations.View",
                edit: "Pages.Customers.Quotations.Edit",
                delete: "Pages.Customers.Quotations.Delete",
                exportExcel: "Pages.Customers.Quotations.ExportExcel",
                print: "Pages.Customers.Quotations.Print",
                void: "Pages.Customers.Quotations.Void",
                over24Modify: "Pages.Customers.Quotations.Over24Modify",
            },

            contracts: {
                page: "Pages.Customers.Contracts",
                create: {
                    fromNone: "Pages.Customers.Contracts.Create",
                    fromQuotation: "Pages.Customers.Contracts.Create.FromQuotation",
                },
                convertToInvoice: "Pages.Customers.Contracts.ConvertToInvoice",
                view: "Pages.Customers.Contracts.View",
                edit: "Pages.Customers.Contracts.Edit",
                delete: "Pages.Customers.Contracts.Delete",
                exportExcel: "Pages.Customers.Contracts.ExportExcel",
                print: "Pages.Customers.Contracts.Print",
                void: "Pages.Customers.Contracts.Void",
                renew: "Pages.Customers.Contracts.Renew",
                enable: "Pages.Customers.Contracts.Enable",
                disable: "Pages.Customers.Contracts.Disable",
                over24Modify: "Pages.Customers.Contracts.Over24Modify",
            },

            contractsAlerts: {
                page: "Pages.Customers.Contracts.Alerts",
                create: "Pages.Customers.Contracts.Alerts.Create",
                view: "Pages.Customers.Contracts.Alerts.View",
                edit: "Pages.Customers.Contracts.Alerts.Edit",
                delete: "Pages.Customers.Contracts.Alerts.Delete",
                exportExcel: "Pages.Customers.Contracts.Alerts.ExportExcel",
                enable: "Pages.Customers.Contracts.Alerts.Enable",
                disable: "Pages.Customers.Contracts.Alerts.Disable",
            },

            saleOrders: {
                page: "Pages.Customers.SaleOrders",
                create: "Pages.Customers.SaleOrders.Create",
                convertToInvoice: "Pages.Customers.SaleOrders.ConvertToInvoice",
                view: "Pages.Customers.SaleOrders.View",
                edit: "Pages.Customers.SaleOrders.Edit",
                delete: "Pages.Customers.SaleOrders.Delete",
                exportExcel: "Pages.Customers.SaleOrders.ExportExcel",
                print: "Pages.Customers.SaleOrders.Print",
                void: "Pages.Customers.SaleOrders.Void",
                reorder: "Pages.Customers.SaleOrders.Reorder",
                over24Modify: "Pages.Customers.SaleOrders.Over24Modify",
            },

            invoices: {
                page: "Pages.Customers.Invoices",
                createAccountInvoice: "Pages.Customers.Invoices.CreateAccountInvoice",
                createInvoice: {
                    fromNone: "Pages.Customers.Invoices.CreateInvoice",
                    fromQuotation: "Pages.Customers.Invoices.CreateInvoice.FromQuotation",
                    fromContract: "Pages.Customers.Invoices.CreateInvoice.FromContract",
                    fromSaleOrder: "Pages.Customers.Invoices.CreateInvoice.FromSaleOrder",
                    fromInventorySale: "Pages.Customers.Invoices.CreateInvoice.FromInventorySale",
                    fromInventorySaleEditQty: "Pages.Customers.Invoices.CreateInvoice.FromInventorySale.EditQty",
                },
                createSaleReturn: {
                    fromNone: "Pages.Customers.Invoices.CreateSaleReturn",
                    fromInventorySale: "Pages.Customers.Invoices.CreateSaleReturn.FromInventorySale",
                    fromInventorySaleReturn: "Pages.Customers.Invoices.CreateSaleReturn.FromInventorySaleReturn",
                    fromInventorySaleReturnEditQty: "Pages.Customers.Invoices.CreateSaleReturn.FromInventorySaleReturn.EditQty",
                },
                createCustomerDeposit: "Pages.Customers.Invoices.CreateCustomerDeposit",
                createCreditNote: "Pages.Customers.Invoices.CreateCreditNote",
                view: "Pages.Customers.Invoices.View",
                edit: "Pages.Customers.Invoices.Edit",
                editAccount: "Pages.Customers.Invoices.EditAccount",
                seeAccount: "Pages.Customers.Invoices.SeeAccount",
                delete: "Pages.Customers.Invoices.Delete",
                exportExcel: "Pages.Customers.Invoices.ExportExcel",
                print: "Pages.Customers.Invoices.Print",
                payment: "Pages.Customers.Invoices.Payment",
                paymentHistory: "Pages.Customers.Invoices.PaymentHistory",
                void: "Pages.Customers.Invoices.Void",
                over24Modify: "Pages.Customers.Invoices.Over24Modify",
            },

            receivePayments: {
                page: "Pages.Customers.ReceivePayments",
                create: "Pages.Customers.ReceivePayments.Create",
                view: "Pages.Customers.ReceivePayments.View",
                edit: "Pages.Customers.ReceivePayments.Edit",
                editAccount: "Pages.Customers.ReceivePayments.EditAccount",
                seeAccount: "Pages.Customers.ReceivePayments.SeeAccount",
                delete: "Pages.Customers.ReceivePayments.Delete",
                exportExcel: "Pages.Customers.ReceivePayments.ExportExcel",
                print: "Pages.Customers.ReceivePayments.Print",
                void: "Pages.Customers.ReceivePayments.Void",
                over24Modify: "Pages.Customers.ReceivePayments.Over24Modify",
            },
        },

        //#endregion

        //#region Sale Representative
        saleRepresentatives: {
            page: "Pages.SaleRepresentatives",
            create: "Pages.SaleRepresentatives.Create",
            view: "Pages.SaleRepresentatives.View",
            edit: "Pages.SaleRepresentatives.Edit",
            delete: "Pages.SaleRepresentatives.Delete",
            exportExcel: "Pages.SaleRepresentatives.ExportExcel",
            importExcel: "Pages.SaleRepresentatives.ImportExcel",
            enable: "Pages.SaleRepresentatives.Enable",
            disable: "Pages.SaleRepresentatives.Disable",
        },

        saleCommissions: {
            page: "Pages.SaleCommissions",
            create: "Pages.SaleCommissions.Create",
            view: "Pages.SaleCommissions.View",
            edit: "Pages.SaleCommissions.Edit",
            delete: "Pages.SaleCommissions.Delete",
            exportExcel: "Pages.SaleCommissions.ExportExcel",
            enable: "Pages.SaleCommissions.Enable",
            disable: "Pages.SaleCommissions.Disable",
        },
        //#endregion

        //#region Employees
        employees: {
            page: "Pages.Employees",
            //#region Employee Info
            employeesList: {
                page: "Pages.Employees.List",
                create: "Pages.Employees.List.Create",
                view: "Pages.Employees.List.View",
                edit: "Pages.Employees.List.Edit",
                editAccount: "Pages.Employees.List.EditAccount",
                seeAccount: "Pages.Employees.List.SeeAccount",
                delete: "Pages.Employees.List.Delete",
                exportExcel: "Pages.Employees.List.ExportExcel",
                importExcel: "Pages.Employees.List.ImportExcel",
                enable: "Pages.Employees.List.Enable",
                disable: "Pages.Employees.List.Disable",
            },

            positions: {
                page: "Pages.Employees.Positions",
                create: "Pages.Employees.Positions.Create",
                view: "Pages.Employees.Positions.View",
                edit: "Pages.Employees.Positions.Edit",
                delete: "Pages.Employees.Positions.Delete",
                exportExcel: "Pages.Employees.Positions.ExportExcel",
                importExcel: "Pages.Employees.Positions.ImportExcel",
                enable: "Pages.Employees.Positions.Enable",
                disable: "Pages.Employees.Positions.Disable",
            },
            //#endregion

        },
        //#endregion

        //#region Accounting
        accounting: {
            page: "Pages.Accounting",
            
            chartOfAccounts: {
                page: "Pages.Accounting.ChartOfAccounts",
                create: "Pages.Accounting.ChartOfAccounts.Create",
                view: "Pages.Accounting.ChartOfAccounts.View",
                edit: "Pages.Accounting.ChartOfAccounts.Edit",
                delete: "Pages.Accounting.ChartOfAccounts.Delete",
                exportExcel: "Pages.Accounting.ChartOfAccounts.ExportExcel",
                importExcel: "Pages.Accounting.ChartOfAccounts.ImportExcel",
                enable: "Pages.Accounting.ChartOfAccounts.Enable",
                disable: "Pages.Accounting.ChartOfAccounts.Disable",
            },

            journals: {
                page: "Pages.Accounting.Journals",
                create: "Pages.Accounting.Journals.Create",
                view: "Pages.Accounting.Journals.View",
                edit: "Pages.Accounting.Journals.Edit",
                delete: "Pages.Accounting.Journals.Delete",
                exportExcel: "Pages.Accounting.Journals.ExportExcel",
                print: "Pages.Accounting.Journals.Print",
                void: "Pages.Accounting.Journals.Void",
                over24Modify: "Pages.Accounting.Journals.Over24Modify",
            },

            //#region Banks
            banks: {
                page: "Pages.Accounting.Banks",
                createDeposit: "Pages.Accounting.Banks.CreateDeposit",
                createWithdraw: "Pages.Accounting.Banks.CreateWithdraw",
                createTransfer: "Pages.Accounting.Banks.CreateTransfer",
                view: "Pages.Accounting.Banks.View",
                edit: "Pages.Accounting.Banks.Edit",
                delete: "Pages.Accounting.Banks.Delete",
                exportExcel: "Pages.Accounting.Banks.ExportExcel",
                void: "Pages.Accounting.Banks.Void",
                over24Modify: "Pages.Accounting.Banks.Over24Modify",
            },
            //#endregion
        },
        //#endregion

        //#region Loans
        loans: {
            page: "Pages.Loans",
            collaterals: {
                page: "Pages.Loans.Collaterals",
                create: "Pages.Loans.Collaterals.Create",
                view: "Pages.Loans.Collaterals.View",
                edit: "Pages.Loans.Collaterals.Edit",
                delete: "Pages.Loans.Collaterals.Delete",
                exportExcel: "Pages.Loans.Collaterals.ExportExcel",
                importExcel: "Pages.Loans.Collaterals.ImportExcel",
                enable: "Pages.Loans.Collaterals.Enable",
                disable: "Pages.Loans.Collaterals.Disable",
            },

            interestRates: {
                page: "Pages.Loans.InterestRates",
                create: "Pages.Loans.InterestRates.Create",
                view: "Pages.Loans.InterestRates.View",
                edit: "Pages.Loans.InterestRates.Edit",
                delete: "Pages.Loans.InterestRates.Delete",
                exportExcel: "Pages.Loans.InterestRates.ExportExcel",
                importExcel: "Pages.Loans.InterestRates.ImportExcel",
                enable: "Pages.Loans.InterestRates.Enable",
                disable: "Pages.Loans.InterestRates.Disable",
            },

            penalties: {
                page: "Pages.Loans.Penalties",
                create: "Pages.Loans.Penalties.Create",
                view: "Pages.Loans.Penalties.View",
                edit: "Pages.Loans.Penalties.Edit",
                delete: "Pages.Loans.Penalties.Delete",
                exportExcel: "Pages.Loans.Penalties.ExportExcel",
                importExcel: "Pages.Loans.Penalties.ImportExcel",
                enable: "Pages.Loans.Penalties.Enable",
                disable: "Pages.Loans.Penalties.Disable",
            },

            penaltiesAlerts: {
                page: "Pages.Loans.Penalties.Alerts",
                create: "Pages.Loans.Penalties.Alerts.Create",
                view: "Pages.Loans.Penalties.Alerts.View",
                edit: "Pages.Loans.Penalties.Alerts.Edit",
                delete: "Pages.Loans.Penalties.Alerts.Delete",
                exportExcel: "Pages.Loans.Penalties.Alerts.ExportExcel",
                importExcel: "Pages.Loans.Penalties.Alerts.ImportExcel",
                enable: "Pages.Loans.Penalties.Alerts.Enable",
                disable: "Pages.Loans.Penalties.Alerts.Disable",
            },

            contracts: {
                page: "Pages.Loans.Contracts",
                create: "Pages.Loans.Contracts.Create",
                convertToLoan: "Pages.Loans.Contracts.ConvertToLoan",
                view: "Pages.Loans.Contracts.View",
                edit: "Pages.Loans.Contracts.Edit",
                delete: "Pages.Loans.Contracts.Delete",
                exportExcel: "Pages.Loans.Contracts.ExportExcel",
                void: "Pages.Loans.Contracts.Void",
                enable: "Pages.Loans.Contracts.Enable",
                disable: "Pages.Loans.Contracts.Disable",
                renew: "Pages.Loans.Contracts.Renew",
            },

            loansList: {
                page: "Pages.Loans.List",
                create: {
                    fromNone: "Pages.Loans.List.Create",
                    fromContract: "Pages.Loans.List.Create.FromContract",
                },
                view: "Pages.Loans.List.View",
                edit: "Pages.Loans.List.Edit",
                editAccount: "Pages.Loans.List.EditAccount",
                seeAccount: "Pages.Loans.List.SeeAccount",
                delete: "Pages.Loans.List.Delete",
                exportExcel: "Pages.Loans.List.ExportExcel",
                print: "Pages.Loans.List.Print",
                void: "Pages.Loans.List.Void",
                over24Modify: "Pages.Loans.List.Over24Modify",
            },

            payments: {
                page: "Pages.Loans.Payments",
                create: "Pages.Loans.Payments.Create",
                view: "Pages.Loans.Payments.View",
                edit: "Pages.Loans.Payments.Edit",
                editAccount: "Pages.Loans.Payments.EditAccount",
                seeAccount: "Pages.Loans.Payments.SeeAccount",
                delete: "Pages.Loans.Payments.Delete",
                exportExcel: "Pages.Loans.Payments.ExportExcel",
                print: "Pages.Loans.Payments.Print",
                void: "Pages.Loans.Payments.Void",
                over24Modify: "Pages.Loans.Payments.Over24Modify",
            },
        },
        //#endregion

        //#region Inventories
        inventories: {
            page: "Pages.Inventories",
            editAccount: "Pages.Inventories.EditAccount",
            seeAccount: "Pages.Inventories.SeeAccount",
            editPrice: "Pages.Inventories.EditPrice",
            seePrice: "Pages.Inventories.SeePrice",
            exportExcel: "Pages.Inventories.ExportExcel",

            //#region Item Receives
            receipts: {
                page: "Pages.Inventories.Receipts",
                purchases: {
                    page: "Pages.Inventories.Receipts.Purchases",
                    create: "Pages.Inventories.Receipts.Purchases.Create",
                    view: "Pages.Inventories.Receipts.Purchases.View",
                    edit: "Pages.Inventories.Receipts.Purchases.Edit",
                    delete: "Pages.Inventories.Receipts.Purchases.Delete",
                    void: "Pages.Inventories.Receipts.Purchases.Void",
                    over24Modify: "Pages.Inventories.Receipts.Purchases.Over24Modify",
                },

                transfers: {
                    page: "Pages.Inventories.Receipts.Transfers",
                    create: "Pages.Inventories.Receipts.Transfers.Create",
                    view: "Pages.Inventories.Receipts.Transfers.View",
                    edit: "Pages.Inventories.Receipts.Transfers.Edit",
                    delete: "Pages.Inventories.Receipts.Transfers.Delete",
                    void: "Pages.Inventories.Receipts.Transfers.Void",
                    over24Modify: "Pages.Inventories.Receipts.Transfers.Over24Modify",
                },

                saleReturns: {
                    page: "Pages.Inventories.Receipts.SaleReturns",
                    create: "Pages.Inventories.Receipts.SaleReturns.Create",
                    view: "Pages.Inventories.Receipts.SaleReturns.View",
                    edit: "Pages.Inventories.Receipts.SaleReturns.Edit",
                    delete: "Pages.Inventories.Receipts.SaleReturns.Delete",
                    void: "Pages.Inventories.Receipts.SaleReturns.Void",
                    over24Modify: "Pages.Inventories.Receipts.SaleReturns.Over24Modify",
                },

                lendReturns: {
                    page: "Pages.Inventories.Receipts.LendReturns",
                    create: "Pages.Inventories.Receipts.LendReturns.Create",
                    view: "Pages.Inventories.Receipts.LendReturns.View",
                    edit: "Pages.Inventories.Receipts.LendReturns.Edit",
                    delete: "Pages.Inventories.Receipts.LendReturns.Delete",
                    void: "Pages.Inventories.Receipts.LendReturns.Void",
                    over24Modify: "Pages.Inventories.Receipts.LendReturns.Over24Modify",
                },

                adjustments: {
                    page: "Pages.Inventories.Receipts.Adjustments",
                    create: "Pages.Inventories.Receipts.Adjustments.Create",
                    view: "Pages.Inventories.Receipts.Adjustments.View",
                    edit: "Pages.Inventories.Receipts.Adjustments.Edit",
                    delete: "Pages.Inventories.Receipts.Adjustments.Delete",
                    void: "Pages.Inventories.Receipts.Adjustments.Void",
                    over24Modify: "Pages.Inventories.Receipts.Adjustments.Over24Modify",
                },

                others: {
                    page: "Pages.Inventories.Receipts.Others",
                    create: "Pages.Inventories.Receipts.Others.Create",
                    view: "Pages.Inventories.Receipts.Others.View",
                    edit: "Pages.Inventories.Receipts.Others.Edit",
                    delete: "Pages.Inventories.Receipts.Others.Delete",
                    void: "Pages.Inventories.Receipts.Others.Void",
                    importExcel: "Pages.Inventories.Receipts.Others.ImportExcel",
                    over24Modify: "Pages.Inventories.Receipts.Others.Over24Modify",
                },
            },
            //#endregion

            //#region Item Issues
            issues: {
                page: "Pages.Inventories.Issues",
                sales: {
                    page: "Pages.Inventories.Issues.Sales",
                    create: "Pages.Inventories.Issues.Sales.Create",
                    view: "Pages.Inventories.Issues.Sales.View",
                    edit: "Pages.Inventories.Issues.Sales.Edit",
                    delete: "Pages.Inventories.Issues.Sales.Delete",
                    void: "Pages.Inventories.Issues.Sales.Void",
                    over24Modify: "Pages.Inventories.Issues.Sales.Over24Modify",
                },

                transfers: {
                    page: "Pages.Inventories.Issues.Transfers",
                    create: "Pages.Inventories.Issues.Transfers.Create",
                    view: "Pages.Inventories.Issues.Transfers.View",
                    edit: "Pages.Inventories.Issues.Transfers.Edit",
                    delete: "Pages.Inventories.Issues.Transfers.Delete",
                    void: "Pages.Inventories.Issues.Transfers.Void",
                    over24Modify: "Pages.Inventories.Issues.Transfers.Over24Modify",
                },

                purchaseReturns: {
                    page: "Pages.Inventories.Issues.PurchaseReturns",
                    create: "Pages.Inventories.Issues.PurchaseReturns.Create",
                    view: "Pages.Inventories.Issues.PurchaseReturns.View",
                    edit: "Pages.Inventories.Issues.PurchaseReturns.Edit",
                    delete: "Pages.Inventories.Issues.PurchaseReturns.Delete",
                    void: "Pages.Inventories.Issues.PurchaseReturns.Void",
                    over24Modify: "Pages.Inventories.Issues.PurchaseReturns.Over24Modify",
                },

                lends: {
                    page: "Pages.Inventories.Issues.Lends",
                    create: "Pages.Inventories.Issues.Lends.Create",
                    view: "Pages.Inventories.Issues.Lends.View",
                    edit: "Pages.Inventories.Issues.Lends.Edit",
                    delete: "Pages.Inventories.Issues.Lends.Delete",
                    void: "Pages.Inventories.Issues.Lends.Void",
                    over24Modify: "Pages.Inventories.Issues.Lends.Over24Modify",
                },

                adjustments: {
                    page: "Pages.Inventories.Issues.Adjustments",
                    create: "Pages.Inventories.Issues.Adjustments.Create",
                    view: "Pages.Inventories.Issues.Adjustments.View",
                    edit: "Pages.Inventories.Issues.Adjustments.Edit",
                    delete: "Pages.Inventories.Issues.Adjustments.Delete",
                    void: "Pages.Inventories.Issues.Adjustments.Void",
                    over24Modify: "Pages.Inventories.Issues.Adjustments.Over24Modify",
                },

                others: {
                    page: "Pages.Inventories.Issues.Others",
                    create: "Pages.Inventories.Issues.Others.Create",
                    view: "Pages.Inventories.Issues.Others.View",
                    edit: "Pages.Inventories.Issues.Others.Edit",
                    delete: "Pages.Inventories.Issues.Others.Delete",
                    void: "Pages.Inventories.Issues.Others.Void",
                    over24Modify: "Pages.Inventories.Issues.Others.Over24Modify",
                }
            },
            //#endregion

            //#region Transfers
            transfers: {
                page: "Pages.Inventories.Transfers",
                create: "Pages.Inventories.Transfers.Create",
                view: "Pages.Inventories.Transfers.View",
                edit: "Pages.Inventories.Transfers.Edit",
                delete: "Pages.Inventories.Transfers.Delete",
                void: "Pages.Inventories.Transfers.Void",
                over24Modify: "Pages.Inventories.Transfers.Over24Modify",
            },
            //#endregion

            //#region Exchanges
            exchanges: {
                page: "Pages.Inventories.Exchanges",
                create: "Pages.Inventories.Exchanges.Create",
                view: "Pages.Inventories.Exchanges.View",
                edit: "Pages.Inventories.Exchanges.Edit",
                delete: "Pages.Inventories.Exchanges.Delete",
                void: "Pages.Inventories.Exchanges.Void",
                over24Modify: "Pages.Inventories.Exchanges.Over24Modify",
            },
            //#endregion

            //#region Productions
            productions: {
                page: "Pages.Inventories.Productions",
                create: "Pages.Inventories.Productions.Create",
                view: "Pages.Inventories.Productions.View",
                edit: "Pages.Inventories.Productions.Edit",
                delete: "Pages.Inventories.Productions.Delete",
                void: "Pages.Inventories.Productions.Void",
                over24Modify: "Pages.Inventories.Productions.Over24Modify",
            },

            productionsProcesses: {
                page: "Pages.Inventories.Productions.Processes",
                create: "Pages.Inventories.Productions.Processes.Create",
                view: "Pages.Inventories.Productions.Processes.View",
                edit: "Pages.Inventories.Productions.Processes.Edit",
                delete: "Pages.Inventories.Productions.Processes.Delete",
                enable: "Pages.Inventories.Productions.Processes.Enable",
                disable: "Pages.Inventories.Productions.Processes.Disable",
            },
            //#endregion
        },
        //#endregion

        //#region Reports
        reports: {
            page: "Pages.Reports",
            see: "Pages.Reports_See",
            modifyAllTemplates: "Pages.Reports.ModifyAllTemplates",
            //#region Reports Vendors
            vendors: {
                page: "Pages.Reports.Vendors",
                purchaseBills: {
                    page: "Pages.Reports.Vendors.PurchaseBills",
                    view: "Pages.Reports.Vendors.PurchaseBills.View",
                    exportExcel: "Pages.Reports.Vendors.PurchaseBills.ExportExcel",
                    print: "Pages.Reports.Vendors.PurchaseBills.Print",
                    create: "Pages.Reports.Vendors.PurchaseBills.CreateTemplate",
                    modify: "Pages.Reports.Vendors.PurchaseBills.ModifyTemplate",
                },

                purchaseBillDetail: {
                    page: "Pages.Reports.Vendors.PurchaseBillDetail",
                    view: "Pages.Reports.Vendors.PurchaseBillDetail.View",
                    exportExcel: "Pages.Reports.Vendors.PurchaseBillDetail.ExportExcel",
                    print: "Pages.Reports.Vendors.PurchaseBillDetail.Print",
                    create: "Pages.Reports.Vendors.PurchaseBillDetail.CreateTemplate",
                    modify: "Pages.Reports.Vendors.PurchaseBillDetail.ModifyTemplate",
                },

                vendorAging: {
                    page: "Pages.Reports.Vendors.VendorAging",
                    view: "Pages.Reports.Vendors.VendorAging.View",
                    exportExcel: "Pages.Reports.Vendors.VendorAging.ExportExcel",
                    print: "Pages.Reports.Vendors.VendorAging.Print",
                    create: "Pages.Reports.Vendors.VendorAging.CreateTemplate",
                    modify: "Pages.Reports.Vendors.VendorAging.ModifyTemplate",
                },
            },
            //#endregion

            //#region Reports Customers
            customers: {
                page: "Pages.Reports.Customers",
                saleInvoices: {
                    page: "Pages.Reports.Customers.SaleInvoices",
                    view: "Pages.Reports.Customers.SaleInvoices.View",
                    exportExcel: "Pages.Reports.Customers.SaleInvoices.ExportExcel",
                    print: "Pages.Reports.Customers.SaleInvoices.Print",
                    create: "Pages.Reports.Customers.SaleInvoices.CreateTemplate",
                    modify: "Pages.Reports.Customers.SaleInvoices.ModifyTemplate",
                },

                saleInvoiceDetail: {
                    page: "Pages.Reports.Customers.SaleInvoiceDetail",
                    view: "Pages.Reports.Customers.SaleInvoiceDetail.View",
                    exportExcel: "Pages.Reports.Customers.SaleInvoiceDetail.ExportExcel",
                    print: "Pages.Reports.Customers.SaleInvoiceDetail.Print",
                    create: "Pages.Reports.Customers.SaleInvoiceDetail.CreateTemplate",
                    modify: "Pages.Reports.Customers.SaleInvoiceDetail.ModifyTemplate",
                },

                customerAging: {
                    page: "Pages.Reports.Customers.CustomerAging",
                    view: "Pages.Reports.Customers.CustomerAging.View",
                    exportExcel: "Pages.Reports.Customers.CustomerAging.ExportExcel",
                    print: "Pages.Reports.Customers.CustomerAging.Print",
                    create: "Pages.Reports.Customers.CustomerAging.CreateTemplate",
                    modify: "Pages.Reports.Customers.CustomerAging.ModifyTemplate",
                },
            },

            //#endregion

            //#region Reports Accounting
            accounting: {
                page: "Pages.Reports.Accounting",
                journals: {
                    page: "Pages.Reports.Accounting.Journals",
                    view: "Pages.Reports.Accounting.Journals.View",
                    editAccount: "Pages.Reports.Accounting.Journals.EditAccount",
                    exportExcel: "Pages.Reports.Accounting.Journals.ExportExcel",
                    print: "Pages.Reports.Accounting.Journals.Print",
                    create: "Pages.Reports.Accounting.Journals.CreateTemplate",
                    modify: "Pages.Reports.Accounting.Journals.ModifyTemplate",
                },

                ledger: {
                    page: "Pages.Reports.Accounting.Ledger",
                    view: "Pages.Reports.Accounting.Ledger.View",
                    editAccount: "Pages.Reports.Accounting.Ledger.EditAccount",
                    exportExcel: "Pages.Reports.Accounting.Ledger.ExportExcel",
                    print: "Pages.Reports.Accounting.Ledger.Print",
                    create: "Pages.Reports.Accounting.Ledger.CreateTemplate",
                    modify: "Pages.Reports.Accounting.Ledger.ModifyTemplate",
                },

                profitLoss: {
                    page: "Pages.Reports.Accounting.ProfitLoss",
                    view: "Pages.Reports.Accounting.ProfitLoss.View",
                    exportExcel: "Pages.Reports.Accounting.ProfitLoss.ExportExcel",
                    print: "Pages.Reports.Accounting.ProfitLoss.Print",
                    create: "Pages.Reports.Accounting.ProfitLoss.CreateTemplate",
                    modify: "Pages.Reports.Accounting.ProfitLoss.ModifyTemplate",
                },

                retainEarning: {
                    page: "Pages.Reports.Accounting.RetainEarning",
                    view: "Pages.Reports.Accounting.RetainEarning.View",
                    editAccount: "Pages.Reports.Accounting.RetainEarning.EditAccount",
                    exportExcel: "Pages.Reports.Accounting.RetainEarning.ExportExcel",
                    print: "Pages.Reports.Accounting.RetainEarning.Print",
                    create: "Pages.Reports.Accounting.RetainEarning.CreateTemplate",
                    modify: "Pages.Reports.Accounting.RetainEarning.ModifyTemplate",
                },

                balanceSheet: {
                    page: "Pages.Reports.Accounting.BalanceSheet",
                    view: "Pages.Reports.Accounting.BalanceSheet.View",
                    exportExcel: "Pages.Reports.Accounting.BalanceSheet.ExportExcel",
                    print: "Pages.Reports.Accounting.BalanceSheet.Print",
                    create: "Pages.Reports.Accounting.BalanceSheet.CreateTemplate",
                    modify: "Pages.Reports.Accounting.BalanceSheet.ModifyTemplate",
                },

                trialBalance: {
                    page: "Pages.Reports.Accounting.TrialBalance",
                    view: "Pages.Reports.Accounting.TrialBalance.View",
                    exportExcel: "Pages.Reports.Accounting.TrialBalance.ExportExcel",
                    print: "Pages.Reports.Accounting.TrialBalance.Print",
                    create: "Pages.Reports.Accounting.TrialBalance.CreateTemplate",
                    modify: "Pages.Reports.Accounting.TrialBalance.ModifyTemplate",
                },

                cashFlow: {
                    page: "Pages.Reports.Accounting.CashFlow",
                    view: "Pages.Reports.Accounting.CashFlow.View",
                    exportExcel: "Pages.Reports.Accounting.CashFlow.ExportExcel",
                    print: "Pages.Reports.Accounting.CashFlow.Print",
                    create: "Pages.Reports.Accounting.CashFlow.CreateTemplate",
                    modify: "Pages.Reports.Accounting.CashFlow.ModifyTemplate",
                },

                cashFlowDetail: {
                    page: "Pages.Reports.Accounting.CashFlowDetail",
                    view: "Pages.Reports.Accounting.CashFlowDetail.View",
                    exportExcel: "Pages.Reports.Accounting.CashFlowDetail.ExportExcel",
                    print: "Pages.Reports.Accounting.CashFlowDetail.Print",
                    create: "Pages.Reports.Accounting.CashFlowDetail.CreateTemplate",
                    modify: "Pages.Reports.Accounting.CashFlowDetail.ModifyTemplate",
                },
            },
            //#endregion

            //#region Loans
            loans: {
                page: "Pages.Reports.Loans",
                balances: {
                    page: "Pages.Reports.Loans.Balances",
                    view: "Pages.Reports.Loans.Balances.View",
                    exportExcel: "Pages.Reports.Loans.Balances.ExportExcel",
                    print: "Pages.Reports.Loans.Balances.Print",
                    create: "Pages.Reports.Loans.Balances.CreateTemplate",
                    modify: "Pages.Reports.Loans.Balances.ModifyTemplate",
                },

                collections: {
                    page: "Pages.Reports.Loans.Collections",
                    view: "Pages.Reports.Loans.Collections.View",
                    exportExcel: "Pages.Reports.Loans.Collections.ExportExcel",
                    print: "Pages.Reports.Loans.Collections.Print",
                    create: "Pages.Reports.Loans.Collections.CreateTemplate",
                    modify: "Pages.Reports.Loans.Collections.ModifyTemplate",
                },

                collaterals: {
                    page: "Pages.Reports.Loans.Collaterals",
                    view: "Pages.Reports.Loans.Collaterals.View",
                    exportExcel: "Pages.Reports.Loans.Collaterals.ExportExcel",
                    print: "Pages.Reports.Loans.Collaterals.Print",
                    create: "Pages.Reports.Loans.Collaterals.CreateTemplate",
                    modify: "Pages.Reports.Loans.Collaterals.ModifyTemplate",
                },
            },
            //#endregion

            //#region Reports Inventory
            inventories: {
                page: "Pages.Reports.Inventories",
                stockBalance: {
                    page: "Pages.Reports.Inventories.StockBalance",
                    view: "Pages.Reports.Inventories.StockBalance.View",
                    exportExcel: "Pages.Reports.Inventories.StockBalance.ExportExcel",
                    print: "Pages.Reports.Inventories.StockBalance.Print",
                    create: "Pages.Reports.Inventories.StockBalance.CreateTemplate",
                    modify: "Pages.Reports.Inventories.StockBalance.ModifyTemplate",
                },

                transactions: {
                    page: "Pages.Reports.Inventories.Transactions",
                    view: "Pages.Reports.Inventories.Transactions.View",
                    exportExcel: "Pages.Reports.Inventories.Transactions.ExportExcel",
                    print: "Pages.Reports.Inventories.Transactions.Print",
                    create: "Pages.Reports.Inventories.Transactions.CreateTemplate",
                    modify: "Pages.Reports.Inventories.Transactions.ModifyTemplate",
                },

                transactionDetail: {
                    page: "Pages.Reports.Inventories.TransactionDetail",
                    view: "Pages.Reports.Inventories.TransactionDetail.View",
                    exportExcel: "Pages.Reports.Inventories.TransactionDetail.ExportExcel",
                    print: "Pages.Reports.Inventories.TransactionDetail.Print",
                    create: "Pages.Reports.Inventories.TransactionDetail.CreateTemplate",
                    modify: "Pages.Reports.Inventories.TransactionDetail.ModifyTemplate",
                },

                lends: {
                    page: "Pages.Reports.Inventories.Lends",
                    view: "Pages.Reports.Inventories.Lends.View",
                    exportExcel: "Pages.Reports.Inventories.Lends.ExportExcel",
                    print: "Pages.Reports.Inventories.Lends.Print",
                    create: "Pages.Reports.Inventories.Lends.CreateTemplate",
                    modify: "Pages.Reports.Inventories.Lends.ModifyTemplate",
                },

                costSummary: {
                    page: "Pages.Reports.Inventories.CostSummary",
                    view: "Pages.Reports.Inventories.CostSummary.View",
                    exportExcel: "Pages.Reports.Inventories.CostSummary.ExportExcel",
                    print: "Pages.Reports.Inventories.CostSummary.Print",
                    create: "Pages.Reports.Inventories.CostSummary.CreateTemplate",
                    modify: "Pages.Reports.Inventories.CostSummary.ModifyTemplate",
                },

                costDetail: {
                    page: "Pages.Reports.Inventories.CostDetail",
                    view: "Pages.Reports.Inventories.CostDetail.View",
                    exportExcel: "Pages.Reports.Inventories.CostDetail.ExportExcel",
                    print: "Pages.Reports.Inventories.CostDetail.Print",
                    create: "Pages.Reports.Inventories.CostDetail.CreateTemplate",
                    modify: "Pages.Reports.Inventories.CostDetail.ModifyTemplate",
                },
            },
            //#endregion
        },
        //#endregion

        //#region Pages Administrations
        administrations: {
            page: "Pages.Administrations",
            groups: {
                page: "Pages.Administrations.Groups",
                create: "Pages.Administrations.Groups.Create",
                view: "Pages.Administrations.Groups.View",
                edit: "Pages.Administrations.Groups.Edit",
                delete: "Pages.Administrations.Groups.Delete",
                enable: "Pages.Administrations.Groups.Enable",
                disable: "Pages.Administrations.Groups.Disable",
                changeMember: "Pages.Administrations.Groups.ChangeMember",
            },

            users: {
                page: "Pages.Administrations.Users",
                create: "Pages.Administrations.Users.Create",
                view: "Pages.Administrations.Users.View",
                edit: "Pages.Administrations.Users.Edit",
                delete: "Pages.Administrations.Users.Delete",
                enable: "Pages.Administrations.Users.Enable",
                disable: "Pages.Administrations.Users.Disable",
                activate: "Pages.Administrations.Users.Activate",
                deactivate: "Pages.Administrations.Users.Deactivate",
                resetPassword: "Pages.Administrations.Users.ResetPassword",
                changePermissions: "Pages.Administrations.Users.ChangePermissions",
                impersonation: "Pages.Administrations.Users.Impersonation",
            },

            roles: {
                page: "Pages.Administrations.Roles",
                create: "Pages.Administrations.Roles.Create",
                view: "Pages.Administrations.Roles.View",
                edit: "Pages.Administrations.Roles.Edit",
                delete: "Pages.Administrations.Roles.Delete",
                enable: "Pages.Administrations.Roles.Enable",
                disable: "Pages.Administrations.Roles.Disable",
            },

            auditLogs: {
                page: "Pages.Administrations.AuditLogs",
                view: "Pages.Administrations.AuditLogs.View",
                exportExcel: "Pages.Administrations.AuditLogs.ExportExcel",
            },

            organizationUnits: {
                page: "Pages.Administrations.OrganizationUnits",
                create: "Pages.Administrations.OrganizationUnits.Create",
                view: "Pages.Administrations.OrganizationUnits.View",
                edit: "Pages.Administrations.OrganizationUnits.Edit",
                delete: "Pages.Administrations.OrganizationUnits.Delete",
                enable: "Pages.Administrations.OrganizationUnits.Enable",
                disable: "Pages.Administrations.OrganizationUnits.Disable",
                manageOrganizationTree: "Pages.Administrations.OrganizationUnits.ManageOrganizationTree",
                manageMembers: "Pages.Administrations.OrganizationUnits.ManageMembers",
            },
        }
        //#endregion

    };
}
