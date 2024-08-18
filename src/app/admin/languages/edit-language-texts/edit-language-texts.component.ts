import { Component, Injector, OnInit } from '@angular/core';
import { LanguageServiceProxy, UpdateLanguageTextInput } from '@shared/service-proxies/service-proxies';
import { catchError, finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as _ from 'lodash-es';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    selector: 'app-edit-language-texts',
    templateUrl: './edit-language-texts.component.html',
    providers: [LanguageServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextareaModule, ButtonDirective, Ripple, LocalizePipe]
})
export class EditLanguageTextsComponent extends DynamicDialogBase implements OnInit {

    saving = false;
    model: UpdateLanguageTextInput = new UpdateLanguageTextInput();

    baseText: string;
    baseLanguage: abp.localization.ILanguageInfo;
    targetLanguage: abp.localization.ILanguageInfo;

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new UpdateLanguageTextInput();
        this.model.sourceName = this._dialogConfig.data.sourceName;
        this.model.key = this._dialogConfig.data.language.key;
        this.model.languageName = this._dialogConfig.data.targetLanguageName;
        this.model.value = this._dialogConfig.data.language.targetValue;

        this.baseText = this._dialogConfig.data.language.baseValue;
        this.baseLanguage = _.find(abp.localization.languages, l => l.name === this._dialogConfig.data.baseLanguageName);
        this.targetLanguage = _.find(abp.localization.languages, l => l.name === this._dialogConfig.data.targetLanguageName);
    }

    save(): void {
        this.saving = true;

        this._languageService.updateLanguageText(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }
}
