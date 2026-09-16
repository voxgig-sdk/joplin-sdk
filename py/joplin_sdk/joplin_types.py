# Typed models for the Joplin SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Folder(TypedDict, total=False):
    created_time: int
    id: str
    is_shared: int
    parent_id: str
    title: str
    updated_time: int
    user_created_time: int
    user_updated_time: int


class FolderLoadMatchRequired(TypedDict):
    id: str


class FolderLoadMatch(FolderLoadMatchRequired, total=False):
    field: str


class FolderListMatch(TypedDict, total=False):
    field: str
    order_by: str
    order_dir: str
    page: int


class FolderCreateData(TypedDict, total=False):
    created_time: int
    id: str
    is_shared: int
    parent_id: str
    title: str
    updated_time: int
    user_created_time: int
    user_updated_time: int


class FolderUpdateDataRequired(TypedDict):
    id: str


class FolderUpdateData(FolderUpdateDataRequired, total=False):
    created_time: int
    is_shared: int
    parent_id: str
    title: str
    updated_time: int
    user_created_time: int
    user_updated_time: int


class FolderRemoveMatch(TypedDict):
    id: str


class Note(TypedDict, total=False):
    altitude: float
    author: str
    body: str
    created_time: int
    id: str
    is_conflict: int
    is_todo: int
    latitude: float
    longitude: float
    markup_language: int
    parent_id: str
    source_url: str
    title: str
    todo_completed: int
    todo_due: int
    updated_time: int
    user_created_time: int
    user_updated_time: int


class NoteLoadMatchRequired(TypedDict):
    id: str


class NoteLoadMatch(NoteLoadMatchRequired, total=False):
    field: str


class NoteListMatch(TypedDict, total=False):
    field: str
    order_by: str
    order_dir: str
    page: int


class NoteCreateData(TypedDict, total=False):
    altitude: float
    author: str
    body: str
    created_time: int
    id: str
    is_conflict: int
    is_todo: int
    latitude: float
    longitude: float
    markup_language: int
    parent_id: str
    source_url: str
    title: str
    todo_completed: int
    todo_due: int
    updated_time: int
    user_created_time: int
    user_updated_time: int


class NoteUpdateDataRequired(TypedDict):
    id: str


class NoteUpdateData(NoteUpdateDataRequired, total=False):
    altitude: float
    author: str
    body: str
    created_time: int
    is_conflict: int
    is_todo: int
    latitude: float
    longitude: float
    markup_language: int
    parent_id: str
    source_url: str
    title: str
    todo_completed: int
    todo_due: int
    updated_time: int
    user_created_time: int
    user_updated_time: int


class NoteRemoveMatch(TypedDict):
    id: str


class Tag(TypedDict, total=False):
    created_time: int
    id: str
    title: str
    updated_time: int
    user_created_time: int
    user_updated_time: int


class TagLoadMatchRequired(TypedDict):
    id: str


class TagLoadMatch(TagLoadMatchRequired, total=False):
    field: str


class TagListMatch(TypedDict, total=False):
    field: str
    order_by: str
    order_dir: str
    page: int


class TagCreateData(TypedDict, total=False):
    created_time: int
    id: str
    title: str
    updated_time: int
    user_created_time: int
    user_updated_time: int


class TagUpdateDataRequired(TypedDict):
    id: str


class TagUpdateData(TagUpdateDataRequired, total=False):
    created_time: int
    title: str
    updated_time: int
    user_created_time: int
    user_updated_time: int


class TagRemoveMatch(TypedDict):
    id: str
