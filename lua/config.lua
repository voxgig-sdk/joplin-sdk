-- Joplin SDK configuration

-- Build a fresh, fully materialised config table. Every call rebuilds the
-- whole structure, so prefer require("config_shared") unless you need a
-- private copy you intend to mutate.
local function make_config()
  return {
    main = {
      name = "Joplin",
      slug = "joplin",
      version = "0.0.1",
      target = "lua",
    },
    feature = {
      ["debug"] = {
        ["options"] = {
          ["active"] = false,
          ["max"] = 100,
          ["redact"] = {
            "authorization",
            "cookie",
            "set-cookie",
            "api-key",
            "apikey",
            "x-api-key",
            "idempotency-key",
          },
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
          ["onEntry"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["idempotency"] = {
        ["options"] = {
          ["active"] = false,
          ["header"] = "Idempotency-Key",
          ["methods"] = {
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          },
          ["ops"] = {
            "create",
            "update",
            "remove",
          },
        },
        ["optspec"] = {
          ["keygen"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["metrics"] = {
        ["options"] = {
          ["active"] = false,
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["paging"] = {
        ["options"] = {
          ["active"] = false,
          ["afterVar"] = "after",
          ["cursorParam"] = "cursor",
          ["firstVar"] = "first",
          ["limitParam"] = "limit",
          ["pageParam"] = "page",
          ["startPage"] = 1,
        },
        ["optspec"] = {
          ["limit"] = "`$NUMBER`",
          ["ops"] = "`$LIST`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["ratelimit"] = {
        ["options"] = {
          ["active"] = false,
          ["burst"] = 5,
          ["rate"] = 5,
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
          ["sleep"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
      ["retry"] = {
        ["options"] = {
          ["active"] = false,
          ["factor"] = 2,
          ["maxDelay"] = 2000,
          ["minDelay"] = 50,
          ["retries"] = 2,
          ["statuses"] = {
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          },
        },
        ["optspec"] = {
          ["jitter"] = "`$BOOLEAN`",
          ["sleep"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
      ["test"] = {
        ["options"] = {
          ["active"] = false,
        },
        ["optspec"] = {
          ["entity"] = "`$MAP`",
          ["net"] = "`$MAP`",
        },
        ["strict"] = false,
        ["transport"] = "base",
      },
      ["timeout"] = {
        ["options"] = {
          ["active"] = false,
          ["ms"] = 30000,
        },
        ["optspec"] = {
          ["clearTimer"] = "`$FUNCTION`",
          ["setTimer"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
    },
    options = {
      base = "http://localhost:41184",
      auth = {
        prefix = "",
        ["in"] = "query",
        name = "token",
      },
      headers = {
        ["content-type"] = "application/json",
      },
      entity = {
        ["folder"] = {},
        ["note"] = {},
        ["tag"] = {},
      },
    },
    entity = {
      ["folder"] = {
        ["fields"] = {
          {
            ["name"] = "created_time",
            ["title"] = "Created Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the folder was created.",
          },
          {
            ["name"] = "id",
            ["title"] = "Id",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "is_shared",
            ["title"] = "Is Shared",
            ["type"] = "`$INTEGER`",
          },
          {
            ["name"] = "parent_id",
            ["title"] = "Parent Id",
            ["type"] = "`$STRING`",
            ["short"] = "ID of the parent notebook, empty for a top-level notebook.",
          },
          {
            ["name"] = "title",
            ["title"] = "Title",
            ["type"] = "`$STRING`",
            ["short"] = "The folder title.",
          },
          {
            ["name"] = "updated_time",
            ["title"] = "Updated Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the folder was last updated.",
          },
          {
            ["name"] = "user_created_time",
            ["title"] = "User Created Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the folder was created.",
          },
          {
            ["name"] = "user_updated_time",
            ["title"] = "User Updated Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the folder was last updated.",
          },
        },
        ["id"] = {
          ["field"] = "id",
          ["name"] = "id",
        },
        ["name"] = "folder",
        ["op"] = {
          ["create"] = {
            ["input"] = "data",
            ["name"] = "create",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "POST",
                ["orig"] = "/folders",
                ["segments"] = {
                  {
                    ["lit"] = "folders",
                  },
                },
                ["parts"] = {
                  "folders",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {},
                ["select"] = {},
              },
            },
          },
          ["list"] = {
            ["input"] = "data",
            ["name"] = "list",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/folders",
                ["segments"] = {
                  {
                    ["lit"] = "folders",
                  },
                },
                ["parts"] = {
                  "folders",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.items`",
                },
                ["args"] = {
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "order_by",
                      ["orig"] = "order_by",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "order_dir",
                      ["orig"] = "order_dir",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "page",
                      ["orig"] = "page",
                      ["type"] = "`$INTEGER`",
                      ["kind"] = "query",
                      ["example"] = 1,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "field",
                    "order_by",
                    "order_dir",
                    "page",
                  },
                },
              },
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/folders/{id}/notes",
                ["segments"] = {
                  {
                    ["lit"] = "folders",
                  },
                  {
                    ["var"] = "id",
                  },
                  {
                    ["lit"] = "notes",
                  },
                },
                ["parts"] = {
                  "folders",
                  "{id}",
                  "notes",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.items`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                  },
                },
                ["select"] = {
                  ["$action"] = "note",
                  ["exist"] = {
                    "field",
                    "id",
                  },
                },
              },
            },
          },
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/folders/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "folders",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "folders",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "field",
                    "id",
                  },
                },
              },
            },
          },
          ["remove"] = {
            ["input"] = "data",
            ["name"] = "remove",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "DELETE",
                ["orig"] = "/folders/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "folders",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "folders",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
              },
            },
          },
          ["update"] = {
            ["input"] = "data",
            ["name"] = "update",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "PUT",
                ["orig"] = "/folders/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "folders",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "folders",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["note"] = {
        ["fields"] = {
          {
            ["name"] = "altitude",
            ["title"] = "Altitude",
            ["type"] = "`$NUMBER`",
          },
          {
            ["name"] = "author",
            ["title"] = "Author",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "body",
            ["title"] = "Body",
            ["type"] = "`$STRING`",
            ["short"] = "The note body, in Markdown.",
          },
          {
            ["name"] = "created_time",
            ["title"] = "Created Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the note was created.",
          },
          {
            ["name"] = "id",
            ["title"] = "Id",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "is_conflict",
            ["title"] = "Is Conflict",
            ["type"] = "`$INTEGER`",
            ["short"] = "Tells whether the note is a conflict or not.",
          },
          {
            ["name"] = "is_todo",
            ["title"] = "Is Todo",
            ["type"] = "`$INTEGER`",
            ["short"] = "Tells whether this note is a to-do or not.",
          },
          {
            ["name"] = "latitude",
            ["title"] = "Latitude",
            ["type"] = "`$NUMBER`",
          },
          {
            ["name"] = "longitude",
            ["title"] = "Longitude",
            ["type"] = "`$NUMBER`",
          },
          {
            ["name"] = "markup_language",
            ["title"] = "Markup Language",
            ["type"] = "`$INTEGER`",
            ["short"] = "1 for Markdown, 2 for HTML.",
          },
          {
            ["name"] = "parent_id",
            ["title"] = "Parent Id",
            ["type"] = "`$STRING`",
            ["short"] = "ID of the notebook that contains this note.",
          },
          {
            ["name"] = "source_url",
            ["title"] = "Source Url",
            ["type"] = "`$STRING`",
            ["short"] = "The full URL where the note comes from.",
          },
          {
            ["name"] = "title",
            ["title"] = "Title",
            ["type"] = "`$STRING`",
            ["short"] = "The note title.",
          },
          {
            ["name"] = "todo_completed",
            ["title"] = "Todo Completed",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the to-do was completed.",
          },
          {
            ["name"] = "todo_due",
            ["title"] = "Todo Due",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the to-do is due.",
          },
          {
            ["name"] = "updated_time",
            ["title"] = "Updated Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the note was last updated.",
          },
          {
            ["name"] = "user_created_time",
            ["title"] = "User Created Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the note was created.",
          },
          {
            ["name"] = "user_updated_time",
            ["title"] = "User Updated Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the note was last updated.",
          },
        },
        ["id"] = {
          ["field"] = "id",
          ["name"] = "id",
        },
        ["name"] = "note",
        ["op"] = {
          ["create"] = {
            ["input"] = "data",
            ["name"] = "create",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "POST",
                ["orig"] = "/notes",
                ["segments"] = {
                  {
                    ["lit"] = "notes",
                  },
                },
                ["parts"] = {
                  "notes",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {},
                ["select"] = {},
              },
            },
          },
          ["list"] = {
            ["input"] = "data",
            ["name"] = "list",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/notes",
                ["segments"] = {
                  {
                    ["lit"] = "notes",
                  },
                },
                ["parts"] = {
                  "notes",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.items`",
                },
                ["args"] = {
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "order_by",
                      ["orig"] = "order_by",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "order_dir",
                      ["orig"] = "order_dir",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "page",
                      ["orig"] = "page",
                      ["type"] = "`$INTEGER`",
                      ["kind"] = "query",
                      ["example"] = 1,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "field",
                    "order_by",
                    "order_dir",
                    "page",
                  },
                },
              },
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/notes/{id}/tags",
                ["segments"] = {
                  {
                    ["lit"] = "notes",
                  },
                  {
                    ["var"] = "id",
                  },
                  {
                    ["lit"] = "tags",
                  },
                },
                ["parts"] = {
                  "notes",
                  "{id}",
                  "tags",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.items`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                  },
                },
                ["select"] = {
                  ["$action"] = "tag",
                  ["exist"] = {
                    "field",
                    "id",
                  },
                },
              },
            },
          },
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/notes/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "notes",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "notes",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "field",
                    "id",
                  },
                },
              },
            },
          },
          ["remove"] = {
            ["input"] = "data",
            ["name"] = "remove",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "DELETE",
                ["orig"] = "/notes/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "notes",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "notes",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
              },
            },
          },
          ["update"] = {
            ["input"] = "data",
            ["name"] = "update",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "PUT",
                ["orig"] = "/notes/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "notes",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "notes",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["tag"] = {
        ["fields"] = {
          {
            ["name"] = "created_time",
            ["title"] = "Created Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the tag was created.",
          },
          {
            ["name"] = "id",
            ["title"] = "Id",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "title",
            ["title"] = "Title",
            ["type"] = "`$STRING`",
            ["short"] = "The tag title.",
          },
          {
            ["name"] = "updated_time",
            ["title"] = "Updated Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the tag was last updated.",
          },
          {
            ["name"] = "user_created_time",
            ["title"] = "User Created Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the tag was created.",
          },
          {
            ["name"] = "user_updated_time",
            ["title"] = "User Updated Time",
            ["type"] = "`$INTEGER`",
            ["short"] = "When the tag was last updated.",
          },
        },
        ["id"] = {
          ["field"] = "id",
          ["name"] = "id",
        },
        ["name"] = "tag",
        ["op"] = {
          ["create"] = {
            ["input"] = "data",
            ["name"] = "create",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "POST",
                ["orig"] = "/tags",
                ["segments"] = {
                  {
                    ["lit"] = "tags",
                  },
                },
                ["parts"] = {
                  "tags",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {},
                ["select"] = {},
              },
            },
          },
          ["list"] = {
            ["input"] = "data",
            ["name"] = "list",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/tags",
                ["segments"] = {
                  {
                    ["lit"] = "tags",
                  },
                },
                ["parts"] = {
                  "tags",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.items`",
                },
                ["args"] = {
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "order_by",
                      ["orig"] = "order_by",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "order_dir",
                      ["orig"] = "order_dir",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                    {
                      ["name"] = "page",
                      ["orig"] = "page",
                      ["type"] = "`$INTEGER`",
                      ["kind"] = "query",
                      ["example"] = 1,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "field",
                    "order_by",
                    "order_dir",
                    "page",
                  },
                },
              },
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/tags/{id}/notes",
                ["segments"] = {
                  {
                    ["lit"] = "tags",
                  },
                  {
                    ["var"] = "id",
                  },
                  {
                    ["lit"] = "notes",
                  },
                },
                ["parts"] = {
                  "tags",
                  "{id}",
                  "notes",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.items`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                  },
                },
                ["select"] = {
                  ["$action"] = "note",
                  ["exist"] = {
                    "field",
                    "id",
                  },
                },
              },
            },
          },
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/tags/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "tags",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "tags",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                  ["query"] = {
                    {
                      ["name"] = "field",
                      ["orig"] = "field",
                      ["type"] = "`$STRING`",
                      ["kind"] = "query",
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "field",
                    "id",
                  },
                },
              },
            },
          },
          ["remove"] = {
            ["input"] = "data",
            ["name"] = "remove",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "DELETE",
                ["orig"] = "/tags/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "tags",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "tags",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
              },
            },
          },
          ["update"] = {
            ["input"] = "data",
            ["name"] = "update",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "PUT",
                ["orig"] = "/tags/{id}",
                ["segments"] = {
                  {
                    ["lit"] = "tags",
                  },
                  {
                    ["var"] = "id",
                  },
                },
                ["parts"] = {
                  "tags",
                  "{id}",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {
                  ["params"] = {
                    {
                      ["name"] = "id",
                      ["orig"] = "id",
                      ["type"] = "`$STRING`",
                      ["kind"] = "param",
                      ["reqd"] = true,
                    },
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
    },
  }
end


local function make_feature(name)
  local features = require("features")
  local factory = features[name]
  if factory ~= nil then
    return factory()
  end
  return features.base()
end


-- Attach make_feature to the SDK class
local function setup_sdk(SDK)
  SDK._make_feature = make_feature
end


return make_config
