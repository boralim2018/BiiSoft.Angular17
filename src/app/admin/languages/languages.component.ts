import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    LanguageServiceProxy,
    ApplicationLanguageListDto,
    EntityDto,
    SetDefaultLanguageInput
} from '@shared/service-proxies/service-proxies';
import { Menu, MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Table, TableModule } from 'primeng/table';
import { AppPermissions } from '@shared/AppPermissions';
import { CreateLanguageComponent } from './create-language/create-language.component';
import { EditLanguageComponent } from './edit-language/edit-language.component';
import { Router } from '@angular/router';
import { Mixin } from 'ts-mixer';
import { NavBarComponentBase } from '@shared/app-component-base';
import { RecordNotFoundComponent } from '../../../shared/components/record-not-found/record-not-found.component';
import { TagModule } from 'primeng/tag';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgStyle, NgFor, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { SearchActionComponent } from '../../../shared/components/search-action/search-action.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { of } from 'rxjs';

@Component({
    templateUrl: './languages.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, LanguageServiceProxy],
    standalone: true,
    imports: [MenuModule, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, ButtonDirective, Ripple, TagModule, RecordNotFoundComponent]
})
export class LanguagesComponent extends Mixin(PrimeNgListComponentBase<ApplicationLanguageListDto>, NavBarComponentBase) implements OnInit {

    @ViewChild('languageTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.languages.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.languages.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.languages.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.languages.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.languages.disable);
    canChangeTexts: boolean = this.isGranted(AppPermissions.pages.languages.changeTexts);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;   
    inlineActionVisible: boolean;

    defaultLanguage: string;

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "LanguageTableCacheKey"; 
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canEdit || this.canDelete || this.canEnable || this.canDisable || this.canChangeTexts;
    }

    initNavBar() {
        this.title = this.l("Languages");
        this.setTitle();
    }


    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createLanguage(); } });
    }

    protected initColumns() {
        this.columns = [
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'Icon', header: 'Icon' },
            { name: 'IsDisabled', header: 'IsActive', width: '15rem' }
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getList(input: any, callBack: Function) {
        
        this._languageService
            .getLanguages(input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(
                finalize(() => callBack()),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                this.defaultLanguage = result.defaultLanguageName;
            });

    }

    delete(language: ApplicationLanguageListDto): void {

        this.message.confirm(
            this.l('DeleteWarningMessage', this.l('Language'), language.displayName), this.l('Delete'), (result) => {
                if (result) {

                    this.isTableLoading = true;
                    this._languageService.deleteLanguage(language.id)
                        .pipe(
                            finalize(() => this.isTableLoading = false),
                            catchError((err: any) => {
                                this.message.error(err.message);
                                return of(null);
                            })
                        )
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    enable(language: ApplicationLanguageListDto): void {

        this.message.confirm(
            this.l('EanbleWarningMessage', this.l('Language'), language.displayName), this.l('Enable'), (result) => {
                if (result) {

                    var input = new EntityDto();
                    input.id = language.id;

                    this.isTableLoading = true;
                    this._languageService.enable(input)
                        .pipe(
                            finalize(() => this.isTableLoading = false),
                            catchError((err: any) => {
                                this.message.error(err.message);
                                return of(null);
                            })
                        )
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(language: ApplicationLanguageListDto): void {

        this.message.confirm(
            this.l('DisableWarningMessage', this.l('Language'), language.displayName), this.l('Disable'), (result) => {
                if (result) {

                    var input = new EntityDto();
                    input.id = language.id;

                    this.isTableLoading = true;                    
                    this._languageService.disable(input)
                        .pipe(
                            finalize(() => this.isTableLoading = false),
                            catchError((err: any) => {
                                this.message.error(err.message);
                                return of(null);
                            })
                        )
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    setDefault(language: ApplicationLanguageListDto): void {

        this.message.confirm(
            this.l('SetDefaultWarningMessage', this.l('Language'), language.displayName), this.l('Default'), (result) => {
                if (result) {

                    var input = new SetDefaultLanguageInput();
                    input.name = language.name;

                    this.isTableLoading = true;
                    this._languageService.setDefaultLanguage(input)
                        .pipe(
                            finalize(() => this.isTableLoading = false),
                            catchError((err: any) => {
                                this.message.error(err.message);
                                return of(null);
                            })
                        )
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    changeTexts(language: ApplicationLanguageListDto) {
        this._router.navigate(['app/admin/languages', language.name, 'texts']);
    }

    createLanguage(): void {
        this.showCreateOrEditLanguageDialog();
    }

    editLanguage(language: ApplicationLanguageListDto): void {
        this.showCreateOrEditLanguageDialog(language.id);
    }

    showCreateOrEditLanguageDialog(id?: number): void {
        let createOrEditLanguageDialog: DynamicDialogRef;
        if (!id) {
            createOrEditLanguageDialog = this._dialogService.open(CreateLanguageComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('Language'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditLanguageDialog = this._dialogService.open(EditLanguageComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('Language'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditLanguageDialog.onClose.subscribe((result) => {
            if(result) this.refresh();
        });
    }

    showInlineActions(language: ApplicationLanguageListDto, event: Event) {
        if (!this.inlineActionMenu) return;
     
        this.inlineActionMenu.model = [];
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editLanguage(language); } });
        if (this.canDelete && language.name != this.defaultLanguage) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(language); } });
        if (this.canEnable && language.isDisabled) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'fa-regular fa-circle-check', command: () => { this.enable(language); } });
        if (this.canDisable && !language.isDisabled && language.name != this.defaultLanguage) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(language); } });
        if (this.canEdit && !language.isDisabled && language.name != this.defaultLanguage) this.inlineActionMenu.model.push({ label: this.l('SetAsDefault'), icon: 'fa-solid fa-d', command: () => { this.setDefault(language); } });
        if (this.canChangeTexts && !language.isDisabled) this.inlineActionMenu.model.push({ label: this.l('ChangeTexts'), icon: 'fa-solid fa-t', command: () => { this.changeTexts(language); } });

        this.inlineActionMenu.show(event);
    }
}
