import {
    Component,
    OnInit,
    Injector,
    ChangeDetectionStrategy
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { filter as _filter } from 'lodash-es';
import { AppConsts } from '../../shared/AppConsts';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'account-languages',
    templateUrl: './account-languages.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgFor, NgIf]
})
export class AccountLanguagesComponent extends AppComponentBase implements OnInit {

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.languages = _filter(
            this.localization.languages,
            (l) => !l.isDisabled
        );
        this.currentLanguage = this.localization.currentLanguage;
    }

    changeLanguage(languageName: string): void {
        abp.utils.setCookieValue(
            AppConsts.config.localize,
            languageName,
            AppConsts.config.cookieExpiredDate,
            abp.appPath
        );

        location.reload();
    }
}
