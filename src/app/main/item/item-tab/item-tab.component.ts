import { Component, OnInit, Injector } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { IndexCacheComponentBase } from '@shared/app-component-base';
import { ItemComponent } from '../item.component';
import { ItemSettingComponent } from '../item-setting/item-setting.component';
import { ItemCodeFormulaComponent } from '../../item-code-formula/item-code-formula.component';
import { AppPermissions } from '../../../../shared/AppPermissions';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-item-tab',
    templateUrl: './item-tab.component.html',
    styleUrl: './item-tab.component.scss',
    standalone: true,
    imports: [TabViewModule, ItemComponent, ItemSettingComponent, ItemCodeFormulaComponent, NgIf],
})
export class ItemTabComponent extends IndexCacheComponentBase implements OnInit  {

    indexCacheKey: string = 'itemTabCache';

    canViewItem: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.page);
    canViewItemSetting: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.canSetting);
    canViewItemCodeFormula: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.page);

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.initIndexFromCache();
    }
}
