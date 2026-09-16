import { FolderEntity } from './entity/FolderEntity';
import { NoteEntity } from './entity/NoteEntity';
import { TagEntity } from './entity/TagEntity';
export type * from './JoplinTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { JoplinEntityBase } from './JoplinEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class JoplinSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Folder(entopts?: Record<string, any>): FolderEntity;
    Note(entopts?: Record<string, any>): NoteEntity;
    Tag(entopts?: Record<string, any>): TagEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): JoplinSDK;
    tester(testopts?: any, sdkopts?: any): JoplinSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof JoplinSDK;
export { stdutil, config, BaseFeature, JoplinEntityBase, JoplinSDK, SDK, };
