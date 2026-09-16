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
// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('TagEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when JOPLIN_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('JOPLIN_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.JoplinSDK.test();
        const ent = testsdk.Tag();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.JOPLIN_TEST_LIVE;
        for (const op of ['create', 'list', 'update', 'load', 'remove']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'tag.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": [{ "active": true, "name": "created_time", "req": false, "short": "When the tag was created.", "type": "`$INTEGER`", "index$": 0 }, { "active": true, "name": "id", "req": false, "type": "`$STRING`", "index$": 1 }, { "active": true, "name": "title", "req": false, "short": "The tag title.", "type": "`$STRING`", "index$": 2 }, { "active": true, "name": "updated_time", "req": false, "short": "When the tag was last updated.", "type": "`$INTEGER`", "index$": 3 }, { "active": true, "name": "user_created_time", "req": false, "short": "When the tag was created.", "type": "`$INTEGER`", "index$": 4 }, { "active": true, "name": "user_updated_time", "req": false, "short": "When the tag was last updated.", "type": "`$INTEGER`", "index$": 5 }], "id": { "field": "id", "name": "id" }, "name": "tag", "op": { "create": { "input": "data", "name": "create", "points": [{ "active": true, "args": {}, "contract": { "id": "POST /tags", "json": "{\"operationId\":\"createTag\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"created_time\":{\"description\":\"When the tag was created.\",\"type\":\"integer\"},\"id\":{\"type\":\"string\"},\"title\":{\"description\":\"The tag title.\",\"type\":\"string\"},\"updated_time\":{\"description\":\"When the tag was last updated.\",\"type\":\"integer\"},\"user_created_time\":{\"description\":\"When the tag was created. May differ from created_time as the user can set it.\",\"type\":\"integer\"},\"user_updated_time\":{\"description\":\"When the tag was last updated. May differ from updated_time as the user can set it.\",\"type\":\"integer\"}},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"created_time\":{\"description\":\"When the tag was created.\",\"type\":\"integer\"},\"id\":{\"type\":\"string\"},\"title\":{\"description\":\"The tag title.\",\"type\":\"string\"},\"updated_time\":{\"description\":\"When the tag was last updated.\",\"type\":\"integer\"},\"user_created_time\":{\"description\":\"When the tag was created. May differ from created_time as the user can set it.\",\"type\":\"integer\"},\"user_updated_time\":{\"description\":\"When the tag was last updated. May differ from updated_time as the user can set it.\",\"type\":\"integer\"}},\"type\":\"object\"}}},\"description\":\"The created tag.\"}},\"security\":[{\"token\":[]}],\"securitySchemes\":{\"token\":{\"description\":\"The Web Clipper authorisation token, shown in Joplin under Options, Web Clipper.\",\"in\":\"query\",\"name\":\"token\",\"type\":\"apiKey\"}},\"securitySource\":\"definition\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "POST", "orig": "/tags", "segments": [{ "lit": "tags" }], "select": {}, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "create" }, "list": { "input": "data", "name": "list", "points": [{ "active": true, "args": { "query": [{ "active": true, "kind": "query", "name": "field", "orig": "field", "reqd": false, "type": "`$STRING`", "index$": 0 }, { "active": true, "kind": "query", "name": "order_by", "orig": "order_by", "reqd": false, "type": "`$STRING`", "index$": 1 }, { "active": true, "kind": "query", "name": "order_dir", "orig": "order_dir", "reqd": false, "type": "`$STRING`", "index$": 2 }, { "active": true, "example": 1, "kind": "query", "name": "page", "orig": "page", "reqd": false, "type": "`$INTEGER`", "index$": 3 }] }, "contract": { "id": "GET /tags", "json": "{\"operationId\":\"listTags\",\"parameters\":[{\"description\":\"Comma-separated list of properties to return. Request only what you need.\",\"in\":\"query\",\"name\":\"fields\",\"required\":false,\"schema\":{\"type\":\"string\"}},{\"description\":\"1-based page number. Read has_more to know whether to ask for the next.\",\"in\":\"query\",\"name\":\"page\",\"required\":false,\"schema\":{\"default\":1,\"type\":\"integer\"}},{\"description\":\"Property to sort by, for example updated_time.\",\"in\":\"query\",\"name\":\"order_by\",\"required\":false,\"schema\":{\"type\":\"string\"}},{\"description\":\"Sort direction.\",\"in\":\"query\",\"name\":\"order_dir\",\"required\":false,\"schema\":{\"enum\":[\"ASC\",\"DESC\"],\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"has_more\":{\"description\":\"True when a further page is available; pass the next page number.\",\"type\":\"boolean\"},\"items\":{\"items\":{\"properties\":{\"created_time\":{\"description\":\"When the tag was created.\",\"type\":\"integer\"},\"id\":{\"type\":\"string\"},\"title\":{\"description\":\"The tag title.\",\"type\":\"string\"},\"updated_time\":{\"description\":\"When the tag was last updated.\",\"type\":\"integer\"},\"user_created_time\":{\"description\":\"When the tag was created. May differ from created_time as the user can set it.\",\"type\":\"integer\"},\"user_updated_time\":{\"description\":\"When the tag was last updated. May differ from updated_time as the user can set it.\",\"type\":\"integer\"}},\"type\":\"object\"},\"type\":\"array\"}},\"type\":\"object\"}}},\"description\":\"A page of results.\"}},\"security\":[{\"token\":[]}],\"securitySchemes\":{\"token\":{\"description\":\"The Web Clipper authorisation token, shown in Joplin under Options, Web Clipper.\",\"in\":\"query\",\"name\":\"token\",\"type\":\"apiKey\"}},\"securitySource\":\"definition\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "GET", "orig": "/tags", "segments": [{ "lit": "tags" }], "select": { "exist": ["field", "order_by", "order_dir", "page"] }, "transform": { "req": "`reqdata`", "res": "`body.items`" }, "index$": 0 }, { "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "id", "reqd": true, "type": "`$STRING`" }], "query": [{ "active": true, "kind": "query", "name": "field", "orig": "field", "reqd": false, "type": "`$STRING`" }] }, "contract": { "id": "GET /tags/{id}/notes", "json": "{\"operationId\":\"listTagNotes\",\"parameters\":[{\"description\":\"The item ID.\",\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}},{\"description\":\"Comma-separated list of properties to return. Request only what you need.\",\"in\":\"query\",\"name\":\"fields\",\"required\":false,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"has_more\":{\"description\":\"True when a further page is available; pass the next page number.\",\"type\":\"boolean\"},\"items\":{\"items\":{\"properties\":{\"altitude\":{\"type\":\"number\"},\"author\":{\"type\":\"string\"},\"body\":{\"description\":\"The note body, in Markdown. May also contain HTML.\",\"type\":\"string\"},\"created_time\":{\"description\":\"When the note was created.\",\"type\":\"integer\"},\"id\":{\"type\":\"string\"},\"is_conflict\":{\"description\":\"Tells whether the note is a conflict or not.\",\"type\":\"integer\"},\"is_todo\":{\"description\":\"Tells whether this note is a to-do or not.\",\"type\":\"integer\"},\"latitude\":{\"type\":\"number\"},\"longitude\":{\"type\":\"number\"},\"markup_language\":{\"description\":\"1 for Markdown, 2 for HTML.\",\"type\":\"integer\"},\"parent_id\":{\"description\":\"ID of the notebook that contains this note. Change this ID to move the note to a different notebook.\",\"type\":\"string\"},\"source_url\":{\"description\":\"The full URL where the note comes from.\",\"type\":\"string\"},\"title\":{\"description\":\"The note title.\",\"type\":\"string\"},\"todo_completed\":{\"description\":\"When the to-do was completed.\",\"type\":\"integer\"},\"todo_due\":{\"description\":\"When the to-do is due.\",\"type\":\"integer\"},\"updated_time\":{\"description\":\"When the note was last updated.\",\"type\":\"integer\"},\"user_created_time\":{\"description\":\"When the note was created. May differ from created_time as the user can set it.\",\"type\":\"integer\"},\"user_updated_time\":{\"description\":\"When the note was last updated. May differ from updated_time as the user can set it.\",\"type\":\"integer\"}},\"type\":\"object\"},\"type\":\"array\"}},\"type\":\"object\"}}},\"description\":\"The item.\"},\"404\":{\"description\":\"No item with that ID.\"}},\"security\":[{\"token\":[]}],\"securitySchemes\":{\"token\":{\"description\":\"The Web Clipper authorisation token, shown in Joplin under Options, Web Clipper.\",\"in\":\"query\",\"name\":\"token\",\"type\":\"apiKey\"}},\"securitySource\":\"definition\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "GET", "orig": "/tags/{id}/notes", "segments": [{ "lit": "tags" }, { "var": "id" }, { "lit": "notes" }], "select": { "$action": "note", "exist": ["field", "id"] }, "transform": { "req": "`reqdata`", "res": "`body.items`" }, "index$": 1 }], "key$": "list" }, "load": { "input": "data", "name": "load", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "id", "reqd": true, "type": "`$STRING`", "index$": 0 }], "query": [{ "active": true, "kind": "query", "name": "field", "orig": "field", "reqd": false, "type": "`$STRING`", "index$": 0 }] }, "contract": { "id": "GET /tags/{id}", "json": "{\"operationId\":\"loadTag\",\"parameters\":[{\"description\":\"The item ID.\",\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}},{\"description\":\"Comma-separated list of properties to return. Request only what you need.\",\"in\":\"query\",\"name\":\"fields\",\"required\":false,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"created_time\":{\"description\":\"When the tag was created.\",\"type\":\"integer\"},\"id\":{\"type\":\"string\"},\"title\":{\"description\":\"The tag title.\",\"type\":\"string\"},\"updated_time\":{\"description\":\"When the tag was last updated.\",\"type\":\"integer\"},\"user_created_time\":{\"description\":\"When the tag was created. May differ from created_time as the user can set it.\",\"type\":\"integer\"},\"user_updated_time\":{\"description\":\"When the tag was last updated. May differ from updated_time as the user can set it.\",\"type\":\"integer\"}},\"type\":\"object\"}}},\"description\":\"The item.\"},\"404\":{\"description\":\"No item with that ID.\"}},\"security\":[{\"token\":[]}],\"securitySchemes\":{\"token\":{\"description\":\"The Web Clipper authorisation token, shown in Joplin under Options, Web Clipper.\",\"in\":\"query\",\"name\":\"token\",\"type\":\"apiKey\"}},\"securitySource\":\"definition\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "GET", "orig": "/tags/{id}", "segments": [{ "lit": "tags" }, { "var": "id" }], "select": { "exist": ["field", "id"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" }, "remove": { "input": "data", "name": "remove", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "id", "reqd": true, "type": "`$STRING`", "index$": 0 }] }, "contract": { "id": "DELETE /tags/{id}", "json": "{\"operationId\":\"removeTag\",\"parameters\":[{\"description\":\"The item ID.\",\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"description\":\"Deleted.\"}},\"security\":[{\"token\":[]}],\"securitySchemes\":{\"token\":{\"description\":\"The Web Clipper authorisation token, shown in Joplin under Options, Web Clipper.\",\"in\":\"query\",\"name\":\"token\",\"type\":\"apiKey\"}},\"securitySource\":\"definition\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "DELETE", "orig": "/tags/{id}", "segments": [{ "lit": "tags" }, { "var": "id" }], "select": { "exist": ["id"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "remove" }, "update": { "input": "data", "name": "update", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "id", "reqd": true, "type": "`$STRING`", "index$": 0 }] }, "contract": { "id": "PUT /tags/{id}", "json": "{\"operationId\":\"updateTag\",\"parameters\":[{\"description\":\"The item ID.\",\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"created_time\":{\"description\":\"When the tag was created.\",\"type\":\"integer\"},\"id\":{\"type\":\"string\"},\"title\":{\"description\":\"The tag title.\",\"type\":\"string\"},\"updated_time\":{\"description\":\"When the tag was last updated.\",\"type\":\"integer\"},\"user_created_time\":{\"description\":\"When the tag was created. May differ from created_time as the user can set it.\",\"type\":\"integer\"},\"user_updated_time\":{\"description\":\"When the tag was last updated. May differ from updated_time as the user can set it.\",\"type\":\"integer\"}},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"created_time\":{\"description\":\"When the tag was created.\",\"type\":\"integer\"},\"id\":{\"type\":\"string\"},\"title\":{\"description\":\"The tag title.\",\"type\":\"string\"},\"updated_time\":{\"description\":\"When the tag was last updated.\",\"type\":\"integer\"},\"user_created_time\":{\"description\":\"When the tag was created. May differ from created_time as the user can set it.\",\"type\":\"integer\"},\"user_updated_time\":{\"description\":\"When the tag was last updated. May differ from updated_time as the user can set it.\",\"type\":\"integer\"}},\"type\":\"object\"}}},\"description\":\"The updated tag.\"}},\"security\":[{\"token\":[]}],\"securitySchemes\":{\"token\":{\"description\":\"The Web Clipper authorisation token, shown in Joplin under Options, Web Clipper.\",\"in\":\"query\",\"name\":\"token\",\"type\":\"apiKey\"}},\"securitySource\":\"definition\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "PUT", "orig": "/tags/{id}", "segments": [{ "lit": "tags" }, { "var": "id" }], "select": { "exist": ["id"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "update" } }, "relations": { "ancestors": [] }, "key$": "tag", "name__orig": "tag", "Name": "Tag", "name_": "tag", "name-": "tag", "NAME": "TAG", "index$": 2 }, { "active": true, "entity": "tag", "key$": "BasicTagFlow", "kind": "basic", "name": "BasicTagFlow", "param": {}, "step": [{ "active": true, "data": {}, "input": { "ref": "tag_ref01" }, "match": {}, "op": "create", "spec": [], "valid": [], "index$": 0 }, { "active": true, "data": {}, "input": {}, "match": {}, "op": "list", "spec": [], "valid": [{ "apply": "ItemExists", "def": { "ref": "tag_ref01" } }], "index$": 1 }, { "active": true, "data": {}, "input": { "ref": "tag_ref01", "srcdatavar": "tag_ref01_data", "suffix": "_up0", "textfield": "title" }, "match": {}, "op": "update", "spec": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-tag_ref01" } }], "valid": [], "index$": 2 }, { "active": true, "data": {}, "input": { "ref": "tag_ref01", "srcdatavar": "tag_ref01_data", "suffix": "_dt0" }, "match": { "id": "tag01" }, "op": "load", "spec": [], "valid": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-tag_ref01" } }], "index$": 3 }, { "active": true, "data": {}, "input": { "ref": "tag_ref01", "suffix": "_rm0" }, "match": { "id": "tag01" }, "op": "remove", "spec": [], "valid": [], "index$": 4 }, { "active": true, "data": {}, "input": { "suffix": "_rt0" }, "match": {}, "op": "list", "spec": [], "valid": [{ "apply": "ItemNotExists", "def": { "ref": "tag_ref01" } }], "index$": 5 }] }, 'Tag');
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const tag_ref01_ent = client.Tag();
        let tag_ref01_data = setup.data.new.tag['tag_ref01'];
        tag_ref01_data = (await tag_ref01_ent.create(tag_ref01_data)).data();
        (0, node_assert_1.default)(null != tag_ref01_data.id);
        // LIST
        const tag_ref01_match = {};
        const tag_ref01_list = (await tag_ref01_ent.list(tag_ref01_match)).map((e) => e.data());
        (0, node_assert_1.default)(!isempty(select(tag_ref01_list, { id: tag_ref01_data.id })));
        // UPDATE
        const tag_ref01_data_up0 = {};
        tag_ref01_data_up0.id = tag_ref01_data.id;
        const tag_ref01_markdef_up0 = { name: 'title', value: 'Mark01-tag_ref01_' + setup.now };
        tag_ref01_data_up0[tag_ref01_markdef_up0.name] = tag_ref01_markdef_up0.value;
        const tag_ref01_resdata_up0 = (await tag_ref01_ent.update(tag_ref01_data_up0)).data();
        (0, node_assert_1.default)(tag_ref01_resdata_up0.id === tag_ref01_data_up0.id);
        (0, node_assert_1.default)(tag_ref01_resdata_up0[tag_ref01_markdef_up0.name] === tag_ref01_markdef_up0.value);
        // LOAD
        const tag_ref01_match_dt0 = {};
        tag_ref01_match_dt0.id = tag_ref01_data.id;
        const tag_ref01_data_dt0 = (await tag_ref01_ent.load(tag_ref01_match_dt0)).data();
        (0, node_assert_1.default)(tag_ref01_data_dt0.id === tag_ref01_data.id);
        // REMOVE
        const tag_ref01_match_rm0 = { id: tag_ref01_data.id };
        await tag_ref01_ent.remove(tag_ref01_match_rm0);
        // LIST
        const tag_ref01_match_rt0 = {};
        const tag_ref01_list_rt0 = (await tag_ref01_ent.list(tag_ref01_match_rt0)).map((e) => e.data());
        (0, node_assert_1.default)(isempty(select(tag_ref01_list_rt0, { id: tag_ref01_data.id })));
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/tag/TagTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.JoplinSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['tag01', 'tag02', 'tag03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'JOPLIN_TEST_TAG_ENTID': idmap,
        'JOPLIN_TEST_LIVE': 'FALSE',
        'JOPLIN_TEST_EXPLAIN': 'FALSE',
        'JOPLIN_APIKEY': '',
    });
    idmap = env['JOPLIN_TEST_TAG_ENTID'];
    const live = 'TRUE' === env.JOPLIN_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['JOPLIN_TEST_TAG_ENTID'];
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
//# sourceMappingURL=TagEntity.test.js.map