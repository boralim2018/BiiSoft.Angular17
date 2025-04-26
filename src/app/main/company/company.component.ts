import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Ripple } from 'primeng/ripple';
import { StepperModule } from 'primeng/stepper';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { appModuleAnimation } from '../../../shared/animations/routerTransition';
import { IndexCacheComponentBase, NavBarComponentBase } from '../../../shared/app-component-base';
import { AppPermissions } from '../../../shared/AppPermissions';
import { ContactAddressComponent } from '../../../shared/components/contact-address/contact-address.component';
import { FindCountryComponent } from '../../../shared/components/find-country/find-country.component';
import { FindCurrencyComponent } from '../../../shared/components/find-currency/find-currency.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SelectDateComponent } from '../../../shared/components/select-date/select-date.component';
import { SelectTimezoneComponent } from '../../../shared/components/select-timezone/select-timezone.component';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { AttachFileComponent } from '../../../shared/components/attach-file/attach-file.component';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { SafeUrlPipe } from '../../../shared/pipes/safe-resource-url.pipe';
import { AccountType, AccountTypeFilterInputDto, CompanySettingDto, CompanySettingServiceProxy, ContactAddressDto, CreateUpdateBranchInputDto, CreateUpdateCompanyAccountSettingInputDto, CreateUpdateCompanyAdvanceSettingInputDto, CreateUpdateCompanyGeneralSettingInputDto, CreateUpdateTransactionNoSettingInputDto, FindCountryDto, SubAccountTypeFilterInputDto, TransactionNoSettingDto, UpdateLogoInput } from '../../../shared/service-proxies/service-proxies';
import { AccountTypes, UploadSource } from '../../../shared/AppEnums';
import { AppConsts } from '../../../shared/AppConsts';
import { SelectDigitComponent } from '../../../shared/components/select-digit/select-digit.component';
import { SelectAddressLevelComponent } from '../../../shared/components/select-address-level/select-address-level.component';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';
import { FindChartOfAccountComponent } from '../../../shared/components/find-chart-of-account/find-chart-of-account.component';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrl: './company.component.scss',
    animations: [appModuleAnimation()],
    providers: [CompanySettingServiceProxy],
    standalone: true,
    imports: [
        FormsModule, StepperModule, ButtonModule, OverlayPanelModule, NgIf, NgFor, NgClass,
        TableSettingComponent, DividerModule, NavBarComponent, BusyDirective, TooltipModule,
        InputTextModule, AbpValidationSummaryComponent, ContactAddressComponent, FloatLabelModule,
        LocalizePipe, FindCountryComponent, InputSwitchModule, FindCurrencyComponent, SelectDateComponent,
        SelectTimezoneComponent, CalendarModule, DropdownModule, SafeUrlPipe, ButtonDirective, Ripple,
        MessageModule, AttachFileComponent, SelectDigitComponent, SelectAddressLevelComponent,
        InputTextComponent, FindChartOfAccountComponent
    ],
})
export class CompanyComponent extends Mixin(NavBarComponentBase, IndexCacheComponentBase) implements OnInit {

    indexCacheKey: string = "ComapanyStepCacheKey";
    title: string = this.l('CompanySetup');    
    saving: boolean;

    model: CompanySettingDto;
    logo: UpdateLogoInput;
    branch: CreateUpdateBranchInputDto;
    generalSetting: CreateUpdateCompanyGeneralSettingInputDto;
    advanceSetting: CreateUpdateCompanyAdvanceSettingInputDto;    
    transactionNos: CreateUpdateTransactionNoSettingInputDto[];

    accountSetting: CreateUpdateCompanyAccountSettingInputDto;
    apAccount: any;
    arAccount: any;
    purchaseDiscountAccount: any;
    saleDiscountAccount: any;
    inventoryPurchaseAccount: any;
    billPaymentAccount: any;
    receivePaymentAccount: any;
    retainEarningAccount: any;
    exchangeLossGainAccount: any;
    itemReceiptAccount: any;
    itemIssueAccount: any;
    itemAdjustmentAccount: any;
    itemTransferAccount: any;
    itemProductionAccount: any;
    itemExchangeAccount: any;
    cashTransferAccount: any;
    cashExchangeAccount: any;

    apAccountTypeFilter: AccountTypeFilterInputDto;
    arAccountTypeFilter: AccountTypeFilterInputDto;
    cashBankAccountTypeFilter: AccountTypeFilterInputDto;
    revenueExpenseAccountTypeFilter: AccountTypeFilterInputDto;
    currentAssetAccountTypeFilter: AccountTypeFilterInputDto;
    equityAccountTypeFilter: AccountTypeFilterInputDto;
    retainEarningSubAccountTypeFilter: SubAccountTypeFilterInputDto;

    blankImageUrl: string = AppConsts.blankLogoUrl;
    uploadUrl: string = '/CompanyProfile/Upload';
    uploadSource: number = UploadSource.CompanyLogo; 

    regionCountry: any;
    currency: any;
    businessStartDate: Date | undefined;
    customTransactionNoEnable: boolean;
    requiredReference: boolean;
    prefixMessage: string = "Prefix Format: Y is 2 digits of current year, YY is full year. eg. if current year is 2024, INVY => INV24, INVYY => INV2024.";
    
    canEdit: boolean = this.isGranted(AppPermissions.pages.company.edit);

    constructor(
        injector: Injector,
        private _companySettingService: CompanySettingServiceProxy)
    {
        super(injector);

    }

    ngOnInit() {
        this.setTitle();
        this.initModel();
        this.getDetail();
        this.initIndexFromCache();
    }

    initModel() {
        this.logo = new UpdateLogoInput();
        this.branch = new CreateUpdateBranchInputDto();
        this.branch.billingAddress = new ContactAddressDto();
        this.branch.shippingAddress = new ContactAddressDto();
        this.generalSetting = new CreateUpdateCompanyGeneralSettingInputDto();
        this.advanceSetting = new CreateUpdateCompanyAdvanceSettingInputDto();
        this.accountSetting = new CreateUpdateCompanyAccountSettingInputDto();
        this.transactionNos = [];

        this.apAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.AccountPayable], exclude: false });
        this.arAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.AccountReceivable], exclude: false });
        this.cashBankAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Cash, AccountTypes.Bank], exclude: false });
        this.revenueExpenseAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Revenue, AccountTypes.OtherRevenue, AccountTypes.CostOfSale, AccountTypes.Expense, AccountTypes.OtherExpense], exclude: false });
        this.currentAssetAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.CurrentAsset], exclude: false });
        this.equityAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Equity], exclude: false });
        this.retainEarningSubAccountTypeFilter = new SubAccountTypeFilterInputDto({ ids: [3013], exclude: false });
    }

    getDetail() {        
        this.saving = true;
        this._companySettingService
            .getDetail()
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: CompanySettingDto | null) => {
                if (result) {
                    this.model = result;

                    this.logo = result.companyLogo;

                    if (result.generalSetting) {
                        this.generalSetting.init(result.generalSetting);

                        if (result.generalSetting.countryId) {
                            this.regionCountry = { id: result.generalSetting.countryId, name: result.generalSetting.countryName };
                        }

                        if (result.generalSetting.currencyId) {
                            this.currency = { id: result.generalSetting.currencyId, code: result.generalSetting.currencyCode };
                        }

                        if (result.generalSetting.businessStartDate) this.businessStartDate = result.generalSetting.businessStartDate.toDate();
                    }

                    if (result.branch) {
                        this.branch.init(result.branch);
                        this.setAddressDetails(this.branch.billingAddress);
                        this.setAddressDetails(this.branch.shippingAddress);
                    }
                  
                    if (result.advanceSetting) this.advanceSetting.init(result.advanceSetting);

                    if (result.accountSetting) {
                        this.accountSetting.init(result.accountSetting);
                        if (result.accountSetting.defaultAPAccountId) this.apAccount = { id: result.accountSetting.defaultAPAccountId, name: result.accountSetting.defaultAPAccountName };
                        if (result.accountSetting.defaultARAccountId) this.arAccount = { id: result.accountSetting.defaultARAccountId, name: result.accountSetting.defaultARAccountName };
                        if (result.accountSetting.defaultSaleDiscountAccountId) this.saleDiscountAccount = { id: result.accountSetting.defaultSaleDiscountAccountId, name: result.accountSetting.defaultSaleDiscountAccountName };
                        if (result.accountSetting.defaultPurchaseDiscountAccountId) this.purchaseDiscountAccount = { id: result.accountSetting.defaultPurchaseDiscountAccountId, name: result.accountSetting.defaultPurchaseDiscountAccountName };
                        if (result.accountSetting.defaultInventoryPurchaseAccountId) this.inventoryPurchaseAccount = { id: result.accountSetting.defaultInventoryPurchaseAccountId, name: result.accountSetting.defaultInventoryPurchaseAccountName };
                        if (result.accountSetting.defaultBillPaymentAccountId) this.billPaymentAccount = { id: result.accountSetting.defaultBillPaymentAccountId, name: result.accountSetting.defaultBillPaymentAccountName };
                        if (result.accountSetting.defaultReceivePaymentAccountId) this.receivePaymentAccount = { id: result.accountSetting.defaultReceivePaymentAccountId, name: result.accountSetting.defaultReceivePaymentAccountName };
                        if (result.accountSetting.defaultRetainEarningAccountId) this.retainEarningAccount = { id: result.accountSetting.defaultRetainEarningAccountId, name: result.accountSetting.defaultRetainEarningAccountName };
                        if (result.accountSetting.defaultExchangeLossGainAccountId) this.exchangeLossGainAccount = { id: result.accountSetting.defaultExchangeLossGainAccountId, name: result.accountSetting.defaultExchangeLossGainAccountName };
                        if (result.accountSetting.defaultItemReceiptAccountId) this.itemReceiptAccount = { id: result.accountSetting.defaultItemReceiptAccountId, name: result.accountSetting.defaultItemReceiptAccountName };
                        if (result.accountSetting.defaultItemIssueAccountId) this.itemIssueAccount = { id: result.accountSetting.defaultItemIssueAccountId, name: result.accountSetting.defaultItemIssueAccountName };
                        if (result.accountSetting.defaultItemAdjustmentAccountId) this.itemAdjustmentAccount = { id: result.accountSetting.defaultItemAdjustmentAccountId, name: result.accountSetting.defaultItemAdjustmentAccountName };
                        if (result.accountSetting.defaultItemTransferAccountId) this.itemTransferAccount = { id: result.accountSetting.defaultItemTransferAccountId, name: result.accountSetting.defaultItemTransferAccountName };
                        if (result.accountSetting.defaultItemProductionAccountId) this.itemProductionAccount = { id: result.accountSetting.defaultItemProductionAccountId, name: result.accountSetting.defaultItemProductionAccountName };
                        if (result.accountSetting.defaultItemExchangeAccountId) this.itemExchangeAccount = { id: result.accountSetting.defaultItemExchangeAccountId, name: result.accountSetting.defaultItemExchangeAccountName };
                        if (result.accountSetting.defaultCashTransferAccountId) this.cashTransferAccount = { id: result.accountSetting.defaultCashTransferAccountId, name: result.accountSetting.defaultCashTransferAccountName };
                        if (result.accountSetting.defaultCashExchangeAccountId) this.cashExchangeAccount = { id: result.accountSetting.defaultCashExchangeAccountId, name: result.accountSetting.defaultCashExchangeAccountName };
                    }

                    if (result.transactionNoSettings) {
                        let customAll = true;
                        let requiredAll = true;
                        result.transactionNoSettings.map(t => {
                            let tran = new CreateUpdateTransactionNoSettingInputDto();
                            tran.init(t);
                            tran['journalTypeName'] = t.journalTypeName;
                            this.transactionNos.push(tran);

                            if (!t.customTransactionNoEnable) customAll = false;
                            if (!t.requiredReference) requiredAll = false;
                        });

                        this.customTransactionNoEnable = customAll;
                        this.requiredReference = requiredAll;
                    }
                }
               
            });
    }

    onRegionCountryChange(event?: FindCountryDto) {
        this.generalSetting.countryId = event?.id;

        if (event?.currencyId) {
            this.generalSetting.currencyId = event.currencyId;
            this.currency = { id: event.currencyId, code: event.currencyCode };
        }
    }

    private setAddressDetails(address: ContactAddressDto): void {
        if (address.countryId) address['country'] = { id: address.countryId, name: address.countryName };
        if (address.cityProvinceId) address['cityProvince'] = { id: address.cityProvinceId, name: address.cityProvinceName };
        if (address.khanDistrictId) address['khanDistrict'] = { id: address.khanDistrictId, name: address.khanDistrictName };
        if (address.sangkatCommuneId) address['sangkatCommune'] = { id: address.sangkatCommuneId, name: address.sangkatCommuneName };
        if (address.villageId) address['village'] = { id: address.villageId, name: address.villageName };
    }

    saveProfile(next?): void {
        this.saving = true;

        this._companySettingService.createOrUpdateProfile(this.branch)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: string) => {
                if (!this.branch.id && result) {
                    this.branch.id = result;
                }

                if (next) next.emit();
                this.notify.info(this.l('SavedSuccessfully'));
            });
    }

    saveGeneralSetting(next?): void {
        this.saving = true;

        this.generalSetting.businessStartDate = !this.businessStartDate ? undefined : moment(this.businessStartDate);

        this._companySettingService.createOrUpdateGeneralSetting(this.generalSetting)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: number) => {
                if (!this.generalSetting.id && result) {
                    this.generalSetting.id = result;
                }

                if (next) next.emit();
                this.notify.info(this.l('SavedSuccessfully'));
            });
    }


    saveAdvanceSetting(next?): void {
        this.saving = true;

        this._companySettingService.createOrUpdateAdvanceSetting(this.advanceSetting)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: number) => {
                if (!this.advanceSetting.id && result) {
                    this.advanceSetting.id = result;
                }

                if (next) next.emit();
                this.notify.info(this.l('SavedSuccessfully'));
            });
    }

    saveAccountSetting(next?): void {
        this.saving = true;

        this._companySettingService.createOrUpdateAccountSetting(this.accountSetting)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: number) => {
                if (!this.accountSetting.id && result) {
                    this.accountSetting.id = result;
                }
                
                if (next) next.emit();
                this.notify.info(this.l('SavedSuccessfully'));
            });
    }

    saveTransactionNos(next?): void {
        this.saving = true;

        this._companySettingService.createOrUpdateTransactionNoSetting(this.transactionNos)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                if (result && result.length) {
                    result.map(t => {
                        let find = this.transactionNos.find(f => f.journalType == t.value);
                        if (find) find.id = t.name;
                    })
                }

                if (next) next.emit();
                this.notify.info(this.l('SavedSuccessfully'));
            });
    }

    getTransactionNoFormat(t: TransactionNoSettingDto) : string {
        if (!t || t.customTransactionNoEnable) return '';
               
        let prefix = t.prefix ? this.replaceYearInPrefix(t.prefix) : '';
        let format = t.start.toString().padStart(t.digits, '0');

        return `${prefix}${format}`;
    }

    private replaceYearInPrefix(prefix: string): string {
        const currentDate = new Date();
        const fullYear = currentDate.getFullYear();
        const twoDigitYear = fullYear % 100;

        // Convert years to strings for replacement
        const twoDigitYearStr = twoDigitYear.toString().padStart(2, '0');
        const fullYearStr = fullYear.toString();

        // Replace 'y' with two-digit year and 'Y' with full year
        let result = prefix
            .replace(/YY/g, fullYearStr)
            .replace(/Y/g, twoDigitYearStr);            

        return result;
    }

    customTransactionNoEnableChange(event) {
        if (!this.transactionNos) return;

        this.transactionNos.map(m => m.customTransactionNoEnable = event.checked);
    }

    requiredReferenceChange(event) {
        if (!this.transactionNos) return;

        this.transactionNos.map(m => m.requiredReference = event.checked);
    }

}
