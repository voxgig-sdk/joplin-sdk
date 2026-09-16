// Typed models for the Joplin SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Folder {
  created_time?: number
  id?: string
  is_shared?: number
  parent_id?: string
  title?: string
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface FolderLoadMatch {
  id: string
  field?: string
}

export interface FolderListMatch {
  field?: string
  order_by?: string
  order_dir?: string
  page?: number

  // Selects a custom action instead of the plain list:
  //   'note'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface FolderCreateData {
  created_time?: number
  id?: string
  is_shared?: number
  parent_id?: string
  title?: string
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface FolderUpdateData {
  id: string
  created_time?: number
  is_shared?: number
  parent_id?: string
  title?: string
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface FolderRemoveMatch {
  id: string
}

export interface Note {
  altitude?: number
  author?: string
  body?: string
  created_time?: number
  id?: string
  is_conflict?: number
  is_todo?: number
  latitude?: number
  longitude?: number
  markup_language?: number
  parent_id?: string
  source_url?: string
  title?: string
  todo_completed?: number
  todo_due?: number
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface NoteLoadMatch {
  id: string
  field?: string
}

export interface NoteListMatch {
  field?: string
  order_by?: string
  order_dir?: string
  page?: number

  // Selects a custom action instead of the plain list:
  //   'tag'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface NoteCreateData {
  altitude?: number
  author?: string
  body?: string
  created_time?: number
  id?: string
  is_conflict?: number
  is_todo?: number
  latitude?: number
  longitude?: number
  markup_language?: number
  parent_id?: string
  source_url?: string
  title?: string
  todo_completed?: number
  todo_due?: number
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface NoteUpdateData {
  id: string
  altitude?: number
  author?: string
  body?: string
  created_time?: number
  is_conflict?: number
  is_todo?: number
  latitude?: number
  longitude?: number
  markup_language?: number
  parent_id?: string
  source_url?: string
  title?: string
  todo_completed?: number
  todo_due?: number
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface NoteRemoveMatch {
  id: string
}

export interface Tag {
  created_time?: number
  id?: string
  title?: string
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface TagLoadMatch {
  id: string
  field?: string
}

export interface TagListMatch {
  field?: string
  order_by?: string
  order_dir?: string
  page?: number

  // Selects a custom action instead of the plain list:
  //   'note'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface TagCreateData {
  created_time?: number
  id?: string
  title?: string
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface TagUpdateData {
  id: string
  created_time?: number
  title?: string
  updated_time?: number
  user_created_time?: number
  user_updated_time?: number
}

export interface TagRemoveMatch {
  id: string
}

