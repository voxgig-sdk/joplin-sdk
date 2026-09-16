-- Typed models for the Joplin SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Folder
---@field created_time? number
---@field id? string
---@field is_shared? number
---@field parent_id? string
---@field title? string
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class FolderLoadMatch
---@field id string
---@field field? string

---@class FolderListMatch
---@field field? string
---@field order_by? string
---@field order_dir? string
---@field page? number

---@class FolderCreateData
---@field created_time? number
---@field id? string
---@field is_shared? number
---@field parent_id? string
---@field title? string
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class FolderUpdateData
---@field id string
---@field created_time? number
---@field is_shared? number
---@field parent_id? string
---@field title? string
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class FolderRemoveMatch
---@field id string

---@class Note
---@field altitude? number
---@field author? string
---@field body? string
---@field created_time? number
---@field id? string
---@field is_conflict? number
---@field is_todo? number
---@field latitude? number
---@field longitude? number
---@field markup_language? number
---@field parent_id? string
---@field source_url? string
---@field title? string
---@field todo_completed? number
---@field todo_due? number
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class NoteLoadMatch
---@field id string
---@field field? string

---@class NoteListMatch
---@field field? string
---@field order_by? string
---@field order_dir? string
---@field page? number

---@class NoteCreateData
---@field altitude? number
---@field author? string
---@field body? string
---@field created_time? number
---@field id? string
---@field is_conflict? number
---@field is_todo? number
---@field latitude? number
---@field longitude? number
---@field markup_language? number
---@field parent_id? string
---@field source_url? string
---@field title? string
---@field todo_completed? number
---@field todo_due? number
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class NoteUpdateData
---@field id string
---@field altitude? number
---@field author? string
---@field body? string
---@field created_time? number
---@field is_conflict? number
---@field is_todo? number
---@field latitude? number
---@field longitude? number
---@field markup_language? number
---@field parent_id? string
---@field source_url? string
---@field title? string
---@field todo_completed? number
---@field todo_due? number
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class NoteRemoveMatch
---@field id string

---@class Tag
---@field created_time? number
---@field id? string
---@field title? string
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class TagLoadMatch
---@field id string
---@field field? string

---@class TagListMatch
---@field field? string
---@field order_by? string
---@field order_dir? string
---@field page? number

---@class TagCreateData
---@field created_time? number
---@field id? string
---@field title? string
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class TagUpdateData
---@field id string
---@field created_time? number
---@field title? string
---@field updated_time? number
---@field user_created_time? number
---@field user_updated_time? number

---@class TagRemoveMatch
---@field id string

local M = {}

return M
