import { JoplinEntityBase } from '../JoplinEntityBase';
import type { JoplinSDK } from '../JoplinSDK';
import type { Control } from '../types';
import type { Tag, TagLoadMatch, TagListMatch, TagCreateData, TagUpdateData, TagRemoveMatch } from '../JoplinTypes';
declare class TagEntity extends JoplinEntityBase<Tag> {
    constructor(client: JoplinSDK, entopts: any);
    make(this: TagEntity): TagEntity;
    load(this: any, reqmatch?: TagLoadMatch, ctrl?: Control): Promise<TagEntity>;
    list(this: any, reqmatch?: TagListMatch, ctrl?: Control): Promise<TagEntity[]>;
    create(this: any, reqdata?: TagCreateData, ctrl?: Control): Promise<TagEntity>;
    update(this: any, reqdata?: TagUpdateData, ctrl?: Control): Promise<TagEntity>;
    remove(this: any, reqmatch?: TagRemoveMatch, ctrl?: Control): Promise<TagEntity>;
}
export { TagEntity };
