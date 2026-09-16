<?php
declare(strict_types=1);

// Typed models for the Joplin SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Folder entity data model. */
class Folder
{
    public ?int $created_time = null;
    public ?string $id = null;
    public ?int $is_shared = null;
    public ?string $parent_id = null;
    public ?string $title = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Folder#load. */
class FolderLoadMatch
{
    public string $id;
    public ?string $field = null;
}

/** Request payload for Folder#list. */
class FolderListMatch
{
    public ?string $field = null;
    public ?string $order_by = null;
    public ?string $order_dir = null;
    public ?int $page = null;
}

/** Request payload for Folder#create. */
class FolderCreateData
{
    public ?int $created_time = null;
    public ?string $id = null;
    public ?int $is_shared = null;
    public ?string $parent_id = null;
    public ?string $title = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Folder#update. */
class FolderUpdateData
{
    public string $id;
    public ?int $created_time = null;
    public ?int $is_shared = null;
    public ?string $parent_id = null;
    public ?string $title = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Folder#remove. */
class FolderRemoveMatch
{
    public string $id;
}

/** Note entity data model. */
class Note
{
    public ?float $altitude = null;
    public ?string $author = null;
    public ?string $body = null;
    public ?int $created_time = null;
    public ?string $id = null;
    public ?int $is_conflict = null;
    public ?int $is_todo = null;
    public ?float $latitude = null;
    public ?float $longitude = null;
    public ?int $markup_language = null;
    public ?string $parent_id = null;
    public ?string $source_url = null;
    public ?string $title = null;
    public ?int $todo_completed = null;
    public ?int $todo_due = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Note#load. */
class NoteLoadMatch
{
    public string $id;
    public ?string $field = null;
}

/** Request payload for Note#list. */
class NoteListMatch
{
    public ?string $field = null;
    public ?string $order_by = null;
    public ?string $order_dir = null;
    public ?int $page = null;
}

/** Request payload for Note#create. */
class NoteCreateData
{
    public ?float $altitude = null;
    public ?string $author = null;
    public ?string $body = null;
    public ?int $created_time = null;
    public ?string $id = null;
    public ?int $is_conflict = null;
    public ?int $is_todo = null;
    public ?float $latitude = null;
    public ?float $longitude = null;
    public ?int $markup_language = null;
    public ?string $parent_id = null;
    public ?string $source_url = null;
    public ?string $title = null;
    public ?int $todo_completed = null;
    public ?int $todo_due = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Note#update. */
class NoteUpdateData
{
    public string $id;
    public ?float $altitude = null;
    public ?string $author = null;
    public ?string $body = null;
    public ?int $created_time = null;
    public ?int $is_conflict = null;
    public ?int $is_todo = null;
    public ?float $latitude = null;
    public ?float $longitude = null;
    public ?int $markup_language = null;
    public ?string $parent_id = null;
    public ?string $source_url = null;
    public ?string $title = null;
    public ?int $todo_completed = null;
    public ?int $todo_due = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Note#remove. */
class NoteRemoveMatch
{
    public string $id;
}

/** Tag entity data model. */
class Tag
{
    public ?int $created_time = null;
    public ?string $id = null;
    public ?string $title = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Tag#load. */
class TagLoadMatch
{
    public string $id;
    public ?string $field = null;
}

/** Request payload for Tag#list. */
class TagListMatch
{
    public ?string $field = null;
    public ?string $order_by = null;
    public ?string $order_dir = null;
    public ?int $page = null;
}

/** Request payload for Tag#create. */
class TagCreateData
{
    public ?int $created_time = null;
    public ?string $id = null;
    public ?string $title = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Tag#update. */
class TagUpdateData
{
    public string $id;
    public ?int $created_time = null;
    public ?string $title = null;
    public ?int $updated_time = null;
    public ?int $user_created_time = null;
    public ?int $user_updated_time = null;
}

/** Request payload for Tag#remove. */
class TagRemoveMatch
{
    public string $id;
}

