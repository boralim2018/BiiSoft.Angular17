import { TenantAvailabilityState } from '@shared/service-proxies/service-proxies';


export class AppTenantAvailabilityState {
    static Available: number = TenantAvailabilityState._1;
    static InActive: number = TenantAvailabilityState._2;
    static NotFound: number = TenantAvailabilityState._3;
}
export class ColumnType {
    static Text: number = 1;
    static DateTime: number = 2;
    static Number: number = 3;
    static Bool: number = 4;
    static Date: number = 5;
    static CheckBox: number = 6;
    static WrapText: number = 7;
}

export class CellFormat {
    static Default: number = 0;
    static Number: number = 1;
    static Percentage: number = 2;
    static Accouting: number = 3;
}
