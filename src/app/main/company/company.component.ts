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
import { AppComponentBase, BFileComponentBase, NavBarComponentBase } from '../../../shared/app-component-base';
import { AppPermissions } from '../../../shared/AppPermissions';
import { ContactAddressComponent } from '../../../shared/components/contact-address/contact-address.component';
import { FindCountryComponent } from '../../../shared/components/find-country/find-country.component';
import { FindCurrencyComponent } from '../../../shared/components/find-currency/find-currency.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SelectDateComponent } from '../../../shared/components/select-date/select-date.component';
import { SelectTimezoneComponent } from '../../../shared/components/select-timezone/select-timezone.component';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { SafeUrlPipe } from '../../../shared/pipes/safe-resource-url.pipe';
import { CompanySettingDto, CompanySettingServiceProxy, ContactAddressDto, CreateUpdateBranchInputDto, CreateUpdateCompanyAccountSettingInputDto, CreateUpdateCompanyAdvanceSettingInputDto, CreateUpdateCompanyGeneralSettingInputDto, CreateUpdateTransactionNoSettingInputDto, FindCountryDto, TransactionNoSettingDto, UpdateLogoInput } from '../../../shared/service-proxies/service-proxies';

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
        SelectTimezoneComponent, CalendarModule, DropdownModule, SafeUrlPipe, ButtonDirective, Ripple, MessageModule
    ],
})
export class CompanyComponent extends Mixin(AppComponentBase, NavBarComponentBase, BFileComponentBase) implements OnInit {

    title: string = this.l('CompanySetup');
    activeStep: number = 0;    
    saving: boolean;

    model: CompanySettingDto;
    logo: UpdateLogoInput;
    branch: CreateUpdateBranchInputDto;
    generalSetting: CreateUpdateCompanyGeneralSettingInputDto;
    advanceSetting: CreateUpdateCompanyAdvanceSettingInputDto;
    accountSetting: CreateUpdateCompanyAccountSettingInputDto;
    transactionNos: CreateUpdateTransactionNoSettingInputDto[];
    addressLevels: any[];

    uploadUrl: string = '/CompanyProfile/Upload';
    logoImageUrl: string = this.blankImageUrl;

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
    }

    initModel() {
        this.branch = new CreateUpdateBranchInputDto();
        this.branch.billingAddress = new ContactAddressDto();
        this.branch.shippingAddress = new ContactAddressDto();
        this.generalSetting = new CreateUpdateCompanyGeneralSettingInputDto();
        this.advanceSetting = new CreateUpdateCompanyAdvanceSettingInputDto();
        this.accountSetting = new CreateUpdateCompanyAccountSettingInputDto();
        this.transactionNos = [];
        this.addressLevels = [
            { id: 0, name: `L0 : ${this.l('Country')}` },
            { id: 1, name: `L1 : ${this.l('CityProvince')}` }
        ];

        if (this.feature.isEnabled("App.Setup.Locations.KhanDistricts")) this.addressLevels.push({ id: 2, name: `L2 : ${this.l('KhanDistrict')}` });
        if (this.feature.isEnabled("App.Setup.Locations.SangkatCommunes")) this.addressLevels.push({ id: 3, name: `L3 : ${this.l('SangkatCommune')}` });
        if (this.feature.isEnabled("App.Setup.Locations.Villages")) this.addressLevels.push({ id: 4, name: `L4 : ${this.l('Village')}` });
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
                    if (result.companyLogo.logoId) this.loadLogo();

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
                        this.setAddressDetails(result.branch.billingAddress);
                        this.setAddressDetails(result.branch.shippingAddress);
                    }
                  
                    if (result.advanceSetting) this.advanceSetting.init(result.advanceSetting);

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


    loadLogo() {
        if (this.logo.logoId) {
            this.download(this.logo.logoId, "blob", (result) => {
                this.logoImageUrl = window.URL.createObjectURL(result);
            });
        }
        else {
            this.logoImageUrl = this.blankImageUrl;
        }
    }
    
    fileChange(event: Event) {
        let file = event.currentTarget as HTMLInputElement;
        if (file && file.files.length) {
            this.logoImageUrl = window.URL.createObjectURL(file.files[0]);
        }
    }

    clearUpload(file: HTMLInputElement) {
        file.value = '';
        this.loadLogo();
    }

    uploadLogo(file: HTMLInputElement) {
        if (file && file.files.length) {
            this.upload(file.files[0], 1, (result) => {
                if (result && result.id) {
                    this.logo.logoId = result.id;
                    this.clearUpload(file);
                    this.notify.info(this.l('SavedSuccessfully'));
                }
            })
        }
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
