import { Component, Injector, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { AppComponentBase, NavBarComponentBase } from '../../../shared/app-component-base';
import { Mixin } from 'ts-mixer';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { DividerModule } from 'primeng/divider';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CompanySettingDto, CompanySettingServiceProxy, ContactAddressDto, CreateUpdateBranchInputDto, CreateUpdateCompanyGeneralSettingInputDto, CreateUpdateCompanyAdvanceSettingInputDto } from '../../../shared/service-proxies/service-proxies';
import { appModuleAnimation } from '../../../shared/animations/routerTransition';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { InputTextModule } from 'primeng/inputtext';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { ContactAddressComponent } from '../../../shared/components/contact-address/contact-address.component';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { FormsModule } from '@angular/forms';
import { AppPermissions } from '../../../shared/AppPermissions';
import { FindCountryComponent } from '../../../shared/components/find-country/find-country.component';
import { FindCurrencyComponent } from '../../../shared/components/find-currency/find-currency.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectTimezoneComponent } from '../../../shared/components/select-timezone/select-timezone.component';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrl: './company.component.scss',
    animations: [appModuleAnimation()],
    providers: [CompanySettingServiceProxy],
    standalone: true,
    imports: [FormsModule, StepperModule, ButtonModule, OverlayPanelModule,
        TableSettingComponent, DividerModule, NavBarComponent, BusyDirective,
        InputTextModule, AbpValidationSummaryComponent, ContactAddressComponent,
        LocalizePipe, FindCountryComponent, InputSwitchModule, FindCurrencyComponent,
        SelectTimezoneComponent
    ],
})
export class CompanyComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    title: string = this.l('CompanySetup');
    activeStep: number = 0;    
    saving: boolean;

    model: CompanySettingDto;
    branch: CreateUpdateBranchInputDto;
    generalSetting: CreateUpdateCompanyGeneralSettingInputDto;
    advanceSetting: CreateUpdateCompanyAdvanceSettingInputDto;

    regionCountry: any;
    currency: any;

    country: any;
    cityProvince: any;
    khanDistrict: any;
    sangkatCommune: any;
    village: any;

    country2: any;
    cityProvince2: any;
    khanDistrict2: any;
    sangkatCommune2: any;
    village2: any;

    canEdit: boolean = this.isGranted(AppPermissions.pages.company.edit);

    constructor(
        injector: Injector,
        private _companySettingService: CompanySettingServiceProxy)
    {
        super(injector);

    }

    ngOnInit() {
        this.setTitle();

        this.getDetail();
    }

    initModel() {
        this.branch = new CreateUpdateBranchInputDto();
        this.branch.billingAddress = new ContactAddressDto();
        this.branch.shippingAddress = new ContactAddressDto();
        this.generalSetting = new CreateUpdateCompanyGeneralSettingInputDto();
        this.advanceSetting = new CreateUpdateCompanyAdvanceSettingInputDto();
    }

    getDetail() {
        this.initModel();
        this.saving = true;
        this._companySettingService
            .getDetail()
            .pipe(
                finalize(() => this.saving = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result: CompanySettingDto | null) => {
                if (result) {
                    this.model = result;

                    if (result.generalSetting) {
                        this.generalSetting.init(result.generalSetting);
                        if (result.generalSetting.countryId) {
                            this.regionCountry = { id: result.generalSetting.countryId, name: result.generalSetting.countryName };
                        }

                        if (result.generalSetting.currencyId) {
                            this.currency = { id: result.generalSetting.currencyId, code: result.generalSetting.currencyCode };
                        }

                    }

                    if (result.branch) {
                        this.branch.init(result.branch);
                        this.setAddressDetails(result.branch.billingAddress, 'country', 'cityProvince', 'khanDistrict', 'sangkatCommune', 'village');
                        this.setAddressDetails(result.branch.shippingAddress, 'country2', 'cityProvince2', 'khanDistrict2', 'sangkatCommune2', 'village2');
                    }
                  
                    if (result.advanceSetting) this.advanceSetting.init(result.advanceSetting);
                }
               
            });
    }

    onRegionCountryChange(event?:any) {
        this.generalSetting.countryId = event?.id;
    }

    private setAddressDetails(address: ContactAddressDto, countryKey: string, cityProvinceKey: string, khanDistrictKey: string, sangkatCommuneKey: string, villageKey: string): void {
        if (address.countryId) this[countryKey] = { id: address.countryId, name: address.countryName };
        if (address.cityProvinceId) this[cityProvinceKey] = { id: address.cityProvinceId, name: address.cityProvinceName };
        if (address.khanDistrictId) this[khanDistrictKey] = { id: address.khanDistrictId, name: address.khanDistrictName };
        if (address.sangkatCommuneId) this[sangkatCommuneKey] = { id: address.sangkatCommuneId, name: address.sangkatCommuneName };
        if (address.villageId) this[villageKey] = { id: address.villageId, name: address.villageName };
    }

    saveProfile(next?): void {
        this.saving = true;

        this._companySettingService.createOrUpdateProfile(this.branch).pipe(
            finalize(() => this.saving = false),
            catchError((err: any) => {
                this.message.error(err.message);
                return of(null); 
            })
        ).subscribe((result: string) => {
            if (!this.branch.id && result) {
                this.branch.id = result;
            }

            if (next) next.emit();
        });
    }

    saveGeneralSetting(next?): void {
        this.saving = true;

        this._companySettingService.createOrUpdateGeneralSetting(this.generalSetting).pipe(
            finalize(() => this.saving = false),
            catchError((err: any) => {
                this.message.error(err.message);
                return of(null);
            })
        ).subscribe((result: number) => {
            if (!this.generalSetting.id && result) {
                this.generalSetting.id = result;
            }

            if (next) next.emit();
        });
    }


    saveAdvanceSetting(next?): void {
        this.saving = true;

        this._companySettingService.createOrUpdateAdvanceSetting(this.advanceSetting).pipe(
            finalize(() => this.saving = false),
            catchError((err: any) => {
                this.message.error(err.message);
                return of(null);
            })
        ).subscribe((result: number) => {
            if (!this.advanceSetting.id && result) {
                this.advanceSetting.id = result;
            }

            if (next) next.emit();
        });
    }
}
