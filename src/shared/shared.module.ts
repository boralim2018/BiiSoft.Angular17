import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { SafeUrlPipe } from '@shared/pipes/safe-resource-url.pipe';

import { AbpValidationSummaryComponent } from './components/validation/abp-validation.summary.component';

import { BusyDirective } from './directives/busy.directive';
import { EqualValidator } from './directives/equal-validator.directive';

import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';

import { FormsModule } from '@angular/forms';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { SearchActionComponent } from './components/search-action/search-action.component';
import { SearchFooterComponent } from './components/search-action/search-footer.component';
import { FindUserComponent } from './components/find-user/find-user.component';
import { FindUserDialogComponent } from './components/find-user/find-user-dialog.component';
import { TableSettingComponent } from './components/table-setting/table-setting.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RecordNotFoundComponent } from './components/record-not-found/record-not-found.component';
import { FindSearchActionComponent } from './components/find-search-action/find-search-action.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        MenuModule,
        TableModule,
        CheckboxModule,
        ListboxModule,
        InputSwitchModule,
        PaginatorModule,
        OverlayPanelModule,
        AbpValidationSummaryComponent,
        LocalizePipe,
        SafeUrlPipe,
        BusyDirective,
        EqualValidator,
        ConfirmDeleteComponent,
        SearchActionComponent,
        SearchFooterComponent,
        FindUserComponent,
        FindUserDialogComponent,
        TableSettingComponent,
        NavBarComponent,
        RecordNotFoundComponent,
        FindSearchActionComponent,
    ],
    exports: [
        AbpValidationSummaryComponent,
        LocalizePipe,
        SafeUrlPipe,
        BusyDirective,
        EqualValidator,
        SearchActionComponent,
        SearchFooterComponent,
        FindUserComponent,
        TableSettingComponent,
        NavBarComponent,
        RecordNotFoundComponent,
        FindSearchActionComponent,
        InputTextModule,
        PasswordModule,
        CheckboxModule,
        RadioButtonModule,
        ButtonModule,
        SplitButtonModule,
        RippleModule,
        DividerModule,
        DialogModule,
        DynamicDialogModule,
        StyleClassModule,
        InputTextareaModule,
        SidebarModule,
        InputSwitchModule,
        DropdownModule,
        TagModule,
        MessagesModule,
        MessageModule,
        CalendarModule,
        InputNumberModule,
        MultiSelectModule,
        TableModule,
        MenuModule,
        OverlayPanelModule,
        ListboxModule,
        ToastModule
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AppSessionService,
                AppUrlService,
                AppAuthService,
                AppRouteGuard,
                MessageService
            ]
        };
    }
}
