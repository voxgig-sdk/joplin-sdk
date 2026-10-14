# Joplin PHP SDK



The PHP SDK for the Joplin API — an entity-oriented client using PHP conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `$client->Folder()` — with named operations (`list`/`load`/`create`/`update`/`remove`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to Packagist. Install it from the
GitHub release tag (`php/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/joplin-sdk/tags)), or
from a clone as a Composer path repository:

```bash
git clone https://github.com/voxgig-sdk/joplin-sdk
composer config repositories.joplin-sdk path ./joplin-sdk/php
composer require voxgig-sdk/joplin-sdk:@dev
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key as the `token` query parameter.

### 1. Create a client

```php
<?php
require_once 'joplin_sdk.php';

$client = new JoplinSDK([
    "apikey" => getenv("JOPLIN_APIKEY"),
]);
```

### 2. List folder records

```php
try {
    // list() returns entity instances; data_get() reads each record.
    $folders = $client->Folder()->list();
    foreach ($folders as $record) {
        $item = $record->data_get();
        echo $item["id"] . " " . $item["created_time"] . "\n";
    }
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

### 3. Load a folder

```php
try {
    // load() returns the ENTITY — call data_get() for the Folder record (throws on error).
    $folder = $client->Folder()->load(["id" => "example_id"]);
    print_r($folder->data_get());
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

### 4. Create, update, and remove

```php
// create() returns the ENTITY — call data_get() for the created Folder record.
$created = $client->Folder()->create(["created_time" => 1, "is_shared" => 1]);

// Update — index the record via data_get() ($created->data_get()["id"]).
$client->Folder()->update(["id" => $created->data_get()["id"], "created_time" => 1, "is_shared" => 1]);

// Remove
$client->Folder()->remove(["id" => $created->data_get()["id"]]);
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
      "package": "voxgig-sdk/joplin-sdk" } } } } }
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

### Imperative: `connect()` — the retrofit path

Bind by passing the SDK class to the station:

1. `station = Station.open()` — profile, env, and proxy all defaulted.
2. `client = station.connect(JoplinSDK)` — replaces direct
   construction; `connect(JoplinSDK, { as: 'test' })` binds
   a second, tagged instance.

With no `station.json` at all this runs solo with everything
defaulted — the two-line form is how an existing application starts.

Station failures surface through this SDK's own error path
(`err.code`, `station_*`); the codes are catalogued in
[station error codes](https://github.com/voxgig/sdkgen/blob/main/docs/reference/station-errors.md).

## Error handling

Entity operations throw a `\Throwable` on failure, so wrap them in
`try` / `catch`:

```php
try {
    $folders = $client->Folder()->list();
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

`direct()` does **not** throw — it returns the result array. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```php
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example_id"],
]);

if (! $result["ok"]) {
    $err = $result["err"] ?? null;
    echo "request failed: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```php
// direct() is the raw-HTTP escape hatch: it returns a result array
// (it does not throw). Branch on $result["ok"].
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example"],
]);

if ($result["ok"]) {
    echo $result["status"];  // 200
    print_r($result["data"]);  // response body
} else {
    // On an HTTP error status there is no err (only a transport failure sets
    // it), so fall back to the status code.
    $err = $result["err"] ?? null;
    echo "Error: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```

### Prepare a request without sending it

```php
// prepare() throws on error and returns the fetch definition.
$fetchdef = $client->prepare([
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => ["id" => "example"],
]);

echo $fetchdef["url"];
echo $fetchdef["method"];
print_r($fetchdef["headers"]);
```

### Use test mode

Create a mock client for unit testing — no server required. Seed fixture
data via the `entity` option so offline calls resolve without a live server:

```php
$client = JoplinSDK::test([
    "entity" => ["folder" => ["test01" => ["id" => "test01"]]],
]);

// list() returns entity instances (throws on error);
// call data_get() for the mock record.
$folder = $client->Folder()->list();
print_r(array_map(fn($item) => $item->data_get(), $folder));
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```php
$mock_fetch = function ($url, $init) {
    return [
        [
            "status" => 200,
            "statusText" => "OK",
            "headers" => [],
            "json" => function () { return ["id" => "mock01"]; },
        ],
        null,
    ];
};

$client = new JoplinSDK([
    "base" => "http://localhost:8080",
    "system" => [
        "fetch" => $mock_fetch,
    ],
]);
```

### Run live tests

Create a `.env.local` file at the project root:

```
JOPLIN_TEST_LIVE=TRUE
JOPLIN_APIKEY=<your-key>
```

Then run:

```bash
cd php && ./vendor/bin/phpunit test/
```


## Reference

### JoplinSDK

```php
require_once 'joplin_sdk.php';
$client = new JoplinSDK($options);
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `array` | Feature activation flags. |
| `extend` | `array` | Additional Feature instances to load. |
| `system` | `array` | System overrides (e.g. custom `fetch` callable). |

### test

```php
$client = JoplinSDK::test($testopts, $sdkopts);
```

Creates a test-mode client with mock transport. Both arguments may be `null`.

### JoplinSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `(): array` | Deep copy of current SDK options. |
| `get_utility` | `(): Utility` | Copy of the SDK utility object. |
| `prepare` | `(array $fetchargs): array` | Build an HTTP request definition without sending. |
| `direct` | `(array $fetchargs): array` | Build and send an HTTP request. |
| `Folder` | `($data): FolderEntity` | Create a Folder entity instance. |
| `Note` | `($data): NoteEntity` | Create a Note entity instance. |
| `Tag` | `($data): TagEntity` | Create a Tag entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `($reqmatch, $ctrl): mixed` | Load a single entity by match criteria, and return it. |
| `list` | `(?array $reqmatch = null, $ctrl): mixed` | List entities matching the criteria (call with no argument to list all), one per record. |
| `create` | `($reqdata, $ctrl): mixed` | Create a new entity, and return it. |
| `update` | `($reqdata, $ctrl): mixed` | Update an existing entity, and return it. |
| `remove` | `($reqmatch, $ctrl): mixed` | Remove an entity, and return it marked as deleted. |
| `data_get` | `(): array` | Get entity data. |
| `data_set` | `($data): void` | Set entity data. |
| `match_get` | `(): array` | Get entity match criteria. |
| `match_set` | `($match): void` | Set entity match criteria. |
| `make` | `(): Entity` | Create a new instance with the same options. |
| `get_name` | `(): string` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `array` of entities, one
per record; an entity's `data_get()` reads its record (an `array`). They
throw on error, so wrap calls in `try`/`catch` to handle failures.

The `direct()` escape hatch never throws — it returns a result `array`
you branch on via `$result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `true` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `array` | Response headers. |
| `data` | `mixed` | Parsed JSON response body. |

On error, `ok` is `false` and `$err` contains the error value.

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

Create an instance: `$folder = $client->Folder();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

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

```php
// load() returns the ENTITY — call data_get() for the Folder record (throws on error).
$folder = $client->Folder()->load(["id" => "folder_id"]);
```

#### Example: List

```php
// list() returns an array of Folder entities, one per record (throws on error).
$folders = $client->Folder()->list();
```

#### Example: Create

```php
$folder = $client->Folder()->create([
]);
```


### Note

Create an instance: `$note = $client->Note();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `altitude` | `float` |  |
| `author` | `string` |  |
| `body` | `string` | The note body, in Markdown. |
| `created_time` | `int` | When the note was created. |
| `id` | `string` |  |
| `is_conflict` | `int` | Tells whether the note is a conflict or not. |
| `is_todo` | `int` | Tells whether this note is a to-do or not. |
| `latitude` | `float` |  |
| `longitude` | `float` |  |
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

```php
// load() returns the ENTITY — call data_get() for the Note record (throws on error).
$note = $client->Note()->load(["id" => "note_id"]);
```

#### Example: List

```php
// list() returns an array of Note entities, one per record (throws on error).
$notes = $client->Note()->list();
```

#### Example: Create

```php
$note = $client->Note()->create([
]);
```


### Tag

Create an instance: `$tag = $client->Tag();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

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

```php
// load() returns the ENTITY — call data_get() for the Tag record (throws on error).
$tag = $client->Tag()->load(["id" => "tag_id"]);
```

#### Example: List

```php
// list() returns an array of Tag entities, one per record (throws on error).
$tags = $client->Tag()->list();
```

#### Example: Create

```php
$tag = $client->Tag()->create([
]);
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

Features are the extension mechanism. A feature is a PHP class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

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

### Data as arrays

The PHP SDK uses plain PHP associative arrays throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers::to_map()` to safely validate that a value is an array.

### Directory structure

```
php/
├── joplin_sdk.php          -- Main SDK class
├── config.php                     -- Configuration
├── schema.php                     -- Generated option + entity specs
├── features.php                   -- Feature factory
├── core/                          -- Core types and context
├── entity/                        -- Entity implementations
├── feature/                       -- Built-in features (Base, Test, Log)
├── utility/                       -- Utility functions and struct library
└── test/                          -- Test suites
```

The main class (`joplin_sdk.php`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```php
$folder = $client->Folder();
$folder->list();

// $folder->data_get() now returns the folder data from the last list
// $folder->match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
