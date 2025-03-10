import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { ItemFieldSettingDto, ItemServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-item-field-setting',
    templateUrl: './item-field-setting.component.html',
    styleUrl: './item-field-setting.component.scss',
    providers: [ItemServiceProxy],
    standalone: true,
    imports: [FormsModule, InputSwitchModule, ButtonModule, ButtonDirective],
})
export class ItemFieldSettingComponent extends AppComponentBase implements OnInit {

    model: ItemFieldSettingDto;
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
        this._itemService.getItemFieldSetting()
            .pipe(finalize(() => this.loading = false))
            .subscribe((result) => {
                this.model = result ?? new ItemFieldSettingDto();
            });
    }

    save() {
        this.saving = true;
        this._itemService.createOrUpdateItemFieldSetting(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                if (result && !this.model.id) this.model.id = result;
                this.notify.success(this.l('SavedSuccessfully'));
            });
    }
}
