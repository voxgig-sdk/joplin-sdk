import { JoplinEntityBase } from '../JoplinEntityBase';
import type { JoplinSDK } from '../JoplinSDK';
import type { Control } from '../types';
import type { Folder, FolderLoadMatch, FolderListMatch, FolderCreateData, FolderUpdateData, FolderRemoveMatch } from '../JoplinTypes';
declare class FolderEntity extends JoplinEntityBase<Folder> {
    constructor(client: JoplinSDK, entopts: any);
    make(this: FolderEntity): FolderEntity;
    load(this: any, reqmatch?: FolderLoadMatch, ctrl?: Control): Promise<FolderEntity>;
    list(this: any, reqmatch?: FolderListMatch, ctrl?: Control): Promise<FolderEntity[]>;
    create(this: any, reqdata?: FolderCreateData, ctrl?: Control): Promise<FolderEntity>;
    update(this: any, reqdata?: FolderUpdateData, ctrl?: Control): Promise<FolderEntity>;
    remove(this: any, reqmatch?: FolderRemoveMatch, ctrl?: Control): Promise<FolderEntity>;
}
export { FolderEntity };
