# frozen_string_literal: true

# Typed models for the Joplin SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Folder entity data model.
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] is_shared
#   @return [Integer, nil]
#
# @!attribute [rw] parent_id
#   @return [String, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
Folder = Struct.new(
  :created_time,
  :id,
  :is_shared,
  :parent_id,
  :title,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Folder#load.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] field
#   @return [String, nil]
FolderLoadMatch = Struct.new(
  :id,
  :field,
  keyword_init: true
)

# Request payload for Folder#list.
#
# @!attribute [rw] field
#   @return [String, nil]
#
# @!attribute [rw] order_by
#   @return [String, nil]
#
# @!attribute [rw] order_dir
#   @return [String, nil]
#
# @!attribute [rw] page
#   @return [Integer, nil]
FolderListMatch = Struct.new(
  :field,
  :order_by,
  :order_dir,
  :page,
  keyword_init: true
)

# Request payload for Folder#create.
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] is_shared
#   @return [Integer, nil]
#
# @!attribute [rw] parent_id
#   @return [String, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
FolderCreateData = Struct.new(
  :created_time,
  :id,
  :is_shared,
  :parent_id,
  :title,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Folder#update.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] is_shared
#   @return [Integer, nil]
#
# @!attribute [rw] parent_id
#   @return [String, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
FolderUpdateData = Struct.new(
  :id,
  :created_time,
  :is_shared,
  :parent_id,
  :title,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Folder#remove.
#
# @!attribute [rw] id
#   @return [String]
FolderRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

# Note entity data model.
#
# @!attribute [rw] altitude
#   @return [Float, nil]
#
# @!attribute [rw] author
#   @return [String, nil]
#
# @!attribute [rw] body
#   @return [String, nil]
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] is_conflict
#   @return [Integer, nil]
#
# @!attribute [rw] is_todo
#   @return [Integer, nil]
#
# @!attribute [rw] latitude
#   @return [Float, nil]
#
# @!attribute [rw] longitude
#   @return [Float, nil]
#
# @!attribute [rw] markup_language
#   @return [Integer, nil]
#
# @!attribute [rw] parent_id
#   @return [String, nil]
#
# @!attribute [rw] source_url
#   @return [String, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] todo_completed
#   @return [Integer, nil]
#
# @!attribute [rw] todo_due
#   @return [Integer, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
Note = Struct.new(
  :altitude,
  :author,
  :body,
  :created_time,
  :id,
  :is_conflict,
  :is_todo,
  :latitude,
  :longitude,
  :markup_language,
  :parent_id,
  :source_url,
  :title,
  :todo_completed,
  :todo_due,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Note#load.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] field
#   @return [String, nil]
NoteLoadMatch = Struct.new(
  :id,
  :field,
  keyword_init: true
)

# Request payload for Note#list.
#
# @!attribute [rw] field
#   @return [String, nil]
#
# @!attribute [rw] order_by
#   @return [String, nil]
#
# @!attribute [rw] order_dir
#   @return [String, nil]
#
# @!attribute [rw] page
#   @return [Integer, nil]
NoteListMatch = Struct.new(
  :field,
  :order_by,
  :order_dir,
  :page,
  keyword_init: true
)

# Request payload for Note#create.
#
# @!attribute [rw] altitude
#   @return [Float, nil]
#
# @!attribute [rw] author
#   @return [String, nil]
#
# @!attribute [rw] body
#   @return [String, nil]
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] is_conflict
#   @return [Integer, nil]
#
# @!attribute [rw] is_todo
#   @return [Integer, nil]
#
# @!attribute [rw] latitude
#   @return [Float, nil]
#
# @!attribute [rw] longitude
#   @return [Float, nil]
#
# @!attribute [rw] markup_language
#   @return [Integer, nil]
#
# @!attribute [rw] parent_id
#   @return [String, nil]
#
# @!attribute [rw] source_url
#   @return [String, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] todo_completed
#   @return [Integer, nil]
#
# @!attribute [rw] todo_due
#   @return [Integer, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
NoteCreateData = Struct.new(
  :altitude,
  :author,
  :body,
  :created_time,
  :id,
  :is_conflict,
  :is_todo,
  :latitude,
  :longitude,
  :markup_language,
  :parent_id,
  :source_url,
  :title,
  :todo_completed,
  :todo_due,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Note#update.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] altitude
#   @return [Float, nil]
#
# @!attribute [rw] author
#   @return [String, nil]
#
# @!attribute [rw] body
#   @return [String, nil]
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] is_conflict
#   @return [Integer, nil]
#
# @!attribute [rw] is_todo
#   @return [Integer, nil]
#
# @!attribute [rw] latitude
#   @return [Float, nil]
#
# @!attribute [rw] longitude
#   @return [Float, nil]
#
# @!attribute [rw] markup_language
#   @return [Integer, nil]
#
# @!attribute [rw] parent_id
#   @return [String, nil]
#
# @!attribute [rw] source_url
#   @return [String, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] todo_completed
#   @return [Integer, nil]
#
# @!attribute [rw] todo_due
#   @return [Integer, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
NoteUpdateData = Struct.new(
  :id,
  :altitude,
  :author,
  :body,
  :created_time,
  :is_conflict,
  :is_todo,
  :latitude,
  :longitude,
  :markup_language,
  :parent_id,
  :source_url,
  :title,
  :todo_completed,
  :todo_due,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Note#remove.
#
# @!attribute [rw] id
#   @return [String]
NoteRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

# Tag entity data model.
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
Tag = Struct.new(
  :created_time,
  :id,
  :title,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Tag#load.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] field
#   @return [String, nil]
TagLoadMatch = Struct.new(
  :id,
  :field,
  keyword_init: true
)

# Request payload for Tag#list.
#
# @!attribute [rw] field
#   @return [String, nil]
#
# @!attribute [rw] order_by
#   @return [String, nil]
#
# @!attribute [rw] order_dir
#   @return [String, nil]
#
# @!attribute [rw] page
#   @return [Integer, nil]
TagListMatch = Struct.new(
  :field,
  :order_by,
  :order_dir,
  :page,
  keyword_init: true
)

# Request payload for Tag#create.
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
TagCreateData = Struct.new(
  :created_time,
  :id,
  :title,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Tag#update.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] created_time
#   @return [Integer, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] updated_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_created_time
#   @return [Integer, nil]
#
# @!attribute [rw] user_updated_time
#   @return [Integer, nil]
TagUpdateData = Struct.new(
  :id,
  :created_time,
  :title,
  :updated_time,
  :user_created_time,
  :user_updated_time,
  keyword_init: true
)

# Request payload for Tag#remove.
#
# @!attribute [rw] id
#   @return [String]
TagRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

