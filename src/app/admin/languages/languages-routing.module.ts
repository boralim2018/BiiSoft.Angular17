import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPermissions } from '../../../shared/AppPermissions';
import { LanguagesComponent } from './languages.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LanguagesComponent },
            { path: ':name/texts', loadComponent: () => import('./language-texts/language-texts.component').then(c => c.LanguageTextsComponent), data: { permission: AppPermissions.pages.languages.changeTexts } },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class LanguagesRoutingModule { }
