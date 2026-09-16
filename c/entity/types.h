// Typed models for the Joplin SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types are mapped
// from the canonical type sentinels. Do not edit by hand.
//
// These are DOCUMENTARY: the SDK runtime is dynamic (ops take/return
// `voxgig_value*`), so nothing consumes these structs yet — they mirror the
// entity/op shapes for reference and IDE support. This header is standalone
// and is not #included by any generated .c.

#ifndef JOPLIN_ENTITY_TYPES_H
#define JOPLIN_ENTITY_TYPES_H

#include "sdk.h"

// Folder is the typed data model for the folder entity.
typedef struct {
  int64_t created_time;  // optional
  char*id;  // optional
  int64_t is_shared;  // optional
  char*parent_id;  // optional
  char*title;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} Folder;

// FolderLoadMatch is the typed request payload for Folder.load.
typedef struct {
  char*id;
  char*field;  // optional
} FolderLoadMatch;

// FolderListMatch is the typed request payload for Folder.list.
typedef struct {
  char*field;  // optional
  char*order_by;  // optional
  char*order_dir;  // optional
  int64_t page;  // optional
} FolderListMatch;

// FolderCreateData is the typed request payload for Folder.create.
typedef struct {
  int64_t created_time;  // optional
  char*id;  // optional
  int64_t is_shared;  // optional
  char*parent_id;  // optional
  char*title;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} FolderCreateData;

// FolderUpdateData is the typed request payload for Folder.update.
typedef struct {
  char*id;
  int64_t created_time;  // optional
  int64_t is_shared;  // optional
  char*parent_id;  // optional
  char*title;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} FolderUpdateData;

// FolderRemoveMatch is the typed request payload for Folder.remove.
typedef struct {
  char*id;
} FolderRemoveMatch;

// Note is the typed data model for the note entity.
typedef struct {
  double altitude;  // optional
  char*author;  // optional
  char*body;  // optional
  int64_t created_time;  // optional
  char*id;  // optional
  int64_t is_conflict;  // optional
  int64_t is_todo;  // optional
  double latitude;  // optional
  double longitude;  // optional
  int64_t markup_language;  // optional
  char*parent_id;  // optional
  char*source_url;  // optional
  char*title;  // optional
  int64_t todo_completed;  // optional
  int64_t todo_due;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} Note;

// NoteLoadMatch is the typed request payload for Note.load.
typedef struct {
  char*id;
  char*field;  // optional
} NoteLoadMatch;

// NoteListMatch is the typed request payload for Note.list.
typedef struct {
  char*field;  // optional
  char*order_by;  // optional
  char*order_dir;  // optional
  int64_t page;  // optional
} NoteListMatch;

// NoteCreateData is the typed request payload for Note.create.
typedef struct {
  double altitude;  // optional
  char*author;  // optional
  char*body;  // optional
  int64_t created_time;  // optional
  char*id;  // optional
  int64_t is_conflict;  // optional
  int64_t is_todo;  // optional
  double latitude;  // optional
  double longitude;  // optional
  int64_t markup_language;  // optional
  char*parent_id;  // optional
  char*source_url;  // optional
  char*title;  // optional
  int64_t todo_completed;  // optional
  int64_t todo_due;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} NoteCreateData;

// NoteUpdateData is the typed request payload for Note.update.
typedef struct {
  char*id;
  double altitude;  // optional
  char*author;  // optional
  char*body;  // optional
  int64_t created_time;  // optional
  int64_t is_conflict;  // optional
  int64_t is_todo;  // optional
  double latitude;  // optional
  double longitude;  // optional
  int64_t markup_language;  // optional
  char*parent_id;  // optional
  char*source_url;  // optional
  char*title;  // optional
  int64_t todo_completed;  // optional
  int64_t todo_due;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} NoteUpdateData;

// NoteRemoveMatch is the typed request payload for Note.remove.
typedef struct {
  char*id;
} NoteRemoveMatch;

// Tag is the typed data model for the tag entity.
typedef struct {
  int64_t created_time;  // optional
  char*id;  // optional
  char*title;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} Tag;

// TagLoadMatch is the typed request payload for Tag.load.
typedef struct {
  char*id;
  char*field;  // optional
} TagLoadMatch;

// TagListMatch is the typed request payload for Tag.list.
typedef struct {
  char*field;  // optional
  char*order_by;  // optional
  char*order_dir;  // optional
  int64_t page;  // optional
} TagListMatch;

// TagCreateData is the typed request payload for Tag.create.
typedef struct {
  int64_t created_time;  // optional
  char*id;  // optional
  char*title;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} TagCreateData;

// TagUpdateData is the typed request payload for Tag.update.
typedef struct {
  char*id;
  int64_t created_time;  // optional
  char*title;  // optional
  int64_t updated_time;  // optional
  int64_t user_created_time;  // optional
  int64_t user_updated_time;  // optional
} TagUpdateData;

// TagRemoveMatch is the typed request payload for Tag.remove.
typedef struct {
  char*id;
} TagRemoveMatch;

#endif // JOPLIN_ENTITY_TYPES_H
