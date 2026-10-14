# Joplin C SDK



The C SDK for the Joplin API — an entity-oriented client following idiomatic C conventions (explicit structs, function-pointer vtables, and a trailing `PNError**` out-param for errors).

The SDK exposes the API as capitalised, semantic **Entities** — for example `joplin_folder(client, NULL)` — each
carrying a small, uniform set of operations (`list`, `load`, `create`, `update`, `remove`) instead of raw URL
paths and query strings. You work with named resources and verbs, which
keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
C has no central package registry — a release is the git tag
(`c/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/joplin-sdk/tags)). Build from a
source checkout with the bundled `Makefile`; the voxgig struct library is
vendored under `utility/struct`, so there are no external dependencies to
fetch:

```bash
cd c && make          # builds libsdk.a
cd c && make test     # builds + runs the test binaries
```

Link your program against `libsdk.a` and include `core/api.h`:

```bash
cc -I c/core -I c/utility/struct \
   myapp.c c/libsdk.a -lm -o myapp
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key as the `token` query parameter.

### 1. Create a client

```c
#include "core/api.h"

JoplinSDK* client = joplin_sdk_new(cmap(1,
    "apikey", v_str(getenv("JOPLIN_APIKEY"))));
PNError* err = NULL;
```

### 2. List folder records

`list()` returns a `NULL`-terminated array of entities, one per record,
and sets `*err` on failure — check `err` after the call. `vt->data`
reads an entity's record.

```c
Entity* folder = joplin_folder(client, NULL);
Entity** folders = folder->vt->list(folder, NULL, NULL, &err);
if (err) {
    fprintf(stderr, "list failed: %s\n", err->msg);
} else {
    for (size_t i = 0; folders[i]; i++) {
        printf("%s\n", voxgig_to_json(folders[i]->vt->data(folders[i], NULL)));
    }
}
```

### 3. Load a folder

`load()` returns the entity and sets `*err` on failure; `vt->data` reads
its record.

```c
Entity* loaded = folder->vt->load(folder, cmap(1, "id", v_str("example_id")), NULL, &err);
if (err) {
    fprintf(stderr, "load failed: %s\n", err->msg);
} else {
    printf("%s\n", voxgig_to_json(loaded->vt->data(loaded, NULL)));
}
```

### 4. Create, update, and remove

```c
// Create — returns the created entity, or NULL with *err set
Entity* created = folder->vt->create(folder, cmap(2, "created_time", v_num(1), "is_shared", v_num(1)), NULL, &err);
voxgig_value* created_id = created
    ? getp(created->vt->data(created, NULL), "id") : v_undef();

// Update
folder->vt->update(folder, cmap(3, "id", created_id, "created_time", v_num(1), "is_shared", v_num(1)), NULL, &err);

// Remove
folder->vt->remove(folder, cmap(1, "id", created_id), NULL, &err);
```


## Use with Station

This SDK ships as a [voxgig/station](https://github.com/voxgig/station)
plugin: bind it to a local `Station` and outbound configuration,
credentials, and observability move to one place. The feature is
present but **off by default** — nothing changes until you bind.

### Declarative: `station.json` + `station.sdk()`

Declare an instance in `station.json` at the repo root (committable —
names and stores, never values):

```json
{ "station": 1,
  "profiles": { "default": {
    "sdk": { "joplin": { } } } } }
```

Then get the client where you need it:

1. `station = Station.open()` — reads and validates `station.json`;
   constructs nothing.
2. `client = station.sdk('joplin')` — built on first ask and cached,
   so the same name returns the same client.

In this language an import runs no code, so register the factory
once at startup — `Station.provide('joplin', ...)`, one line — and
every other line of configuration stays in `station.json`.

A second instance of the same API is one more key — `"joplin$test"`
beside `"joplin"` — and `station.sdk('joplin$test')` returns it.
SDK features are configured in the same file too: fleet-wide, per api,
or per instance. `station.check()` resolves and constructs every
active instance without sending a request — run it in CI.

### The secret name derives from the instance

The credential comes from [sekreto](https://github.com/voxgig/sekreto)
under a name derived from the **instance** name — the instance token
lowercased, plus `.apikey`. The untagged instance `joplin` derives
`joplin.apikey` — by default the `JOPLIN_APIKEY` environment
variable this README already documents, unchanged. A tagged instance
derives its own: `joplin$test` → `joplin_test.apikey` →
`JOPLIN_TEST_APIKEY` — each instance is a separate credentialed use
of the API, and its env var is derivable from the name you chose. To
pin a name instead, set `secret` on the instance block, or at the
api level for several instances sharing one key. Point a profile at a
vault later and application code does not change; sekreto's own
documentation covers the stores. The key stays out of `options()` and
`prepare()` output; `station.tap(...)` shows live traffic.

### Imperative: inverted binding — the retrofit path

Bind through the constructor this SDK already has (inverted
binding): open a station, then construct with station-built options —
`station.options()` merges the handle, the activation entry, and the
correct feature order into the plain options the constructor accepts.

With no `station.json` at all this runs solo with everything
defaulted — the two-line form is how an existing application starts.

Station failures surface through this SDK's own error path
(`err.code`, `station_*`); the codes are catalogued in
[station error codes](https://github.com/voxgig/sdkgen/blob/main/docs/reference/station-errors.md).

## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const folders = await client.Folder().list()
  console.log(folders.map((item) => item.data()))
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity operations:

```c
PNError* err = NULL;
voxgig_value* result = sdk_direct(client, cmap(3,
    "path", v_str("/api/resource/{id}"),
    "method", v_str("GET"),
    "params", cmap(1, "id", v_str("example"))), &err);

if (voxgig_as_bool(getp(result, "ok"))) {
    printf("%lld\n", (long long)to_int(getp(result, "status")));  // 200
    printf("%s\n", voxgig_to_json(getp(result, "data")));         // response body
} else {
    // A non-2xx response carries status + data (the error body); a
    // transport-level failure carries err instead. Only one is present.
    printf("%s\n", voxgig_to_json(getp(result, "err")));
}
```

`sdk_direct()` never sets `*err` for a non-2xx response — it always returns
a result map you branch on via `getp(result, "ok")`.

### Prepare a request without sending it

```c
PNError* err = NULL;
voxgig_value* fetchdef = sdk_prepare(client, cmap(3,
    "path", v_str("/api/resource/{id}"),
    "method", v_str("DELETE"),
    "params", cmap(1, "id", v_str("example"))), &err);

printf("%s\n", get_str(fetchdef, "url"));
printf("%s\n", get_str(fetchdef, "method"));
printf("%s\n", voxgig_to_json(getp(fetchdef, "headers")));
```

### Use test mode

Create a mock client for unit testing — no server required:

```c
JoplinSDK* client = test_sdk(NULL, NULL);
PNError* err = NULL;

// list returns one entity per mock record, and sets *err on failure.
Entity* folder = joplin_folder(client, NULL);
Entity** folders = folder->vt->list(folder, NULL, NULL, &err);
// folders[i]->vt->data(folders[i], NULL) is a mock record
```

### Use a custom fetch function

Replace the HTTP transport with your own function (the same shape the test
transport uses):

```c
static voxgig_value* mock_fetch(void* ud, voxgig_value* args) {
    (void)ud; (void)args;
    return cmap(4,
        "status", v_num(200),
        "statusText", v_str("OK"),
        "headers", v_map(),
        "json", json_thunk(cmap(1, "id", v_str("mock01"))));
}

JoplinSDK* client = joplin_sdk_new(cmap(2,
    "base", v_str("http://localhost:8080"),
    "system", cmap(1, "fetch", vfn(mock_fetch, NULL))));
```

### Point at a different server

Override the base URL to reach a local or staging server:

```c
JoplinSDK* client = joplin_sdk_new(cmap(1,
    "base", v_str("http://localhost:8080")));
```

### Run live tests

Create a `.env.local` file at the project root:

```
JOPLIN_TEST_LIVE=TRUE
JOPLIN_APIKEY=<your-key>
```

Then run:

```bash
cd c && make test
```


## Reference

### JoplinSDK

```c
#include "core/api.h"

JoplinSDK* client = joplin_sdk_new(options);
```

Creates a new SDK client. `options` is a `voxgig_value*` map (`NULL` for
none) carrying any of the following keys:

| Option | Value type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `map` | Feature activation flags. |
| `system` | `map` | System overrides (e.g. a custom `fetch`). |

### test_sdk

```c
JoplinSDK* client = test_sdk(testopts, sdkopts);
```

Creates a test-mode client with mock transport. Both arguments may be
`NULL`.

### JoplinSDK functions

| Function | Signature | Description |
| --- | --- | --- |
| `sdk_prepare` | `(JoplinSDK*, fetchargs, PNError**) -> voxgig_value*` | Build an HTTP request definition without sending. |
| `sdk_direct` | `(JoplinSDK*, fetchargs, PNError**) -> voxgig_value*` | Build and send an HTTP request. Returns a result map (branch on `ok`). |
| `joplin_folder` | `(JoplinSDK*, entopts) -> Entity*` | Create a Folder entity instance. |
| `joplin_note` | `(JoplinSDK*, entopts) -> Entity*` | Create a Note entity instance. |
| `joplin_tag` | `(JoplinSDK*, entopts) -> Entity*` | Create a Tag entity instance. |

### Entity interface (vtable)

All entities share the same `EntityVT` vtable, reached via `e->vt->...`.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(Entity*, reqmatch, ctrl, PNError**) -> Entity*` | Load a single entity by match criteria. |
| `list` | `(Entity*, reqmatch, ctrl, PNError**) -> Entity**` | List entities matching the criteria: a `NULL`-terminated array, one per record. |
| `create` | `(Entity*, reqdata, ctrl, PNError**) -> Entity*` | Create a new entity. |
| `update` | `(Entity*, reqdata, ctrl, PNError**) -> Entity*` | Update an existing entity. |
| `remove` | `(Entity*, reqmatch, ctrl, PNError**) -> Entity*` | Remove an entity, which is returned marked as deleted. |
| `data` | `(Entity*, args) -> voxgig_value*` | Get entity data (pass a map to set). |
| `matchv` | `(Entity*, args) -> voxgig_value*` | Get entity match criteria (pass a map to set). |
| `make` | `(Entity*) -> Entity*` | Create a new instance with the same options. |
| `get_name` | `(Entity*) -> const char*` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` a `NULL`-terminated array
of entities, one per record; `vt->data` reads an entity's record. On
failure they return `NULL` and set `*err` to a `PNError*`. Always
initialise `PNError* err = NULL;` and check it after the call.

The `sdk_direct()` escape hatch never sets `*err` for a non-2xx response —
it returns a result map you branch on via `getp(result, "ok")`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `true` if the HTTP status is 2xx. |
| `status` | `number` | HTTP status code. |
| `headers` | `map` | Response headers. |
| `data` | `any` | Parsed JSON response body. |

On error, `ok` is `false` and `err` carries the error value.

### Entities

#### Folder

| Field | Description |
| --- | --- |
| `created_time` | When the folder was created. |
| `id` |  |
| `is_shared` |  |
| `parent_id` | ID of the parent notebook, empty for a top-level notebook. |
| `title` | The folder title. |
| `updated_time` | When the folder was last updated. |
| `user_created_time` | When the folder was created. |
| `user_updated_time` | When the folder was last updated. |

Operations: Create, List, Load, Remove, Update.

API path: `/folders`

#### Note

| Field | Description |
| --- | --- |
| `altitude` |  |
| `author` |  |
| `body` | The note body, in Markdown. |
| `created_time` | When the note was created. |
| `id` |  |
| `is_conflict` | Tells whether the note is a conflict or not. |
| `is_todo` | Tells whether this note is a to-do or not. |
| `latitude` |  |
| `longitude` |  |
| `markup_language` | 1 for Markdown, 2 for HTML. |
| `parent_id` | ID of the notebook that contains this note. |
| `source_url` | The full URL where the note comes from. |
| `title` | The note title. |
| `todo_completed` | When the to-do was completed. |
| `todo_due` | When the to-do is due. |
| `updated_time` | When the note was last updated. |
| `user_created_time` | When the note was created. |
| `user_updated_time` | When the note was last updated. |

Operations: Create, List, Load, Remove, Update.

API path: `/notes`

#### Tag

| Field | Description |
| --- | --- |
| `created_time` | When the tag was created. |
| `id` |  |
| `title` | The tag title. |
| `updated_time` | When the tag was last updated. |
| `user_created_time` | When the tag was created. |
| `user_updated_time` | When the tag was last updated. |

Operations: Create, List, Load, Remove, Update.

API path: `/tags`



## Entities


### Folder

Create an instance: `Entity* folder = joplin_folder(client, NULL);`

#### Operations

| Method | Description |
| --- | --- |
| `Entity* vt->create(e, reqdata, ctrl, &err)` | Create a new entity with the given data. |
| `Entity** vt->list(e, reqmatch, ctrl, &err)` | List entities, optionally matching the given criteria: a `NULL`-terminated array, one per record. |
| `Entity* vt->load(e, reqmatch, ctrl, &err)` | Load a single entity by match criteria. |
| `Entity* vt->remove(e, reqmatch, ctrl, &err)` | Remove the matching entity, which is returned marked as deleted. |
| `Entity* vt->update(e, reqdata, ctrl, &err)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `created_time` | `int64_t` | When the folder was created. |
| `id` | `char*` |  |
| `is_shared` | `int64_t` |  |
| `parent_id` | `char*` | ID of the parent notebook, empty for a top-level notebook. |
| `title` | `char*` | The folder title. |
| `updated_time` | `int64_t` | When the folder was last updated. |
| `user_created_time` | `int64_t` | When the folder was created. |
| `user_updated_time` | `int64_t` | When the folder was last updated. |

#### Example: Load

```c
Entity* folder = joplin_folder(client, NULL);
Entity* loaded = folder->vt->load(folder, cmap(1, "id", v_str("folder_id")), NULL, &err);
if (loaded) {
    printf("%s\n", voxgig_to_json(loaded->vt->data(loaded, NULL)));
}
```

#### Example: List

```c
Entity* folder = joplin_folder(client, NULL);
Entity** folders = folder->vt->list(folder, NULL, NULL, &err);
for (size_t i = 0; folders && folders[i]; i++) {
    printf("%s\n", voxgig_to_json(folders[i]->vt->data(folders[i], NULL)));
}
```

#### Example: Create

```c
Entity* folder = joplin_folder(client, NULL);
Entity* created = folder->vt->create(folder, NULL, NULL, &err);
```


### Note

Create an instance: `Entity* note = joplin_note(client, NULL);`

#### Operations

| Method | Description |
| --- | --- |
| `Entity* vt->create(e, reqdata, ctrl, &err)` | Create a new entity with the given data. |
| `Entity** vt->list(e, reqmatch, ctrl, &err)` | List entities, optionally matching the given criteria: a `NULL`-terminated array, one per record. |
| `Entity* vt->load(e, reqmatch, ctrl, &err)` | Load a single entity by match criteria. |
| `Entity* vt->remove(e, reqmatch, ctrl, &err)` | Remove the matching entity, which is returned marked as deleted. |
| `Entity* vt->update(e, reqdata, ctrl, &err)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `altitude` | `double` |  |
| `author` | `char*` |  |
| `body` | `char*` | The note body, in Markdown. |
| `created_time` | `int64_t` | When the note was created. |
| `id` | `char*` |  |
| `is_conflict` | `int64_t` | Tells whether the note is a conflict or not. |
| `is_todo` | `int64_t` | Tells whether this note is a to-do or not. |
| `latitude` | `double` |  |
| `longitude` | `double` |  |
| `markup_language` | `int64_t` | 1 for Markdown, 2 for HTML. |
| `parent_id` | `char*` | ID of the notebook that contains this note. |
| `source_url` | `char*` | The full URL where the note comes from. |
| `title` | `char*` | The note title. |
| `todo_completed` | `int64_t` | When the to-do was completed. |
| `todo_due` | `int64_t` | When the to-do is due. |
| `updated_time` | `int64_t` | When the note was last updated. |
| `user_created_time` | `int64_t` | When the note was created. |
| `user_updated_time` | `int64_t` | When the note was last updated. |

#### Example: Load

```c
Entity* note = joplin_note(client, NULL);
Entity* loaded = note->vt->load(note, cmap(1, "id", v_str("note_id")), NULL, &err);
if (loaded) {
    printf("%s\n", voxgig_to_json(loaded->vt->data(loaded, NULL)));
}
```

#### Example: List

```c
Entity* note = joplin_note(client, NULL);
Entity** notes = note->vt->list(note, NULL, NULL, &err);
for (size_t i = 0; notes && notes[i]; i++) {
    printf("%s\n", voxgig_to_json(notes[i]->vt->data(notes[i], NULL)));
}
```

#### Example: Create

```c
Entity* note = joplin_note(client, NULL);
Entity* created = note->vt->create(note, NULL, NULL, &err);
```


### Tag

Create an instance: `Entity* tag = joplin_tag(client, NULL);`

#### Operations

| Method | Description |
| --- | --- |
| `Entity* vt->create(e, reqdata, ctrl, &err)` | Create a new entity with the given data. |
| `Entity** vt->list(e, reqmatch, ctrl, &err)` | List entities, optionally matching the given criteria: a `NULL`-terminated array, one per record. |
| `Entity* vt->load(e, reqmatch, ctrl, &err)` | Load a single entity by match criteria. |
| `Entity* vt->remove(e, reqmatch, ctrl, &err)` | Remove the matching entity, which is returned marked as deleted. |
| `Entity* vt->update(e, reqdata, ctrl, &err)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `created_time` | `int64_t` | When the tag was created. |
| `id` | `char*` |  |
| `title` | `char*` | The tag title. |
| `updated_time` | `int64_t` | When the tag was last updated. |
| `user_created_time` | `int64_t` | When the tag was created. |
| `user_updated_time` | `int64_t` | When the tag was last updated. |

#### Example: Load

```c
Entity* tag = joplin_tag(client, NULL);
Entity* loaded = tag->vt->load(tag, cmap(1, "id", v_str("tag_id")), NULL, &err);
if (loaded) {
    printf("%s\n", voxgig_to_json(loaded->vt->data(loaded, NULL)));
}
```

#### Example: List

```c
Entity* tag = joplin_tag(client, NULL);
Entity** tags = tag->vt->list(tag, NULL, NULL, &err);
for (size_t i = 0; tags && tags[i]; i++) {
    printf("%s\n", voxgig_to_json(tags[i]->vt->data(tags[i], NULL)));
}
```

#### Example: Create

```c
Entity* tag = joplin_tag(client, NULL);
Entity* created = tag->vt->create(tag, NULL, NULL, &err);
```

## Features

This SDK ships 9 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`debug`](#debug) | Debug capture |
| [`idempotency`](#idempotency) | Idempotency |
| [`metrics`](#metrics) | Metrics |
| [`paging`](#paging) | Paging |
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`station`](#station) | Station control surface binding for outbound integrations |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `station`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### debug

Debug capture.

| Option | Default |
|---|---|
| `active` | `false` |
| `max` | `100` |
| `redact` | `['authorization', 'cookie', 'set-cookie', 'api-key', 'apikey', 'x-api-key', 'idempotency-key']` |

Set `feature.debug.active` to enable it, then override any of the options above.

### idempotency

Idempotency.

| Option | Default |
|---|---|
| `active` | `false` |
| `header` | `'Idempotency-Key'` |
| `methods` | `['POST', 'PUT', 'PATCH', 'DELETE']` |
| `ops` | `['create', 'update', 'remove']` |

Set `feature.idempotency.active` to enable it, then override any of the options above.

### metrics

Metrics.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.metrics.active` to enable it, then override any of the options above.

### paging

Paging.

| Option | Default |
|---|---|
| `active` | `false` |
| `afterVar` | `'after'` |
| `cursorParam` | `'cursor'` |
| `firstVar` | `'first'` |
| `limitParam` | `'limit'` |
| `pageParam` | `'page'` |
| `startPage` | `1` |

Set `feature.paging.active` to enable it, then override any of the options above.

### ratelimit

Rate limiting.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Retry.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### station

Station control surface binding for outbound integrations.

| Option | Default |
|---|---|
| `active` | `false` |
| `capture` | `'meta'` |
| `fromEnv` | `true` |
| `instance` | `''` |
| `profile` | `''` |
| `register` | `true` |
| `secret` | `''` |
| `url` | `''` |

Set `feature.station.active` to enable it, then override any of the options above.

`station` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **DebugFeature**: Debug capture
- **IdempotencyFeature**: Idempotency
- **MetricsFeature**: Metrics
- **PagingFeature**: Paging
- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **StationFeature**: Station control surface binding for outbound integrations
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as `voxgig_value*`

The C SDK uses a single dynamic `voxgig_value*` type throughout rather than
a typed struct per entity. `voxgig_value` is the vendored voxgig struct
port (a JSON-shaped tagged union: string, number, bool, list, map, null,
undef). This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

Build request maps with the `cmap` / `clist` / `v_str` / `v_num` /
`v_bool` helper builders, and read fields back with `getp` (or the typed
`get_str` / `get_bool` / `to_int`); use `to_map` to safely coerce a
value to a map.

Memory follows a retain-heavy, never-free discipline — pipeline values are
never released. This is safe (no use-after-free) and leaks are acceptable
for the short-lived SDK and test binaries.

### Error handling

Fallible functions return a `voxgig_value*` (or a struct pointer) and take a
trailing `PNError** err` out-param. On success `*err` is left `NULL`; on
failure `*err` points to a heap `PNError` carrying `code` and `msg`.
Always initialise `PNError* err = NULL;` and branch on it after each call.

### Project structure

```
c/
├── core/          -- Pipeline types, config, client (client.c), api.h + sdk.h
├── entity/        -- Per-entity implementations (one .c each)
├── feature/       -- Built-in features (base, test, log, ...)
├── utility/       -- Utilities + the vendored voxgig struct port (utility/struct)
├── tests/         -- Test binaries (each a standalone main())
└── Makefile       -- Builds libsdk.a and runs every tests/*.c
```

The public entry header is `core/api.h` — it includes `core/sdk.h` (the
umbrella runtime header) and declares each entity's constructor and SDK
accessor. Include it and link against `libsdk.a`.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const folder = client.Folder()
await folder.list()

// folder.data() now returns the folder data from the last `list`
// folder.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
