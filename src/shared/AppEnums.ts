import { AccountType, ItemType, TenantAvailabilityState } from '@shared/service-proxies/service-proxies';


export class AppTenantAvailabilityState {
    static readonly Available: number = TenantAvailabilityState._1;
    static readonly InActive: number = TenantAvailabilityState._2;
    static readonly NotFound: number = TenantAvailabilityState._3;
}

export class ColumnType {
    static readonly Text : number = 1;
    static readonly DateTime : number = 2;
    static readonly Number : number = 3;
    static readonly Bool : number = 4;
    static readonly Date : number = 5;
    static readonly CheckBox : number = 6;
    static readonly WrapText : number = 7;
    static readonly Lookup : number = 8;
    static readonly List : number = 9;
}

export class CellFormat {
    static readonly Default : number = 0;
    static readonly Number : number = 1;
    static readonly Percentage : number = 2;
    static readonly Accouting : number = 3;
}

export class UploadSource {
    static readonly Attachment : number = 0;
    static readonly CompanyLogo : number = 1;
    static readonly UserProfile : number = 2;
    static readonly Item : number = 3;
    static readonly FormTemplate : number = 4;
}

export class ItemTypes {
    static readonly Service : number = ItemType._1;
    static readonly Menu : number = ItemType._2;
    static readonly NonInventory : number = ItemType._3;
    static readonly Inventory : number = ItemType._4;
    static readonly Asset : number = ItemType._5;
    static readonly Bundle : number = ItemType._6;
}

export const enum AccountTypeFilter {
    CashBank = 1,
    AR = 2,
    Inventory = 3,
    CurrentAsset = 4,
    FixedAsset = 5,
    NoneCurrentAsset = 6,
    AP = 7,
    CreditCard = 8,
    CurrentLiability = 9,
    NoneCurrentLiability = 10,
    Equity = 11,
    RetainedEarning = 12,
    Revenue = 13,
    COGS = 14,
    Expense = 15,
    COGSExpense = 16,
    RevenueCOGSExpense = 17,
}

export class AccountTypes {
    static readonly Cash : number = AccountType._10;
    static readonly Bank : number = AccountType._11;
    static readonly AccountReceivable : number = AccountType._12;
    static readonly Inventory : number = AccountType._13;
    static readonly CurrentAsset : number = AccountType._14;
    static readonly FixedAsset : number = AccountType._15;
    static readonly NoneCurrentAsset : number = AccountType._16;
    static readonly AccountPayable : number = AccountType._20;
    static readonly CreditCard : number = AccountType._21;
    static readonly CurrentLiability : number = AccountType._22;
    static readonly NoneCurrentLiability : number = AccountType._23;
    static readonly Equity : number = AccountType._30;
    static readonly Revenue : number = AccountType._40;
    static readonly OtherRevenue : number = AccountType._41;
    static readonly CostOfSale : number = AccountType._50;
    static readonly Expense : number = AccountType._51;
    static readonly OtherExpense : number = AccountType._52
}
export class SubAccountTypes {
    static readonly CashOnHand : number = 1000;
    static readonly CashEquivalent : number = 1001;
    static readonly ClientTrustAccount : number = 1002;
    static readonly MoneyMarket : number = 1003;
    static readonly RentsHeldInTrust : number = 1004;

    static readonly Bank : number = 1100;
    static readonly Saving : number = 1101;

    static readonly AccountReceivable : number = 1200;

    static readonly Inventory : number = 1300;

    static readonly AssetAvailableForSale : number = 1400;
    static readonly DevelopmentCost : number = 1401;
    static readonly EmployeeCashAdvance : number = 1402;
    static readonly InvestmentOther : number = 1403;
    static readonly LoansToOfficer : number = 1404;
    static readonly LoansToOther : number = 1405;
    static readonly LoansToShareholder : number = 1406;
    static readonly PrepaidExpense : number = 1407;
    static readonly Retainage : number = 1408;
    static readonly UndepositedFund : number = 1409;
    static readonly AllowanceForBadDebt : number = 1410;
    static readonly OtherCurrentAsset : number = 1411;

    static readonly Building : number = 1500;
    static readonly Land : number = 1501;
    static readonly Vehicle : number = 1502;
    static readonly MachinaryAndEquipment : number = 1503;
    static readonly FurnitureAndFixture : number = 1504;
    static readonly DepletableAsset : number = 1505;
    static readonly LeaseholdImprovement : number = 1506;
    static readonly AccumulatedDepletion : number = 1507;
    static readonly AccumulatedDepreciation : number = 1508;
    static readonly OtherFixedAsset : number = 1509;

    static readonly AssetHeldForSale : number = 1600;
    static readonly DefferedTax : number = 1601;
    static readonly Goodwill : number = 1602;
    static readonly IntangibleAsset : number = 1603;
    static readonly LeaseBuyout : number = 1604;
    static readonly Licence : number = 1605;
    static readonly LongTermInvestment : number = 1606;
    static readonly OrganazationalCost : number = 1607;
    static readonly SecurityDeposti : number = 1608;
    static readonly AccumulatedAmotization : number = 1609;
    static readonly OtherNoneCurrentAsset : number = 1610;

    static readonly AccountPayable : number = 2000;

    static readonly CreditCard : number = 2100;

    static readonly DividentPayable : number = 2200;
    static readonly InsurancePayable : number = 2201;
    static readonly LoanPayable : number = 2202;
    static readonly PrepaidExpensePayable : number = 2203;
    static readonly IncomeTaxPayable : number = 2204;
    static readonly SaleAndServiceTaxPayable : number = 2205;
    static readonly LineOfCredit : number = 2206;
    static readonly PayrollClearing : number = 2207;
    static readonly PayrollLiability : number = 2208;
    static readonly AccruedLiability : number = 2209;
    static readonly CurrentPotionOfObligationUnderFinanceLease : number = 2210;
    static readonly CurrentTaxLiability : number = 2211;
    static readonly ClientTrustAccountLiability : number = 2212;
    static readonly RentInTrustLiability : number = 2213;
    static readonly OtherCurrentLiability : number = 2214;

    static readonly NotePayable : number = 2300;
    static readonly ShareholderNotePayable : number = 2301;
    static readonly AccruedHolidayPayable : number = 2302;
    static readonly LongTermDebt : number = 2303;
    static readonly LiabilityRelatedToAssetHeldForSale : number = 2304;
    static readonly AccruedNoneCurrentLiability : number = 2305;
    static readonly OtherNoneCurrentLiability : number = 2306;

    static readonly OpeningBalanceEquity : number = 3000;
    static readonly OwnersEquity : number = 3001;
    static readonly PartnersEquity : number = 3002;
    static readonly PartnerContribution : number = 3003;
    static readonly PartnerDistribution : number = 3004;
    static readonly DividendDisbursed : number = 3005;
    static readonly ShareCapital : number = 3006;
    static readonly OrdinaryShare : number = 3007;
    static readonly PreferredShare : number = 3008;
    static readonly TreasuryShare : number = 3009;
    static readonly AccumulatedAdjustment : number = 3010;
    static readonly OtherComprehensiveIncome : number = 3011;
    static readonly PaidInCapitalOrSurplus : number = 3012;
    static readonly RetainedEarning : number = 3013;
    static readonly EquityInEarningOfSubsidiaries : number = 3014;

    static readonly SaleOfProductIncome : number = 4000;
    static readonly ServiceFeeIncome : number = 4001;
    static readonly SaleRetail : number = 4002;
    static readonly SaleWholesale : number = 4003;
    static readonly GeneralRevenue : number = 4004;
    static readonly OtherPrimaryIncome : number = 4005;
    static readonly NonProfitIncome : number = 4006;
    static readonly DiscountOrRefundGiven : number = 4007;
    static readonly UnappliedCashPaymentIncome : number = 4008;

    static readonly DividendIncome : number = 4100;
    static readonly InterestEarned : number = 4101;
    static readonly OtherInvestmentIncome : number = 4102;
    static readonly OtherOperatingIncome : number = 4103;
    static readonly OtherMiscellaneousIncome : number = 4104;
    static readonly TaxExemptInterest : number = 4105;
    static readonly LossOnDisposalOfAsset : number = 4106;
    static readonly UnrealisedLossOnSecurityNetOfTax : number = 4107;

    static readonly LaborCost : number = 5000;
    static readonly SuppliesAndMaterialsCost : number = 5001;
    static readonly EquipmentRentalCost : number = 5002;
    static readonly FreightAndDeliveryCost : number = 5003;
    static readonly OtherCostOfSale : number = 5004;


    static readonly AdministrativeExpense : number = 5100;
    static readonly AdvertisingPromotional : number = 5101;
    static readonly AmortizationExpense : number = 5102;
    static readonly Auto : number = 5103;
    static readonly BadDebt : number = 5104;
    static readonly BankCharge : number = 5105;
    static readonly CharitableContribution : number = 5106;
    static readonly CommisionAndFee : number = 5107;
    static readonly LaborExpense : number = 5108;
    static readonly DueAndSubscription : number = 5109;
    static readonly EquipmentRental : number = 5110;
    static readonly FinanceCost : number = 5111;
    static readonly IncomeTaxExpense : number = 5112;
    static readonly Insurance : number = 5113;
    static readonly InterestPaid : number = 5114;
    static readonly LegalAndProfessionalFee : number = 5115;
    static readonly LossOnDiscontinuedOperationNetOfTax : number = 5116;
    static readonly ManagementCompensation : number = 5117;
    static readonly MealAndEntertai : number = 5118;
    static readonly OtherMiscelleneousServiceCost : number = 5119;
    static readonly OtherSellingExpense : number = 5120;
    static readonly PayrollExpense : number = 5121;
    static readonly RentOrLeaseOfBuilding : number = 5122;
    static readonly RepairAndMaintenance : number = 5123;
    static readonly ShipingAndDeliveryExpense : number = 5124;
    static readonly SuppliesAndMaterials : number = 5125;
    static readonly TaxPaid : number = 5126;
    static readonly TravelGeneralAndAdminExpense : number = 5127;
    static readonly TravelSellExpense : number = 5128;
    static readonly UnappliedCashBillPaymentExpense : number = 5129;
    static readonly Utilities : number = 5130;

    static readonly Amortization : number = 5200;
    static readonly Depreciation : number = 5201;
    static readonly ExchangeLossGain : number = 5202;
    static readonly PenaltiesAndSettlements : number = 5203;
    static readonly OtherExpense : number = 5204;
}
