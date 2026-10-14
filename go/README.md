# Joplin Golang SDK



The Golang SDK for the Joplin API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.Folder(nil)` — each with the same small set of operations (`List`, `Load`, `Create`, `Update`, `Remove`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `c`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/joplin-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Tags](https://github.com/voxgig-sdk/joplin-sdk/tags) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/joplin-sdk/go=../joplin-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key as the `token` query parameter.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the entity, and for
`List` a `[]any` of entities, one per record (there is no `{ok, data}`
wrapper), so check `err` and read a record through the entity's
`Data()`.

```go
package main

import (
    "fmt"
    "os"
    sdk "github.com/voxgig-sdk/joplin-sdk/go"
)

func main() {
    client := sdk.NewJoplinSDK(map[string]any{
        "apikey": os.Getenv("JOPLIN_APIKEY"),
    })

    // List folder records — the value is a []any of entities, one per record.
    folders, err := client.Folder(nil).List(nil, nil)
    if err != nil {
        panic(err)
    }
    for _, item := range folders.([]any) {
        fmt.Println(item.(sdk.Entity).Data())
    }

    // Load a single folder — the value is the entity; Data() reads its record.
    folder, err := client.Folder(nil).Load(map[string]any{"id": "example_id"}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(folder.(sdk.Entity).Data())

    // Create a folder.
    created, err := client.Folder(nil).Create(map[string]any{"created_time": 1, "is_shared": 1}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(created.(sdk.Entity).Data())

    // Update a folder.
    updated, err := client.Folder(nil).Update(map[string]any{"id": "example_id", "created_time": 1, "is_shared": 1}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(updated.(sdk.Entity).Data())

    // Remove a folder.
    removed, err := client.Folder(nil).Remove(map[string]any{"id": "example_id"}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(removed.(sdk.Entity).Data())
}
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
    "sdk": { "joplin": {
      "package": "github.com/voxgig-sdk/joplin-sdk/go" } } } } }
```

Then get the client where you need it:

1. `station = Station.open()` — reads and validates `station.json`;
   constructs nothing.
2. `client = station.sdk('joplin')` — built on first ask and cached,
   so the same name returns the same client.

Loading this package is the whole bootstrap: it registers its own
factory (constructor plus embedded config) with the station library at
module init, so `station.sdk()` needs no SDK import in application
code. That is what the `package` key above is for — it names the module
for station to load, since nothing else in this example would execute
it. An application that imports this SDK for its types anyway can drop
the key: that import is itself the bootstrap.

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

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
folders, err := client.Folder(nil).List(nil, nil)
if err != nil {
    // handle err
    return
}
_ = folders
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

folders, err := client.Folder(nil).List(
    nil, nil,
)
if err != nil {
    panic(err)
}
// A []any of entities, one per mock record.
for _, item := range folders.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewJoplinSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
    },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
JOPLIN_TEST_LIVE=TRUE
JOPLIN_APIKEY=<your-key>
```

Then run:

```bash
cd go && go test ./test/...
```


## Reference

### NewJoplinSDK

```go
func NewJoplinSDK(options map[string]any) *JoplinSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"apikey"` | `string` | API key for authentication. |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *JoplinSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### JoplinSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `Folder` | `(data map[string]any) JoplinEntity` | Create a Folder entity instance. |
| `Note` | `(data map[string]any) JoplinEntity` | Create a Note entity instance. |
| `Tag` | `(data map[string]any) JoplinEntity` | Create a Tag entity instance. |

### Entity interface (JoplinEntity)

All entities implement the `JoplinEntity` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria, and return it. |
| `List` | `(reqmatch, ctrl map[string]any) (any, error)` | List entities matching the criteria, one per record. |
| `Create` | `(reqdata, ctrl map[string]any) (any, error)` | Create a new entity, and return it. |
| `Update` | `(reqdata, ctrl map[string]any) (any, error)` | Update an existing entity, and return it. |
| `Remove` | `(reqmatch, ctrl map[string]any) (any, error)` | Remove an entity, and return it marked as deleted. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` / `Create` / `Update` / `Remove` | the entity, whose `Data()` reads its record (`map[string]any`) |
| `List` | a `[]any` of entities, one per record |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    folder, err := client.Folder(nil).List(nil, nil)
    if err != nil { /* handle */ }
    // folder is a []any of entities, one per record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### Folder

| Field | Description |
| --- | --- |
| `"created_time"` | When the folder was created. |
| `"id"` |  |
| `"is_shared"` |  |
| `"parent_id"` | ID of the parent notebook, empty for a top-level notebook. |
| `"title"` | The folder title. |
| `"updated_time"` | When the folder was last updated. |
| `"user_created_time"` | When the folder was created. |
| `"user_updated_time"` | When the folder was last updated. |

Operations: Create, List, Load, Remove, Update.

API path: `/folders`

#### Note

| Field | Description |
| --- | --- |
| `"altitude"` |  |
| `"author"` |  |
| `"body"` | The note body, in Markdown. |
| `"created_time"` | When the note was created. |
| `"id"` |  |
| `"is_conflict"` | Tells whether the note is a conflict or not. |
| `"is_todo"` | Tells whether this note is a to-do or not. |
| `"latitude"` |  |
| `"longitude"` |  |
| `"markup_language"` | 1 for Markdown, 2 for HTML. |
| `"parent_id"` | ID of the notebook that contains this note. |
| `"source_url"` | The full URL where the note comes from. |
| `"title"` | The note title. |
| `"todo_completed"` | When the to-do was completed. |
| `"todo_due"` | When the to-do is due. |
| `"updated_time"` | When the note was last updated. |
| `"user_created_time"` | When the note was created. |
| `"user_updated_time"` | When the note was last updated. |

Operations: Create, List, Load, Remove, Update.

API path: `/notes`

#### Tag

| Field | Description |
| --- | --- |
| `"created_time"` | When the tag was created. |
| `"id"` |  |
| `"title"` | The tag title. |
| `"updated_time"` | When the tag was last updated. |
| `"user_created_time"` | When the tag was created. |
| `"user_updated_time"` | When the tag was last updated. |

Operations: Create, List, Load, Remove, Update.

API path: `/tags`



## Entities


### Folder

Create an instance: `folder := client.Folder(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |
| `Create(data, ctrl)` | Create a new entity with the given data. |
| `Update(data, ctrl)` | Update an existing entity. |
| `Remove(match, ctrl)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `created_time` | `int` | When the folder was created. |
| `id` | `string` |  |
| `is_shared` | `int` |  |
| `parent_id` | `string` | ID of the parent notebook, empty for a top-level notebook. |
| `title` | `string` | The folder title. |
| `updated_time` | `int` | When the folder was last updated. |
| `user_created_time` | `int` | When the folder was created. |
| `user_updated_time` | `int` | When the folder was last updated. |

#### Example: Load

```go
folder, err := client.Folder(nil).Load(map[string]any{"id": "folder_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(folder.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
folders, err := client.Folder(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range folders.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```

#### Example: Create

```go
result, err := client.Folder(nil).Create(map[string]any{
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result.(sdk.Entity).Data()) // the created entity's record
```


### Note

Create an instance: `note := client.Note(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |
| `Create(data, ctrl)` | Create a new entity with the given data. |
| `Update(data, ctrl)` | Update an existing entity. |
| `Remove(match, ctrl)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `altitude` | `float64` |  |
| `author` | `string` |  |
| `body` | `string` | The note body, in Markdown. |
| `created_time` | `int` | When the note was created. |
| `id` | `string` |  |
| `is_conflict` | `int` | Tells whether the note is a conflict or not. |
| `is_todo` | `int` | Tells whether this note is a to-do or not. |
| `latitude` | `float64` |  |
| `longitude` | `float64` |  |
| `markup_language` | `int` | 1 for Markdown, 2 for HTML. |
| `parent_id` | `string` | ID of the notebook that contains this note. |
| `source_url` | `string` | The full URL where the note comes from. |
| `title` | `string` | The note title. |
| `todo_completed` | `int` | When the to-do was completed. |
| `todo_due` | `int` | When the to-do is due. |
| `updated_time` | `int` | When the note was last updated. |
| `user_created_time` | `int` | When the note was created. |
| `user_updated_time` | `int` | When the note was last updated. |

#### Example: Load

```go
note, err := client.Note(nil).Load(map[string]any{"id": "note_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(note.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
notes, err := client.Note(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range notes.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```

#### Example: Create

```go
result, err := client.Note(nil).Create(map[string]any{
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result.(sdk.Entity).Data()) // the created entity's record
```


### Tag

Create an instance: `tag := client.Tag(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |
| `Create(data, ctrl)` | Create a new entity with the given data. |
| `Update(data, ctrl)` | Update an existing entity. |
| `Remove(match, ctrl)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `created_time` | `int` | When the tag was created. |
| `id` | `string` |  |
| `title` | `string` | The tag title. |
| `updated_time` | `int` | When the tag was last updated. |
| `user_created_time` | `int` | When the tag was created. |
| `user_updated_time` | `int` | When the tag was last updated. |

#### Example: Load

```go
tag, err := client.Tag(nil).Load(map[string]any{"id": "tag_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(tag.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
tags, err := client.Tag(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range tags.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```

#### Example: Create

```go
result, err := client.Tag(nil).Create(map[string]any{
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result.(sdk.Entity).Data()) // the created entity's record
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

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

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

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

An operation returns the entity, and its `Data()` returns the record. Use
`core.ToMapAny()` to safely cast that record, or data nested in it, to
`map[string]any`: it returns `nil` for anything else, an entity included.

### Package structure

```
github.com/voxgig-sdk/joplin-sdk/go/
├── joplin.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/joplin-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `List`, the entity
stores the returned data and match criteria internally.

```go
folder := client.Folder(nil)
folder.List(nil, nil)

// folder.Data() now returns the folder data from the last list
// folder.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
