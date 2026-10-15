# Joplin Data API

> The Joplin Data API, served by the Clipper Server that the Joplin desktop application runs locally. Scoped here to the three core item types: notes, folders (notebooks) and tags.
>
> Unofficial definition, authored by Voxgig from the published Joplin REST API reference. Not an official Joplin document.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 3 entities and 18 HTTP routes. There are 7 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Folder

Results: The created folder.; The item.; A page of results.; Deleted.; The updated folder.

SDK operations: `create`, `list`, `load`, `remove`, `update`.

Key fields to recognise:

- `created_time`: When the folder was created.
- `parent_id`: ID of the parent notebook, empty for a top-level notebook.
- `title`: The folder title.
- `updated_time`: When the folder was last updated.
- `user_created_time`: When the folder was created. May differ from `created_time` as the user can set it.

### Note

Results: The created note.; The item.; A page of results.; Deleted.; The updated note.

SDK operations: `create`, `list`, `load`, `remove`, `update`.

Key fields to recognise:

- `body`: The note body, in Markdown. May also contain HTML.
- `created_time`: When the note was created.
- `is_conflict`: Tells whether the note is a conflict or not.
- `is_todo`: Tells whether this note is a to-do or not.
- `markup_language`: 1 for Markdown, 2 for HTML.

### Tag

Results: The created tag.; The item.; A page of results.; Deleted.; The updated tag.

SDK operations: `create`, `list`, `load`, `remove`, `update`.

Key fields to recognise:

- `created_time`: When the tag was created.
- `title`: The tag title.
- `updated_time`: When the tag was last updated.
- `user_created_time`: When the tag was created. May differ from `created_time` as the user can set it.
- `user_updated_time`: When the tag was last updated. May differ from `updated_time` as the user can set it.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| Folder | `create` | `POST /folders` | Required |
| Folder | `list` | `GET /folders/{id}/notes` | Required |
| Folder | `list` | `GET /folders` | Required |
| Folder | `load` | `GET /folders/{id}` | Required |
| Folder | `remove` | `DELETE /folders/{id}` | Required |
| Folder | `update` | `PUT /folders/{id}` | Required |
| Note | `create` | `POST /notes` | Required |
| Note | `list` | `GET /notes/{id}/tags` | Required |
| Note | `list` | `GET /notes` | Required |
| Note | `load` | `GET /notes/{id}` | Required |
| Note | `remove` | `DELETE /notes/{id}` | Required |
| Note | `update` | `PUT /notes/{id}` | Required |
| Tag | `create` | `POST /tags` | Required |
| Tag | `list` | `GET /tags/{id}/notes` | Required |
| Tag | `list` | `GET /tags` | Required |
| Tag | `load` | `GET /tags/{id}` | Required |
| Tag | `remove` | `DELETE /tags/{id}` | Required |
| Tag | `update` | `PUT /tags/{id}` | Required |

## Connect to the API

- The Clipper Server, enabled in Joplin under Options, Web Clipper.: `http://localhost:41184`

The default credential is sent in the `token` query.

The Web Clipper authorisation token, shown in Joplin under Options, Web Clipper.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| C | `c/` | Build from source |
| Golang | `go/` | Build from source |
| Lua | `lua/` | Build from source |
| PHP | `php/` | Build from source |
| Python | `py/` | Build from source |
| Ruby | `rb/` | Build from source |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### Go CLI

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### Go MCP server

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `joplin_list`: List records for an entity. Supported entities: `folder`, `note`, `tag`.
- `joplin_load`: Load one record for an entity. Supported entities: `folder`, `note`, `tag`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `debug`: Request/response capture ring buffer for debugging
- `idempotency`: Idempotency keys for safe retries of mutating operations
- `metrics`: Statistics capture: per-operation counters and latency
- `paging`: Pagination signals for list operations
- `ratelimit`: Client-side rate limiting via a token bucket
- `retry`: Automatic retry of transient failures with exponential backoff
- `station`: Station control surface binding for outbound integrations
- `test`: In-memory mock transport for testing without a live server
- `timeout`: Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

