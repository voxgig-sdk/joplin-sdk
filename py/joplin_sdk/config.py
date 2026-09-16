# Joplin SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "Joplin",
            "slug": "joplin",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "debug": {
        "options": {
          "active": False,
          "max": 100,
          "redact": [
            "authorization",
            "cookie",
            "set-cookie",
            "api-key",
            "apikey",
            "x-api-key",
            "idempotency-key",
          ],
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "onEntry": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "idempotency": {
        "options": {
          "active": False,
          "header": "Idempotency-Key",
          "methods": [
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          ],
          "ops": [
            "create",
            "update",
            "remove",
          ],
        },
        "optspec": {
          "keygen": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "metrics": {
        "options": {
          "active": False,
        },
        "optspec": {
          "now": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "paging": {
        "options": {
          "active": False,
          "afterVar": "after",
          "cursorParam": "cursor",
          "firstVar": "first",
          "limitParam": "limit",
          "pageParam": "page",
          "startPage": 1,
        },
        "optspec": {
          "limit": "`$NUMBER`",
          "ops": "`$LIST`",
        },
        "strict": False,
        "transport": "none",
      },
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
          "factor": 2,
          "maxDelay": 2000,
          "minDelay": 50,
          "retries": 2,
          "statuses": [
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "http://localhost:41184",
            "auth": {
                "prefix": "",
            },
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "folder": {},
                "note": {},
                "tag": {},
            },
        },
        "entity": {
      "folder": {
        "fields": [
          {
            "name": "created_time",
            "short": "When the folder was created.",
            "type": "`$INTEGER`",
          },
          {
            "name": "id",
            "type": "`$STRING`",
          },
          {
            "name": "is_shared",
            "type": "`$INTEGER`",
          },
          {
            "name": "parent_id",
            "short": "ID of the parent notebook, empty for a top-level notebook.",
            "type": "`$STRING`",
          },
          {
            "name": "title",
            "short": "The folder title.",
            "type": "`$STRING`",
          },
          {
            "name": "updated_time",
            "short": "When the folder was last updated.",
            "type": "`$INTEGER`",
          },
          {
            "name": "user_created_time",
            "short": "When the folder was created.",
            "type": "`$INTEGER`",
          },
          {
            "name": "user_updated_time",
            "short": "When the folder was last updated.",
            "type": "`$INTEGER`",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "folder",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "args": {},
                "kind": "http",
                "method": "POST",
                "orig": "/folders",
                "segments": [
                  {
                    "lit": "folders",
                  },
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "folders",
                ],
              },
            ],
          },
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "args": {
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                    {
                      "kind": "query",
                      "name": "order_by",
                      "orig": "order_by",
                      "type": "`$STRING`",
                    },
                    {
                      "kind": "query",
                      "name": "order_dir",
                      "orig": "order_dir",
                      "type": "`$STRING`",
                    },
                    {
                      "example": 1,
                      "kind": "query",
                      "name": "page",
                      "orig": "page",
                      "type": "`$INTEGER`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/folders",
                "segments": [
                  {
                    "lit": "folders",
                  },
                ],
                "select": {
                  "exist": [
                    "field",
                    "order_by",
                    "order_dir",
                    "page",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.items`",
                },
                "parts": [
                  "folders",
                ],
              },
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/folders/{id}/notes",
                "segments": [
                  {
                    "lit": "folders",
                  },
                  {
                    "var": "id",
                  },
                  {
                    "lit": "notes",
                  },
                ],
                "select": {
                  "$action": "note",
                  "exist": [
                    "field",
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.items`",
                },
                "parts": [
                  "folders",
                  "{id}",
                  "notes",
                ],
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/folders/{id}",
                "segments": [
                  {
                    "lit": "folders",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "field",
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "folders",
                  "{id}",
                ],
              },
            ],
          },
          "remove": {
            "input": "data",
            "name": "remove",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "DELETE",
                "orig": "/folders/{id}",
                "segments": [
                  {
                    "lit": "folders",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "folders",
                  "{id}",
                ],
              },
            ],
          },
          "update": {
            "input": "data",
            "name": "update",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "PUT",
                "orig": "/folders/{id}",
                "segments": [
                  {
                    "lit": "folders",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "folders",
                  "{id}",
                ],
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "note": {
        "fields": [
          {
            "name": "altitude",
            "type": "`$NUMBER`",
          },
          {
            "name": "author",
            "type": "`$STRING`",
          },
          {
            "name": "body",
            "short": "The note body, in Markdown.",
            "type": "`$STRING`",
          },
          {
            "name": "created_time",
            "short": "When the note was created.",
            "type": "`$INTEGER`",
          },
          {
            "name": "id",
            "type": "`$STRING`",
          },
          {
            "name": "is_conflict",
            "short": "Tells whether the note is a conflict or not.",
            "type": "`$INTEGER`",
          },
          {
            "name": "is_todo",
            "short": "Tells whether this note is a to-do or not.",
            "type": "`$INTEGER`",
          },
          {
            "name": "latitude",
            "type": "`$NUMBER`",
          },
          {
            "name": "longitude",
            "type": "`$NUMBER`",
          },
          {
            "name": "markup_language",
            "short": "1 for Markdown, 2 for HTML.",
            "type": "`$INTEGER`",
          },
          {
            "name": "parent_id",
            "short": "ID of the notebook that contains this note.",
            "type": "`$STRING`",
          },
          {
            "name": "source_url",
            "short": "The full URL where the note comes from.",
            "type": "`$STRING`",
          },
          {
            "name": "title",
            "short": "The note title.",
            "type": "`$STRING`",
          },
          {
            "name": "todo_completed",
            "short": "When the to-do was completed.",
            "type": "`$INTEGER`",
          },
          {
            "name": "todo_due",
            "short": "When the to-do is due.",
            "type": "`$INTEGER`",
          },
          {
            "name": "updated_time",
            "short": "When the note was last updated.",
            "type": "`$INTEGER`",
          },
          {
            "name": "user_created_time",
            "short": "When the note was created.",
            "type": "`$INTEGER`",
          },
          {
            "name": "user_updated_time",
            "short": "When the note was last updated.",
            "type": "`$INTEGER`",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "note",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "args": {},
                "kind": "http",
                "method": "POST",
                "orig": "/notes",
                "segments": [
                  {
                    "lit": "notes",
                  },
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "notes",
                ],
              },
            ],
          },
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "args": {
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                    {
                      "kind": "query",
                      "name": "order_by",
                      "orig": "order_by",
                      "type": "`$STRING`",
                    },
                    {
                      "kind": "query",
                      "name": "order_dir",
                      "orig": "order_dir",
                      "type": "`$STRING`",
                    },
                    {
                      "example": 1,
                      "kind": "query",
                      "name": "page",
                      "orig": "page",
                      "type": "`$INTEGER`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/notes",
                "segments": [
                  {
                    "lit": "notes",
                  },
                ],
                "select": {
                  "exist": [
                    "field",
                    "order_by",
                    "order_dir",
                    "page",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.items`",
                },
                "parts": [
                  "notes",
                ],
              },
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/notes/{id}/tags",
                "segments": [
                  {
                    "lit": "notes",
                  },
                  {
                    "var": "id",
                  },
                  {
                    "lit": "tags",
                  },
                ],
                "select": {
                  "$action": "tag",
                  "exist": [
                    "field",
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.items`",
                },
                "parts": [
                  "notes",
                  "{id}",
                  "tags",
                ],
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/notes/{id}",
                "segments": [
                  {
                    "lit": "notes",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "field",
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "notes",
                  "{id}",
                ],
              },
            ],
          },
          "remove": {
            "input": "data",
            "name": "remove",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "DELETE",
                "orig": "/notes/{id}",
                "segments": [
                  {
                    "lit": "notes",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "notes",
                  "{id}",
                ],
              },
            ],
          },
          "update": {
            "input": "data",
            "name": "update",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "PUT",
                "orig": "/notes/{id}",
                "segments": [
                  {
                    "lit": "notes",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "notes",
                  "{id}",
                ],
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "tag": {
        "fields": [
          {
            "name": "created_time",
            "short": "When the tag was created.",
            "type": "`$INTEGER`",
          },
          {
            "name": "id",
            "type": "`$STRING`",
          },
          {
            "name": "title",
            "short": "The tag title.",
            "type": "`$STRING`",
          },
          {
            "name": "updated_time",
            "short": "When the tag was last updated.",
            "type": "`$INTEGER`",
          },
          {
            "name": "user_created_time",
            "short": "When the tag was created.",
            "type": "`$INTEGER`",
          },
          {
            "name": "user_updated_time",
            "short": "When the tag was last updated.",
            "type": "`$INTEGER`",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "tag",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "args": {},
                "kind": "http",
                "method": "POST",
                "orig": "/tags",
                "segments": [
                  {
                    "lit": "tags",
                  },
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "tags",
                ],
              },
            ],
          },
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "args": {
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                    {
                      "kind": "query",
                      "name": "order_by",
                      "orig": "order_by",
                      "type": "`$STRING`",
                    },
                    {
                      "kind": "query",
                      "name": "order_dir",
                      "orig": "order_dir",
                      "type": "`$STRING`",
                    },
                    {
                      "example": 1,
                      "kind": "query",
                      "name": "page",
                      "orig": "page",
                      "type": "`$INTEGER`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/tags",
                "segments": [
                  {
                    "lit": "tags",
                  },
                ],
                "select": {
                  "exist": [
                    "field",
                    "order_by",
                    "order_dir",
                    "page",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.items`",
                },
                "parts": [
                  "tags",
                ],
              },
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/tags/{id}/notes",
                "segments": [
                  {
                    "lit": "tags",
                  },
                  {
                    "var": "id",
                  },
                  {
                    "lit": "notes",
                  },
                ],
                "select": {
                  "$action": "note",
                  "exist": [
                    "field",
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.items`",
                },
                "parts": [
                  "tags",
                  "{id}",
                  "notes",
                ],
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                  "query": [
                    {
                      "kind": "query",
                      "name": "field",
                      "orig": "field",
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/tags/{id}",
                "segments": [
                  {
                    "lit": "tags",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "field",
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "tags",
                  "{id}",
                ],
              },
            ],
          },
          "remove": {
            "input": "data",
            "name": "remove",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "DELETE",
                "orig": "/tags/{id}",
                "segments": [
                  {
                    "lit": "tags",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "tags",
                  "{id}",
                ],
              },
            ],
          },
          "update": {
            "input": "data",
            "name": "update",
            "points": [
              {
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "id",
                      "orig": "id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "PUT",
                "orig": "/tags/{id}",
                "segments": [
                  {
                    "lit": "tags",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "tags",
                  "{id}",
                ],
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
