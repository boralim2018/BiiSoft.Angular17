import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { ItemSettingDto, ItemServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-item-setting',
    templateUrl: './item-setting.component.html',
    styleUrl: './item-setting.component.scss',
    providers: [ItemServiceProxy],
    standalone: true,
    imports: [FormsModule, InputSwitchModule, ButtonModule, ButtonDirective, InputTextModule]
})
export class ItemSettingComponent extends AppComponentBase implements OnInit {

    model: ItemSettingDto;
    saving: boolean;
    loading: boolean = true;;

    constructor(
        injector: Injector,
        public _itemService: ItemServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getModel();
    }

    getModel() {
        this.loading = true;
        this._itemService.getItemSetting()
            .pipe(finalize(() => this.loading = false))
            .subscribe((result) => {
                this.model = result ?? new ItemSettingDto();
            });
    }

    save() {
        this.saving = true;
        this._itemService.createOrUpdateItemSetting(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                if (result && !this.model.id) this.model.id = result;
                this.notify.success(this.l('SavedSuccessfully'));
            });
    }
}
