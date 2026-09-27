"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('NoteEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when JOPLIN_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('JOPLIN_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.JoplinSDK.test();
        const ent = testsdk.Note();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.JOPLIN_TEST_LIVE;
        for (const op of ['create', 'list', 'update', 'load', 'remove']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'note.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "altitude": { "a": true, "h": "Altitude", "n": "altitude", "r": false, "t": "`$NUMBER`", "key$": "altitude", "index$": 0 }, "author": { "a": true, "h": "Author", "n": "author", "r": false, "t": "`$STRING`", "key$": "author", "index$": 1 }, "body": { "a": true, "h": "Body", "n": "body", "r": false, "sh": "The note body, in Markdown.", "t": "`$STRING`", "key$": "body", "index$": 2 }, "created_time": { "a": true, "h": "Created Time", "n": "created_time", "r": false, "sh": "When the note was created.", "t": "`$INTEGER`", "key$": "created_time", "index$": 3 }, "id": { "a": true, "h": "Id", "n": "id", "r": false, "t": "`$STRING`", "key$": "id", "index$": 4 }, "is_conflict": { "a": true, "h": "Is Conflict", "n": "is_conflict", "r": false, "sh": "Tells whether the note is a conflict or not.", "t": "`$INTEGER`", "key$": "is_conflict", "index$": 5 }, "is_todo": { "a": true, "h": "Is Todo", "n": "is_todo", "r": false, "sh": "Tells whether this note is a to-do or not.", "t": "`$INTEGER`", "key$": "is_todo", "index$": 6 }, "latitude": { "a": true, "h": "Latitude", "n": "latitude", "r": false, "t": "`$NUMBER`", "key$": "latitude", "index$": 7 }, "longitude": { "a": true, "h": "Longitude", "n": "longitude", "r": false, "t": "`$NUMBER`", "key$": "longitude", "index$": 8 }, "markup_language": { "a": true, "h": "Markup Language", "n": "markup_language", "r": false, "sh": "1 for Markdown, 2 for HTML.", "t": "`$INTEGER`", "key$": "markup_language", "index$": 9 }, "parent_id": { "a": true, "h": "Parent Id", "n": "parent_id", "r": false, "sh": "ID of the notebook that contains this note.", "t": "`$STRING`", "key$": "parent_id", "index$": 10 }, "source_url": { "a": true, "h": "Source Url", "n": "source_url", "r": false, "sh": "The full URL where the note comes from.", "t": "`$STRING`", "key$": "source_url", "index$": 11 }, "title": { "a": true, "h": "Title", "n": "title", "r": false, "sh": "The note title.", "t": "`$STRING`", "key$": "title", "index$": 12 }, "todo_completed": { "a": true, "h": "Todo Completed", "n": "todo_completed", "r": false, "sh": "When the to-do was completed.", "t": "`$INTEGER`", "key$": "todo_completed", "index$": 13 }, "todo_due": { "a": true, "h": "Todo Due", "n": "todo_due", "r": false, "sh": "When the to-do is due.", "t": "`$INTEGER`", "key$": "todo_due", "index$": 14 }, "updated_time": { "a": true, "h": "Updated Time", "n": "updated_time", "r": false, "sh": "When the note was last updated.", "t": "`$INTEGER`", "key$": "updated_time", "index$": 15 }, "user_created_time": { "a": true, "h": "User Created Time", "n": "user_created_time", "r": false, "sh": "When the note was created.", "t": "`$INTEGER`", "key$": "user_created_time", "index$": 16 }, "user_updated_time": { "a": true, "h": "User Updated Time", "n": "user_updated_time", "r": false, "sh": "When the note was last updated.", "t": "`$INTEGER`", "key$": "user_updated_time", "index$": 17 } }, "id": { "field": "id", "name": "id" }, "name": "note", "op": { "create": { "input": "data", "name": "create", "points": [{ "a": true, "co": { "id": "POST /notes", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "POST", "o": "/notes", "q": {}, "r": {}, "s": [{ "lit": "notes" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "create" }, "list": { "input": "data", "name": "list", "points": [{ "a": true, "co": { "id": "GET /notes", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "field", "or": "field", "r": false, "t": "`$STRING`", "index$": 0 }, { "a": true, "k": "query", "n": "order_by", "or": "order_by", "r": false, "t": "`$STRING`", "index$": 1 }, { "a": true, "k": "query", "n": "order_dir", "or": "order_dir", "r": false, "t": "`$STRING`", "index$": 2 }, { "a": true, "ex": 1, "k": "query", "n": "page", "or": "page", "r": false, "t": "`$INTEGER`", "index$": 3 }] }, "k": "http", "m": "GET", "o": "/notes", "q": { "exist": ["field", "order_by", "order_dir", "page"] }, "r": {}, "s": [{ "lit": "notes" }], "t": { "req": "`reqdata`", "res": "`body.items`" }, "index$": 0 }, { "a": true, "co": { "id": "GET /notes/{id}/tags", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }], "query": [{ "a": true, "k": "query", "n": "field", "or": "field", "r": false, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/notes/{id}/tags", "q": { "$action": "tag", "exist": ["field", "id"] }, "r": {}, "s": [{ "lit": "notes" }, { "var": "id" }, { "lit": "tags" }], "t": { "req": "`reqdata`", "res": "`body.items`" }, "index$": 1 }], "key$": "list" }, "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /notes/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }], "query": [{ "a": true, "k": "query", "n": "field", "or": "field", "r": false, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/notes/{id}", "q": { "exist": ["field", "id"] }, "r": {}, "s": [{ "lit": "notes" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" }, "remove": { "input": "data", "name": "remove", "points": [{ "a": true, "co": { "id": "DELETE /notes/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "DELETE", "o": "/notes/{id}", "q": { "exist": ["id"] }, "r": {}, "s": [{ "lit": "notes" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "remove" }, "update": { "input": "data", "name": "update", "points": [{ "a": true, "co": { "id": "PUT /notes/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "PUT", "o": "/notes/{id}", "q": { "exist": ["id"] }, "r": {}, "s": [{ "lit": "notes" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "update" } }, "relations": { "ancestors": [] }, "key$": "note", "name__orig": "note", "Name": "Note", "name_": "note", "name-": "note", "NAME": "NOTE", "index$": 1 }, { "active": true, "entity": "note", "key$": "BasicNoteFlow", "kind": "basic", "name": "BasicNoteFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "note_ref01" }, "m": {}, "o": "create", "s": [], "v": [], "index$": 0 }, { "a": true, "d": {}, "i": {}, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemExists", "def": { "ref": "note_ref01" } }], "index$": 1 }, { "a": true, "d": {}, "i": { "ref": "note_ref01", "srcdatavar": "note_ref01_data", "suffix": "_up0", "textfield": "author" }, "m": {}, "o": "update", "s": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-note_ref01" } }], "v": [], "index$": 2 }, { "a": true, "d": {}, "i": { "ref": "note_ref01", "srcdatavar": "note_ref01_data", "suffix": "_dt0" }, "m": { "id": "note01" }, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-note_ref01" } }], "index$": 3 }, { "a": true, "d": {}, "i": { "ref": "note_ref01", "suffix": "_rm0" }, "m": { "id": "note01" }, "o": "remove", "s": [], "v": [], "index$": 4 }, { "a": true, "d": {}, "i": { "suffix": "_rt0" }, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemNotExists", "def": { "ref": "note_ref01" } }], "index$": 5 }] }, 'Note', { "POST /notes": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "id": { "type": "string", "key$": "id" }, "parent_id": { "description": "ID of the notebook that contains this note. Change this ID to move the note to a different notebook.", "type": "string", "key$": "parent_id" }, "title": { "description": "The note title.", "type": "string", "key$": "title" }, "body": { "description": "The note body, in Markdown. May also contain HTML.", "type": "string", "key$": "body" }, "created_time": { "description": "When the note was created.", "type": "integer", "key$": "created_time" }, "updated_time": { "description": "When the note was last updated.", "type": "integer", "key$": "updated_time" }, "is_conflict": { "description": "Tells whether the note is a conflict or not.", "type": "integer", "key$": "is_conflict" }, "latitude": { "type": "number", "key$": "latitude" }, "longitude": { "type": "number", "key$": "longitude" }, "altitude": { "type": "number", "key$": "altitude" }, "author": { "type": "string", "key$": "author" }, "source_url": { "description": "The full URL where the note comes from.", "type": "string", "key$": "source_url" }, "is_todo": { "description": "Tells whether this note is a to-do or not.", "type": "integer", "key$": "is_todo" }, "todo_due": { "description": "When the to-do is due.", "type": "integer", "key$": "todo_due" }, "todo_completed": { "description": "When the to-do was completed.", "type": "integer", "key$": "todo_completed" }, "markup_language": { "description": "1 for Markdown, 2 for HTML.", "type": "integer", "key$": "markup_language" }, "user_created_time": { "description": "When the note was created. May differ from created_time as the user can set it.", "type": "integer", "key$": "user_created_time" }, "user_updated_time": { "description": "When the note was last updated. May differ from updated_time as the user can set it.", "type": "integer", "key$": "user_updated_time" } }, "x-ref": "#/components/schemas/Note", "index$": 1 } } } }, "parameters": [] }, "GET /notes": { "protocol": "http", "parameters": [{ "name": "fields", "in": "query", "required": false, "schema": { "type": "string" }, "description": "Comma-separated list of properties to return. Request only what you need.", "x-ref": "#/components/parameters/fields", "index$": 0 }, { "name": "page", "in": "query", "required": false, "schema": { "type": "integer", "default": 1 }, "description": "1-based page number. Read has_more to know whether to ask for the next.", "x-ref": "#/components/parameters/page", "index$": 1 }, { "name": "order_by", "in": "query", "required": false, "schema": { "type": "string" }, "description": "Property to sort by, for example updated_time.", "x-ref": "#/components/parameters/order_by", "index$": 2 }, { "name": "order_dir", "in": "query", "required": false, "schema": { "type": "string", "enum": ["ASC", "DESC"] }, "description": "Sort direction.", "x-ref": "#/components/parameters/order_dir", "index$": 3 }] }, "GET /notes/{id}/tags": { "protocol": "http", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The item ID.", "x-ref": "#/components/parameters/id", "index$": 0 }, { "name": "fields", "in": "query", "required": false, "schema": { "type": "string" }, "description": "Comma-separated list of properties to return. Request only what you need.", "x-ref": "#/components/parameters/fields", "index$": 1 }] }, "GET /notes/{id}": { "protocol": "http", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The item ID.", "x-ref": "#/components/parameters/id", "index$": 0 }, { "name": "fields", "in": "query", "required": false, "schema": { "type": "string" }, "description": "Comma-separated list of properties to return. Request only what you need.", "x-ref": "#/components/parameters/fields", "index$": 1 }] }, "DELETE /notes/{id}": { "protocol": "http", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The item ID.", "x-ref": "#/components/parameters/id", "index$": 0 }] }, "PUT /notes/{id}": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "id": { "type": "string", "key$": "id" }, "parent_id": { "description": "ID of the notebook that contains this note. Change this ID to move the note to a different notebook.", "type": "string", "key$": "parent_id" }, "title": { "description": "The note title.", "type": "string", "key$": "title" }, "body": { "description": "The note body, in Markdown. May also contain HTML.", "type": "string", "key$": "body" }, "created_time": { "description": "When the note was created.", "type": "integer", "key$": "created_time" }, "updated_time": { "description": "When the note was last updated.", "type": "integer", "key$": "updated_time" }, "is_conflict": { "description": "Tells whether the note is a conflict or not.", "type": "integer", "key$": "is_conflict" }, "latitude": { "type": "number", "key$": "latitude" }, "longitude": { "type": "number", "key$": "longitude" }, "altitude": { "type": "number", "key$": "altitude" }, "author": { "type": "string", "key$": "author" }, "source_url": { "description": "The full URL where the note comes from.", "type": "string", "key$": "source_url" }, "is_todo": { "description": "Tells whether this note is a to-do or not.", "type": "integer", "key$": "is_todo" }, "todo_due": { "description": "When the to-do is due.", "type": "integer", "key$": "todo_due" }, "todo_completed": { "description": "When the to-do was completed.", "type": "integer", "key$": "todo_completed" }, "markup_language": { "description": "1 for Markdown, 2 for HTML.", "type": "integer", "key$": "markup_language" }, "user_created_time": { "description": "When the note was created. May differ from created_time as the user can set it.", "type": "integer", "key$": "user_created_time" }, "user_updated_time": { "description": "When the note was last updated. May differ from updated_time as the user can set it.", "type": "integer", "key$": "user_updated_time" } }, "x-ref": "#/components/schemas/Note", "index$": 1 } } } }, "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The item ID.", "x-ref": "#/components/parameters/id", "index$": 0 }] } });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const note_ref01_ent = client.Note();
        let note_ref01_data = setup.data.new.note['note_ref01'];
        note_ref01_data = (await note_ref01_ent.create(note_ref01_data)).data();
        (0, node_assert_1.default)(null != note_ref01_data.id);
        // LIST
        const note_ref01_match = {};
        const note_ref01_list = (await note_ref01_ent.list(note_ref01_match)).map((e) => e.data());
        (0, node_assert_1.default)(!isempty(select(note_ref01_list, { id: note_ref01_data.id })));
        // UPDATE
        const note_ref01_data_up0 = {};
        note_ref01_data_up0.id = note_ref01_data.id;
        const note_ref01_markdef_up0 = { name: 'author', value: 'Mark01-note_ref01_' + setup.now };
        note_ref01_data_up0[note_ref01_markdef_up0.name] = note_ref01_markdef_up0.value;
        const note_ref01_resdata_up0 = (await note_ref01_ent.update(note_ref01_data_up0)).data();
        (0, node_assert_1.default)(note_ref01_resdata_up0.id === note_ref01_data_up0.id);
        (0, node_assert_1.default)(note_ref01_resdata_up0[note_ref01_markdef_up0.name] === note_ref01_markdef_up0.value);
        // LOAD
        const note_ref01_match_dt0 = {};
        note_ref01_match_dt0.id = note_ref01_data.id;
        const note_ref01_data_dt0 = (await note_ref01_ent.load(note_ref01_match_dt0)).data();
        (0, node_assert_1.default)(note_ref01_data_dt0.id === note_ref01_data.id);
        // REMOVE
        const note_ref01_match_rm0 = { id: note_ref01_data.id };
        await note_ref01_ent.remove(note_ref01_match_rm0);
        // LIST
        const note_ref01_match_rt0 = {};
        const note_ref01_list_rt0 = (await note_ref01_ent.list(note_ref01_match_rt0)).map((e) => e.data());
        (0, node_assert_1.default)(isempty(select(note_ref01_list_rt0, { id: note_ref01_data.id })));
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/note/NoteTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.JoplinSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['note01', 'note02', 'note03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'JOPLIN_TEST_NOTE_ENTID': idmap,
        'JOPLIN_TEST_LIVE': 'FALSE',
        'JOPLIN_TEST_EXPLAIN': 'FALSE',
        'JOPLIN_APIKEY': '',
    });
    idmap = env['JOPLIN_TEST_NOTE_ENTID'];
    const live = 'TRUE' === env.JOPLIN_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['JOPLIN_TEST_NOTE_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.JoplinSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {
                apikey: env.JOPLIN_APIKEY,
            },
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.JOPLIN_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=NoteEntity.test.js.map