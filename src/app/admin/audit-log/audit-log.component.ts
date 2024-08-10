import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    AuditLogServiceProxy,
    AuditLogListDtoPagedResultDto,
    AuditLogListDto,
    ExportAuditLogsInput,
    ExportFileOutput,
    ColumnOutput
} from '@shared/service-proxies/service-proxies';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Menu, MenuModule } from 'primeng/menu';
import { AppPermissions } from '@shared/AppPermissions';
import { Table, TableModule } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as moment from 'moment';
import { ViewAuditLogComponent } from './view-audit-log/view-audit-log.component';
import { AppConsts } from '@shared/AppConsts';
import { ColumnType } from '@shared/AppEnums';
import { Mixin } from 'ts-mixer';
import { ExcelFileComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { RecordNotFoundComponent } from '../../../shared/components/record-not-found/record-not-found.component';
import { TagModule } from 'primeng/tag';
import { PrimeTemplate } from 'primeng/api';
import { SearchActionComponent } from '../../../shared/components/search-action/search-action.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SearchFooterComponent } from '../../../shared/components/search-action/search-footer.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgStyle, NgFor, NgIf, DatePipe } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { of } from 'rxjs';

@Component({
    templateUrl: './audit-log.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, AuditLogServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, CalendarModule, InputNumberModule, DropdownModule, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent, DatePipe]
})
export class AuditLogComponent extends Mixin(PrimeNgListComponentBase<AuditLogListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {
    protected get sortMode(): number { return -1; }
    protected get sortField(): string { return "ExecutionTime"; }

    @ViewChild('auditLogTable') table: Table;
    canView: boolean = this.isGranted(AppPermissions.pages.administrations.auditLogs.view);
    canExportExcel: boolean = this.isGranted(AppPermissions.pages.administrations.auditLogs.exportExcel);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;    
    inlineActionVisible: boolean;

    showFilter: boolean;
    hasErrorModels: any[];
    dates: Date[] = [];

    constructor(
        injector: Injector,
        private _service: AuditLogServiceProxy,
        private _dialogService: DialogService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "AuditLogTableCacheKey";
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canView;

        this.hasErrorModels = [
            { label: this.l('All'), value: '' },
            { label: this.l('Error') , value: true },
            { label: this.l('Success') , value: false }
        ];

        this.dates = [new Date(), new Date()]; 
    }

    initNavBar() {
        this.title = this.l("AuditLogs");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canExportExcel) this.actionMenuItems.push({ label: this.l('Excel'), icon: 'pi pi-fw pi-file-excel', command: () => { this.exportExcel(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();

        this.filterInput.isActive = undefined;
        this.filterInput.minExecutionDuration = 0;
        this.filterInput.maxExecutionDuration = 0;
    }

    protected initColumns() {      
        this.columns = [
            { name: 'ExecutionTime', header: this.l('ExecutionTime'), width: '15rem', sort: true, type: ColumnType.DateTime },
            { name: 'ServiceName', header: this.l('ServiceName'), width: '15rem', sort: true },
            { name: 'MethodName', header: this.l('MethodName'), width: '15rem', sort: true },
            { name: 'ExecutionDuration', header: this.l('Duration'), width: '15rem', sort: true, type: ColumnType.Number },           
            { name: 'UserName', header: this.l('User'), width: '15rem', sort: true },
            { name: 'Success', header: this.l('Status'), width: '15rem', type: ColumnType.Bool },
            { name: 'Exception', header: this.l('Exception'), sort: true },
            { name: 'ClientIpAddress', header: this.l('ClientIpAddress'), width: '15rem', sort: true, visible: false },
            { name: 'BrowserInfo', header: this.l('BrowserInfo'), sort: true, visible: false },
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getList(input: any, callBack: Function) {

        input.startDate = this.dates && this.dates.length > 0 ? moment(this.dates[0]) : undefined;
        input.endDate = this.dates && this.dates.length > 1 && this.dates[1] ? moment(this.dates[1]) : moment(new Date());
                
        this._service
            .getAuditLogs(input.startDate, input.endDate, input.userName, input.serviceName, input.methodName,
                input.browserInfo, input.hasException, input.minExecutionDuration, input.maxExecutionDuration, 
                input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(
                finalize(() => callBack()),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result: AuditLogListDtoPagedResultDto) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filete sidebar
                this.showFilter = false;
            });
    }

    exportExcel() {
       
        let input = new ExportAuditLogsInput();
        input.startDate = this.dates && this.dates.length > 0 ? moment(this.dates[0]) : undefined;
        input.endDate = this.dates && this.dates.length > 1 && this.dates[1] ? moment(this.dates[1]) : moment(new Date());
        input.serviceName = this.filterInput.serviceName;
        input.methodName = this.filterInput.methodName;
        input.userName = this.filterInput.userName;
        input.keyword = this.filterInput.keyword;
        input.hasException = this.filterInput.hasException;
        input.browserInfo = this.filterInput.browserInfo;
        input.sortField = this.filterInput.sortField;
        input.sortMode = this.filterInput.sortMode;
        input.skipCount = this.filterInput.skipCount;
        input.maxResultCount = this.filterInput.maxResultCount;
        input.minExecutionDuration = this.filterInput.minExecutionDuration;
        input.maxExecutionDuration = this.filterInput.maxExecutionDuration;
        input.columns = this.selectedColumns.map((c, index) => {

            let width = 0;
            let th = this.getColumnInfo(c.name);
            if (th) width = th.offsetWidth; //get column width in pixcels

            let col = ColumnOutput.fromJS({
                columnName: c.name,
                columnTitle: this.l(c.header),
                index: index,
                visible: true,
                columnType: c.type ? c.type : ColumnType.Text,
                width: width
            });

            return col;
        });

        this._service
            .exportExcel(input)
            .pipe(
                finalize(() => this.isTableLoading = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result: ExportFileOutput) => {
                this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, `AuditLogs_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xlsx`);
            });
    }

    delete(auditLog: AuditLogListDto): void {
                
    }

    view(auditLog: AuditLogListDto): void {
        this._dialogService.open(ViewAuditLogComponent, {
            data: auditLog,
            header: this.l('View') + ' ' + this.l('AuditLog'),
            styleClass: this.responsiveDialogClass
        });
    }

    showInlineActions(auditLog: AuditLogListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.view(auditLog); } });
      
        this.inlineActionMenu.show(event);
    }



}
