import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    LanguageServiceProxy,
    LanguageTextListDto
} from '@shared/service-proxies/service-proxies';
import { Menu, MenuModule } from 'primeng/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Table, TableModule } from 'primeng/table';
import { AppPermissions } from '@shared/AppPermissions';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { EditLanguageTextsComponent } from '../edit-language-texts/edit-language-texts.component';
import { Mixin } from 'ts-mixer';
import { NavBarComponentBase } from '../../../../shared/app-component-base';
import { RecordNotFoundComponent } from '../../../../shared/components/record-not-found/record-not-found.component';
import { SearchActionComponent } from '../../../../shared/components/search-action/search-action.component';
import { NavBarComponent } from '../../../../shared/components/nav-bar/nav-bar.component';
import { TableSettingComponent } from '../../../../shared/components/table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SearchFooterComponent } from '../../../../shared/components/search-action/search-footer.component';
import { PrimeTemplate } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgStyle, NgFor, NgIf } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';

@Component({
    selector: 'app-language-texts',
    templateUrl: './language-texts.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, LanguageServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, PrimeTemplate, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, NgStyle, NgFor, NgIf, RecordNotFoundComponent]
})
export class LanguageTextsComponent extends Mixin(PrimeNgListComponentBase<LanguageTextListDto>, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'key'; }

    @ViewChild('languageTextTable') table: Table;
    canEdit: boolean = this.isGranted(AppPermissions.pages.languages.edit);
    canChangeTexts: boolean = this.isGranted(AppPermissions.pages.languages.changeTexts);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;
    showFilter: boolean;
        
    languages: abp.localization.ILanguageInfo[] = [];
    sourceNames: string[] = [];
    targetLanguageName: string;
    sourceName: string;
    baseLanguageName: string;
    targetValueFilter: string;

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy,
        private _dialogService: DialogService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "LanguageTextTableCacheKey";
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canEdit || this.canChangeTexts;

        this.sourceNames = _.map(_.filter(abp.localization.sources, source => source.type === 'MultiTenantLocalizationSource'), value => value.name);
        this.languages = abp.localization.languages;

        this.init();
    }

    initNavBar() {
        this.title = this.l("LanguageTexts");
        this.navBarItems.push({ label: this.l("Languages"), routerLink: "/app/admin/languages" });
        this.setTitle();
    }

    init(): void {
        this._activatedRoute.params.subscribe((params: Params) => {
            this.baseLanguageName = params['baseLanguageName'] || abp.localization.currentLanguage.name;
            this.targetLanguageName = params['name'];
            this.sourceName = params['sourceName'] || 'BiiSoft';
            this.targetValueFilter = params['targetValueFilter'] || 'ALL';
        });
    }


    private initActionMenuItems() {
        this.actionMenuItems = [];
        this.actionMenuItems.push({ label: this.l('Back'), icon: 'pi pi-arrow-left', command: () => { this.back(); } });
    }

    protected initColumns() {
        this.columns = [
            { name: 'Key', header: 'Key', width: '25rem', sort: true },
            { name: 'BaseValue', header: 'BaseValue', width: '25rem', sort: true },
            { name: 'TargetValue', header: 'TargetValue' }
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.targetLanguageName = undefined;
        this.sourceName = undefined;
        this.baseLanguageName = undefined;
        this.targetValueFilter = undefined;
    }

    protected getInitCache(): any {
        let cache = super.getInitCache();

        //Add more data in cache
        cache.targetLanguageName = this.targetLanguageName;
        cache.sourceName = this.sourceName;
        cache.baseLanguageName = this.baseLanguageName;
        cache.targetValueFilter = this.targetValueFilter;

        return cache;
    }

    protected initDataFromCache(cache: any) {
        super.initDataFromCache(cache);

        //Init more data
        this.targetLanguageName = cache.targetLanguageName;
        this.sourceName = cache.sourceName;
        this.baseLanguageName = cache.baseLanguageName;
        this.targetValueFilter = cache.targetValueFilter;
    }

    protected getList(input: any, callBack: Function) {

        this._languageService
            .getLanguageTexts(this.sourceName, this.baseLanguageName, this.targetLanguageName, this.targetValueFilter, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                this.showFilter = false;
            });

    }

    delete(language: LanguageTextListDto): void {

    }

    back(): void {
        this._router.navigate(['app/admin/languages']);
    }

    editLanguage(language: LanguageTextListDto): void {

        let createOrEditLanguageDialog = this._dialogService.open(EditLanguageTextsComponent, {
            data: {
                sourceName: this.sourceName,
                baseLanguageName: this.baseLanguageName,
                targetLanguageName: this.targetLanguageName,
                language: language
            },
            header: this.l('Edit') + ' ' + this.l('LanguageTexts'),
            styleClass: this.responsiveDialogClass
        });

        createOrEditLanguageDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    showInlineActions(language: LanguageTextListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editLanguage(language); } });

        this.inlineActionMenu.show(event);
    }
}
