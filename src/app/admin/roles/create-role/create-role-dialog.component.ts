import {
    Component,
    Injector,
    OnInit
} from '@angular/core';
import {
    RoleServiceProxy,
    RoleDto,
    PermissionDto,
    CreateRoleDto,
    PermissionDtoListResultDto
} from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TreeNode } from 'primeng/api';
import { catchError, finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    templateUrl: 'create-role-dialog.component.html',
    providers: [RoleServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, TabViewModule, InputTextModule, AbpValidationSummaryComponent, InputTextareaModule, TreeModule, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateRoleDialogComponent extends DynamicDialogBase implements OnInit {

    saving = false;
    role = new RoleDto();
    selectedNodes: TreeNode<PermissionDto>[] = [];
    nodeItems: TreeNode<PermissionDto>[];   

    constructor(
        injector: Injector,
        private _roleService: RoleServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }
    
    ngOnInit(): void {
        super.ngOnInit();
        this.getPermissions();
    }

    getPermissions() {
        this.saving = true;
        this._roleService
            .getAllPermissions()
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: PermissionDtoListResultDto) => {
                this.mapNode(result.items);
            });
    }


    private mapNode(source: PermissionDto[]) {

        let allNodes: TreeNode<PermissionDto>[] = [];
        let nestedNodes: TreeNode<PermissionDto>[] = [];

        source.map(n => {

            let node: TreeNode<PermissionDto> =
            {
                data: n,
                label: n.displayName,
                expandedIcon: "pi pi-folder-open",
                collapsedIcon: "pi pi-folder",
                children: []
            };

            allNodes.push(node);

            if (n.parent === undefined) {
                node.expanded = true;
                nestedNodes.push(node);
            }
            else {
                var parent = allNodes.find(s => s.data.name == n.parent.name);
                if (parent) parent.children.push(node);
            }
        });

        this.nodeItems = nestedNodes;
        this.selectedNodes = allNodes;
    }
    
    save(): void {
        this.saving = true;

        const role = new CreateRoleDto();
        role.init(this.role);
        role.grantedPermissions = this.selectedNodes.map(n => n.data.name);

        this._roleService
            .create(role)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(result);                    
            });
    }
}
