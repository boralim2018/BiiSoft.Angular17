import { Component, Injector, Renderer2 } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './app/layout/service/app.layout.service';
import { AppLayoutComponentBase } from './shared/app-component-base';
import { AppConsts } from './shared/AppConsts';
import { SignalRAspNetCoreHelper } from './shared/helpers/SignalRAspNetCoreHelper';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    standalone: true,
    imports: [RouterOutlet]
})
export class RootComponent extends AppLayoutComponentBase {

    constructor(
        injector: Injector,
        //private renderer: Renderer2,
        //private _layoutStore: LayoutStoreService,
        private primengConfig: PrimeNGConfig,
        public layoutService: LayoutService,
    ) {
        super(injector);
    }

    layoutClasses: any;

    ngOnInit(): void {

        this.primengConfig.ripple = true;

        this.initTheme();

        SignalRAspNetCoreHelper.initSignalR();

        //abp.event.on('abp.notifications.received', (userNotification) => {
        //    abp.notifications.showUiNotifyForUserNotification(userNotification);

        //    // Desktop notification
        //    Push.create('AbpZeroTemplate', {
        //        body: userNotification.notification.data.message,
        //        icon: abp.appPath + 'assets/app-logo-small.png',
        //        timeout: 6000,
        //        onClick: function () {
        //            window.focus();
        //            this.close();
        //        }
        //    });
        //});
    }

    private initTheme() {
        this.initThemeFromCache();

        document.body.classList.add(this.layoutService.config.colorScheme === 'dark' ? 'layout-theme-dark' : 'layout-theme-light');
        document.body.classList.add(this.layoutService.config.menuMode === 'overlay' ? 'layout-overlay' : 'layout-static');
        if (this.layoutService.config.inputStyle === 'filled') document.body.classList.add('p-input-filled');
        if (!this.layoutService.config.ripple) document.body.classList.add('p-ripple-disabled');
    }

    private initThemeFromCache() {
        let ripple = abp.utils.getCookieValue(AppConsts.ui.options.ripple);
        if (ripple) this.layoutService.config.ripple = ripple.toLowerCase() === 'true' || ripple === '1';

        let colorScheme = abp.utils.getCookieValue(AppConsts.ui.theme.colorScheme);
        if (colorScheme) this.layoutService.config.colorScheme = colorScheme;

        let inputStyle = abp.utils.getCookieValue(AppConsts.ui.options.inputStyle);
        if (inputStyle) this.layoutService.config.inputStyle = inputStyle;

        let fontSize = abp.utils.getCookieValue(AppConsts.ui.options.fontSize);
        if (fontSize) {
            this.layoutService.config.scale = +abp.utils.getCookieValue(AppConsts.ui.options.fontSize)

            //font size either not less than Min Font Size, nor greater than Max Font Size
            let minScale = Math.min(...this.scales);
            let maxScale = Math.max(...this.scales);
            if (this.layoutService.config.scale < minScale) this.layoutService.config.scale = minScale;
            else if (this.layoutService.config.scale > maxScale) this.layoutService.config.scale = maxScale;

            document.documentElement.style.fontSize = this.layoutService.config.scale + 'px';
        }

        let menuMode = abp.utils.getCookieValue(AppConsts.ui.options.menuType);
        if (menuMode) this.layoutService.config.menuMode = menuMode;

        let theme = abp.utils.getCookieValue(AppConsts.ui.theme.name);
        if (theme) {
            this.layoutService.config.theme = theme;
            let themeElement = document.getElementById('theme-css');
            if (themeElement) themeElement.setAttribute('href', 'assets/styles/theme/' + this.layoutService.config.theme + '/theme.css');
        }

        this.layoutService.config.uiSettingEnable = abp.setting.getBoolean(AppConsts.ui.enable);
    }

}
