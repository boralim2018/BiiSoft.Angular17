import { AccountType, ItemType, TenantAvailabilityState } from '@shared/service-proxies/service-proxies';


export class AppTenantAvailabilityState {
    static readonly Available: number = TenantAvailabilityState._1;
    static readonly InActive: number = TenantAvailabilityState._2;
    static readonly NotFound: number = TenantAvailabilityState._3;
}
export class ColumnType {
    static readonly Text: number = 1;
    static readonly DateTime: number = 2;
    static readonly Number: number = 3;
    static readonly Bool: number = 4;
    static readonly Date: number = 5;
    static readonly CheckBox: number = 6;
    static readonly WrapText: number = 7;
    static readonly Lookup: number = 8;
    static readonly List: number = 9;
}

export class CellFormat {
    static readonly Default: number = 0;
    static readonly Number: number = 1;
    static readonly Percentage: number = 2;
    static readonly Accouting: number = 3;
}

export class UploadSource {
    static readonly Attachment: number = 0;
    static readonly CompanyLogo: number = 1;
    static readonly UserProfile: number = 2;
    static readonly Item: number = 3;
    static readonly FormTemplate: number = 4;
}

export class AccountTypes {
    static readonly Cash: number = AccountType._10;
    static readonly Bank: number = AccountType._11;
    static readonly AccountReceivable: number = AccountType._12;
    static readonly Inventory: number = AccountType._13;
    static readonly CurrentAsset: number = AccountType._14;
    static readonly FixedAsset: number = AccountType._15;
    static readonly NoneCurrentAsset: number = AccountType._16;
    static readonly AccountPayable: number = AccountType._20;
    static readonly CreditCard: number = AccountType._21;
    static readonly CurrentLiability: number = AccountType._22;
    static readonly NoneCurrentLiability: number = AccountType._23;
    static readonly Equity: number = AccountType._30;
    static readonly Revenue: number = AccountType._40;
    static readonly OtherRevenue: number = AccountType._41;
    static readonly CostOfSale: number = AccountType._50;
    static readonly Expense: number = AccountType._51;
    static readonly OtherExpense: number = AccountType._52
}

export class ItemTypes {
    static readonly Service: number = ItemType._1;
    static readonly Menu: number = ItemType._2;
    static readonly NonInvnetory: number = ItemType._3;
    static readonly Inventory: number = ItemType._4;
    static readonly Asset: number = ItemType._5;
    static readonly Bundle: number = ItemType._6;
}
