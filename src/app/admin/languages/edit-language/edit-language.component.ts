import { Component, Injector, OnInit } from '@angular/core';
import { ApplicationLanguageEditDto, ComboboxItemDto, CreateOrUpdateLanguageInput, LanguageServiceProxy } from '@shared/service-proxies/service-proxies';
import { catchError, finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf, NgClass } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    selector: 'app-edit-language',
    templateUrl: './edit-language.component.html',
    providers: [LanguageServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, DropdownModule, PrimeTemplate, NgIf, InputTextModule, NgClass, AbpValidationSummaryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditLanguageComponent extends DynamicDialogBase implements OnInit {

    saving = false;
    model: ApplicationLanguageEditDto = new ApplicationLanguageEditDto();
    languages: ComboboxItemDto[] = [];
    selectedLanguage: ComboboxItemDto;
    flags: ComboboxItemDto[] = [];
    selectedFlag: ComboboxItemDto;

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
        this.getModel();
    }

    getModel() {
        this.saving = true;
        this._languageService.getLanguageForEdit(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe(result => {
                this.model = result.language;
                this.flags = result.flags;
                this.languages = result.languageNames;
                this.selectedLanguage = result.languageNames.find(s => s.isSelected);
                this.selectedFlag = result.flags.find(s => s.isSelected);
            });
    }

    save(): void {
        this.saving = true;

        var input = new CreateOrUpdateLanguageInput();
        input.language = this.model;
        this._languageService.createOrUpdateLanguage(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

    onFlagChange(event: any) {
        this.model.icon = this.selectedFlag.value;
    }

    onLanguageChange(event: any) {
        this.model.name = this.selectedLanguage.value;
        this.model.displayName = this.selectedLanguage.displayText;
    }
}
