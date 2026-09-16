// Typed models for the Joplin SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/joplin-sdk/go/core"
)

// Folder is the typed data model for the folder entity.
type Folder struct {
	CreatedTime *int `json:"created_time,omitempty"`
	Id *string `json:"id,omitempty"`
	IsShared *int `json:"is_shared,omitempty"`
	ParentId *string `json:"parent_id,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// FolderLoadMatch is the typed request payload for Folder.LoadTyped.
type FolderLoadMatch struct {
	Id string `json:"id"`
	Field *string `json:"field,omitempty"`
}

// FolderListMatch is the typed request payload for Folder.ListTyped.
type FolderListMatch struct {
	Field *string `json:"field,omitempty"`
	OrderBy *string `json:"order_by,omitempty"`
	OrderDir *string `json:"order_dir,omitempty"`
	Page *int `json:"page,omitempty"`
}

// FolderCreateData is the typed request payload for Folder.CreateTyped.
type FolderCreateData struct {
	CreatedTime *int `json:"created_time,omitempty"`
	Id *string `json:"id,omitempty"`
	IsShared *int `json:"is_shared,omitempty"`
	ParentId *string `json:"parent_id,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// FolderUpdateData is the typed request payload for Folder.UpdateTyped.
type FolderUpdateData struct {
	Id string `json:"id"`
	CreatedTime *int `json:"created_time,omitempty"`
	IsShared *int `json:"is_shared,omitempty"`
	ParentId *string `json:"parent_id,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// FolderRemoveMatch is the typed request payload for Folder.RemoveTyped.
type FolderRemoveMatch struct {
	Id string `json:"id"`
}

// Note is the typed data model for the note entity.
type Note struct {
	Altitude *float64 `json:"altitude,omitempty"`
	Author *string `json:"author,omitempty"`
	Body *string `json:"body,omitempty"`
	CreatedTime *int `json:"created_time,omitempty"`
	Id *string `json:"id,omitempty"`
	IsConflict *int `json:"is_conflict,omitempty"`
	IsTodo *int `json:"is_todo,omitempty"`
	Latitude *float64 `json:"latitude,omitempty"`
	Longitude *float64 `json:"longitude,omitempty"`
	MarkupLanguage *int `json:"markup_language,omitempty"`
	ParentId *string `json:"parent_id,omitempty"`
	SourceUrl *string `json:"source_url,omitempty"`
	Title *string `json:"title,omitempty"`
	TodoCompleted *int `json:"todo_completed,omitempty"`
	TodoDue *int `json:"todo_due,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// NoteLoadMatch is the typed request payload for Note.LoadTyped.
type NoteLoadMatch struct {
	Id string `json:"id"`
	Field *string `json:"field,omitempty"`
}

// NoteListMatch is the typed request payload for Note.ListTyped.
type NoteListMatch struct {
	Field *string `json:"field,omitempty"`
	OrderBy *string `json:"order_by,omitempty"`
	OrderDir *string `json:"order_dir,omitempty"`
	Page *int `json:"page,omitempty"`
}

// NoteCreateData is the typed request payload for Note.CreateTyped.
type NoteCreateData struct {
	Altitude *float64 `json:"altitude,omitempty"`
	Author *string `json:"author,omitempty"`
	Body *string `json:"body,omitempty"`
	CreatedTime *int `json:"created_time,omitempty"`
	Id *string `json:"id,omitempty"`
	IsConflict *int `json:"is_conflict,omitempty"`
	IsTodo *int `json:"is_todo,omitempty"`
	Latitude *float64 `json:"latitude,omitempty"`
	Longitude *float64 `json:"longitude,omitempty"`
	MarkupLanguage *int `json:"markup_language,omitempty"`
	ParentId *string `json:"parent_id,omitempty"`
	SourceUrl *string `json:"source_url,omitempty"`
	Title *string `json:"title,omitempty"`
	TodoCompleted *int `json:"todo_completed,omitempty"`
	TodoDue *int `json:"todo_due,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// NoteUpdateData is the typed request payload for Note.UpdateTyped.
type NoteUpdateData struct {
	Id string `json:"id"`
	Altitude *float64 `json:"altitude,omitempty"`
	Author *string `json:"author,omitempty"`
	Body *string `json:"body,omitempty"`
	CreatedTime *int `json:"created_time,omitempty"`
	IsConflict *int `json:"is_conflict,omitempty"`
	IsTodo *int `json:"is_todo,omitempty"`
	Latitude *float64 `json:"latitude,omitempty"`
	Longitude *float64 `json:"longitude,omitempty"`
	MarkupLanguage *int `json:"markup_language,omitempty"`
	ParentId *string `json:"parent_id,omitempty"`
	SourceUrl *string `json:"source_url,omitempty"`
	Title *string `json:"title,omitempty"`
	TodoCompleted *int `json:"todo_completed,omitempty"`
	TodoDue *int `json:"todo_due,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// NoteRemoveMatch is the typed request payload for Note.RemoveTyped.
type NoteRemoveMatch struct {
	Id string `json:"id"`
}

// Tag is the typed data model for the tag entity.
type Tag struct {
	CreatedTime *int `json:"created_time,omitempty"`
	Id *string `json:"id,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// TagLoadMatch is the typed request payload for Tag.LoadTyped.
type TagLoadMatch struct {
	Id string `json:"id"`
	Field *string `json:"field,omitempty"`
}

// TagListMatch is the typed request payload for Tag.ListTyped.
type TagListMatch struct {
	Field *string `json:"field,omitempty"`
	OrderBy *string `json:"order_by,omitempty"`
	OrderDir *string `json:"order_dir,omitempty"`
	Page *int `json:"page,omitempty"`
}

// TagCreateData is the typed request payload for Tag.CreateTyped.
type TagCreateData struct {
	CreatedTime *int `json:"created_time,omitempty"`
	Id *string `json:"id,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// TagUpdateData is the typed request payload for Tag.UpdateTyped.
type TagUpdateData struct {
	Id string `json:"id"`
	CreatedTime *int `json:"created_time,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedTime *int `json:"updated_time,omitempty"`
	UserCreatedTime *int `json:"user_created_time,omitempty"`
	UserUpdatedTime *int `json:"user_updated_time,omitempty"`
}

// TagRemoveMatch is the typed request payload for Tag.RemoveTyped.
type TagRemoveMatch struct {
	Id string `json:"id"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
