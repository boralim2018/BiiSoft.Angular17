export class AppConsts {

    static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

    static appName: string;
    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'BiiSoft'
    };

    static readonly authorization = {
        encryptedAuthTokenName: 'enc_auth_token'
    };

    static readonly config = {
        localize: 'Abp.Localization.CultureName',
        cookieExpiredDate: new Date(new Date().getTime() + 30 * 86400000) //24 * 3600 * 1000 = 86400000 = 1day
    }

    static readonly ui = {
        enable: 'UI.Enable',
        default: {
            themeName: 'lara-light-indigo',
            fontSize: 14,
            menuType: 'static'
        },

        theme: {
            name: 'UI.Theme.Name',
            colorScheme: 'UI.Theme.ColorScheme'
        },
        options: {
            fontSize: 'UI.Options.FontSize',
            ripple: 'UI.Options.Ripple',
            inputStyle: 'UI.Options.InputStyle',
            menuType: 'UI.Options.MenuType'
        }

    }
}
