import {
    Component,
    Injector,
    OnInit
} from '@angular/core';
import {
    UserServiceProxy,
    PermissionDto,
    GetUserPermissionsForEditOutput,
    UpdateUserPermissionsInput,
    Int64EntityDto,
} from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TreeNode } from 'primeng/api';
import { catchError, finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    templateUrl: 'change-permissions-dialog.component.html',
    providers: [UserServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, TreeModule, ButtonDirective, Ripple, LocalizePipe]
})
export class ChangePermissionsDialogComponent extends DynamicDialogBase implements OnInit {

    saving = false;
    selectedNodes: TreeNode<PermissionDto>[] = [];
    nodeItems: TreeNode<PermissionDto>[];   

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }
    
    ngOnInit(): void {
        super.ngOnInit();
        this.getPermissions();
    }

    getPermissions() {
        this.saving = true;
        this._userService
            .getUserPermissionsForEdit(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: GetUserPermissionsForEditOutput) => {
                this.mapNode(result.permissions, result.grantedPermissionNames);
            });
    }


    private mapNode(source: PermissionDto[], selected: string[]) {

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
        this.selectedNodes = allNodes.filter(f => selected.find(s => s === f.data.name) !== undefined);
    }
    
    save(): void {
        this.saving = true;

        const input = new UpdateUserPermissionsInput();
        input.id = this._dialogConfig.data.id;
        input.grantedPermissionNames = this.selectedNodes.map(n => n.data.name);

        this._userService
            .updateUserPermissions(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(result);                    
            });
    }

    resetPermissions(): void {
        let input = new Int64EntityDto();

        input.id = this._dialogConfig.data.id;

        this.saving = true;
        this._userService.resetUserSpecificPermissions(input).subscribe({
            next: () => {
                this.notify.info(this.l('ResetSuccessfully'));
                this.getPermissions();
            },
            complete: () => {
                this.saving = false;
            },
        });
    }
}
