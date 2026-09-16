import { JoplinEntityBase } from '../JoplinEntityBase';
import type { JoplinSDK } from '../JoplinSDK';
import type { Control } from '../types';
import type { Note, NoteLoadMatch, NoteListMatch, NoteCreateData, NoteUpdateData, NoteRemoveMatch } from '../JoplinTypes';
declare class NoteEntity extends JoplinEntityBase<Note> {
    constructor(client: JoplinSDK, entopts: any);
    make(this: NoteEntity): NoteEntity;
    load(this: any, reqmatch?: NoteLoadMatch, ctrl?: Control): Promise<NoteEntity>;
    list(this: any, reqmatch?: NoteListMatch, ctrl?: Control): Promise<NoteEntity[]>;
    create(this: any, reqdata?: NoteCreateData, ctrl?: Control): Promise<NoteEntity>;
    update(this: any, reqdata?: NoteUpdateData, ctrl?: Control): Promise<NoteEntity>;
    remove(this: any, reqmatch?: NoteRemoveMatch, ctrl?: Control): Promise<NoteEntity>;
}
export { NoteEntity };
