import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppLayoutComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
    standalone: true,
    imports: [NgClass, ButtonDirective, NgFor, NgIf, RadioButtonModule, FormsModule, InputSwitchModule]
})
export class AppConfigComponent extends AppLayoutComponentBase implements OnInit {

    @Input() minimal: boolean = false;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
       
    }
    
    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.layoutService.config.scale = _val;

        abp.utils.setCookieValue(AppConsts.ui.options.fontSize, String(_val), AppConsts.config.cookieExpiredDate, abp.appPath);
    }

    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val: string) {
        this.layoutService.config.menuMode = _val;

        if (_val == 'overlay') {
            document.body.classList.remove('layout-static');
            document.body.classList.add('layout-overlay');
        } else {
            document.body.classList.remove('layout-overlay');
            document.body.classList.add('layout-static');
        }

        abp.utils.setCookieValue(AppConsts.ui.options.menuType, _val, AppConsts.config.cookieExpiredDate, abp.appPath);
    }

    get inputStyle(): string {
        return this.layoutService.config.inputStyle;
    }

    set inputStyle(_val: string) {
        this.layoutService.config.inputStyle = _val;

        if (_val == 'filled') {
            document.body.classList.add('p-input-filled');
        } else {
            document.body.classList.remove('p-input-filled');
        }

        abp.utils.setCookieValue(AppConsts.ui.options.inputStyle, _val, AppConsts.config.cookieExpiredDate, abp.appPath);
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(_val: boolean) {
        this.layoutService.config.ripple = _val;

        if (_val) {
            document.body.classList.remove("p-ripple-disabled");
        }
        else {
            document.body.classList.add("p-ripple-disabled");
        }

        abp.utils.setCookieValue(AppConsts.ui.options.ripple, String(_val), AppConsts.config.cookieExpiredDate, abp.appPath);
    }

    onConfigButtonClick(event) {
        let btn = event.currentTarget as HTMLButtonElement;
        let icon = btn.querySelector('.rotate');
        if (icon) icon.classList.toggle('rotate-down');

        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string, colorScheme: string) {
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const newHref = themeLink.getAttribute('href')?.replace(this.layoutService.config.theme, theme);
        this.replaceThemeLink(newHref, () => {
            this.layoutService.config.theme = theme;
            this.layoutService.config.colorScheme = colorScheme;
            this.layoutService.onConfigUpdate();

            if (colorScheme === "dark") {
                document.body.classList.remove('layout-theme-light');
                document.body.classList.add('layout-theme-dark');
            } else {
                document.body.classList.remove('layout-theme-dark');
                document.body.classList.add('layout-theme-light');
            }

            abp.utils.setCookieValue(AppConsts.ui.theme.name, theme, AppConsts.config.cookieExpiredDate, abp.appPath);
            abp.utils.setCookieValue(AppConsts.ui.theme.colorScheme, String(colorScheme), AppConsts.config.cookieExpiredDate, abp.appPath);
        });
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode?.insertBefore(cloneLinkElement, themeLink.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }

    clearSettings() {
        this.message.confirm("Are you sure to clear settings?", "Clear Setting Confirm", (result) => {
            if (result) {
                abp.utils.deleteCookie(AppConsts.ui.options.ripple, abp.appPath);
                abp.utils.deleteCookie(AppConsts.ui.options.inputStyle, abp.appPath);
                abp.utils.deleteCookie(AppConsts.ui.options.menuType, abp.appPath);
                abp.utils.deleteCookie(AppConsts.ui.options.fontSize, abp.appPath);
                abp.utils.deleteCookie(AppConsts.ui.theme.name, abp.appPath);
                abp.utils.deleteCookie(AppConsts.ui.theme.colorScheme, abp.appPath);

                location.reload();
            }
        });
    }
    
}
