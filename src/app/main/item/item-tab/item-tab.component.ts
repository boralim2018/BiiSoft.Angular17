import { Component, OnInit, Injector } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AppComponentBase } from '@shared/app-component-base';
import { ItemComponent } from '../item.component';
import { ItemSettingComponent } from '../item-setting/item-setting.component';
import { ItemFieldSettingComponent } from '../item-field-setting/item-field-setting.component';

@Component({
    selector: 'app-item-tab',
    templateUrl: './item-tab.component.html',
    styleUrl: './item-tab.component.scss',
    standalone: true,
    imports: [TabViewModule, ItemComponent, ItemSettingComponent, ItemFieldSettingComponent],
})
export class ItemTabComponent extends AppComponentBase implements OnInit  {

    activeIndex: number;
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
      
    }

}
