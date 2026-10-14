import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "folder",
    "accessor": "Folder",
    "op": "create",
    "method": "POST",
    "path": "/folders",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "title": "x",
      "parent_id": "x",
      "created_time": 1,
      "updated_time": 1,
      "user_created_time": 1,
      "user_updated_time": 1,
      "is_shared": 1
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "folder",
    "accessor": "Folder",
    "op": "list",
    "method": "GET",
    "path": "/folders/{id}/notes",
    "action": "note",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {
      "field": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "items": [
        {
          "id": "x",
          "parent_id": "x",
          "title": "x",
          "body": "x",
          "created_time": 1,
          "updated_time": 1,
          "is_conflict": 1,
          "latitude": 1,
          "longitude": 1,
          "altitude": 1,
          "author": "x",
          "source_url": "x",
          "is_todo": 1,
          "todo_due": 1,
          "todo_completed": 1,
          "markup_language": 1,
          "user_created_time": 1,
          "user_updated_time": 1
        }
      ],
      "has_more": true
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "folder",
    "accessor": "Folder",
    "op": "list",
    "method": "GET",
    "path": "/folders",
    "args": [],
    "select": {
      "field": "v1",
      "order_by": "v1",
      "order_dir": "v1",
      "page": 1
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields",
      "page",
      "order_by",
      "order_dir"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      },
      {
        "name": "order_by",
        "wire": "order_by"
      },
      {
        "name": "order_dir",
        "wire": "order_dir"
      },
      {
        "name": "page",
        "wire": "page"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "items": [
        {
          "id": "x",
          "title": "x",
          "parent_id": "x",
          "created_time": 1,
          "updated_time": 1,
          "user_created_time": 1,
          "user_updated_time": 1,
          "is_shared": 1
        }
      ],
      "has_more": true
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "folder",
    "accessor": "Folder",
    "op": "load",
    "method": "GET",
    "path": "/folders/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {
      "field": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "title": "x",
      "parent_id": "x",
      "created_time": 1,
      "updated_time": 1,
      "user_created_time": 1,
      "user_updated_time": 1,
      "is_shared": 1
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "folder",
    "accessor": "Folder",
    "op": "remove",
    "method": "DELETE",
    "path": "/folders/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "folder",
    "accessor": "Folder",
    "op": "update",
    "method": "PUT",
    "path": "/folders/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "title": "x",
      "parent_id": "x",
      "created_time": 1,
      "updated_time": 1,
      "user_created_time": 1,
      "user_updated_time": 1,
      "is_shared": 1
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "note",
    "accessor": "Note",
    "op": "create",
    "method": "POST",
    "path": "/notes",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "parent_id": "x",
      "title": "x",
      "body": "x",
      "created_time": 1,
      "updated_time": 1,
      "is_conflict": 1,
      "latitude": 1,
      "longitude": 1,
      "altitude": 1,
      "author": "x",
      "source_url": "x",
      "is_todo": 1,
      "todo_due": 1,
      "todo_completed": 1,
      "markup_language": 1,
      "user_created_time": 1,
      "user_updated_time": 1
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "note",
    "accessor": "Note",
    "op": "list",
    "method": "GET",
    "path": "/notes/{id}/tags",
    "action": "tag",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {
      "field": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "items": [
        {
          "id": "x",
          "title": "x",
          "created_time": 1,
          "updated_time": 1,
          "user_created_time": 1,
          "user_updated_time": 1
        }
      ],
      "has_more": true
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "note",
    "accessor": "Note",
    "op": "list",
    "method": "GET",
    "path": "/notes",
    "args": [],
    "select": {
      "field": "v1",
      "order_by": "v1",
      "order_dir": "v1",
      "page": 1
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields",
      "page",
      "order_by",
      "order_dir"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      },
      {
        "name": "order_by",
        "wire": "order_by"
      },
      {
        "name": "order_dir",
        "wire": "order_dir"
      },
      {
        "name": "page",
        "wire": "page"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "items": [
        {
          "id": "x",
          "parent_id": "x",
          "title": "x",
          "body": "x",
          "created_time": 1,
          "updated_time": 1,
          "is_conflict": 1,
          "latitude": 1,
          "longitude": 1,
          "altitude": 1,
          "author": "x",
          "source_url": "x",
          "is_todo": 1,
          "todo_due": 1,
          "todo_completed": 1,
          "markup_language": 1,
          "user_created_time": 1,
          "user_updated_time": 1
        }
      ],
      "has_more": true
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "note",
    "accessor": "Note",
    "op": "load",
    "method": "GET",
    "path": "/notes/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {
      "field": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "parent_id": "x",
      "title": "x",
      "body": "x",
      "created_time": 1,
      "updated_time": 1,
      "is_conflict": 1,
      "latitude": 1,
      "longitude": 1,
      "altitude": 1,
      "author": "x",
      "source_url": "x",
      "is_todo": 1,
      "todo_due": 1,
      "todo_completed": 1,
      "markup_language": 1,
      "user_created_time": 1,
      "user_updated_time": 1
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "note",
    "accessor": "Note",
    "op": "remove",
    "method": "DELETE",
    "path": "/notes/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "note",
    "accessor": "Note",
    "op": "update",
    "method": "PUT",
    "path": "/notes/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "parent_id": "x",
      "title": "x",
      "body": "x",
      "created_time": 1,
      "updated_time": 1,
      "is_conflict": 1,
      "latitude": 1,
      "longitude": 1,
      "altitude": 1,
      "author": "x",
      "source_url": "x",
      "is_todo": 1,
      "todo_due": 1,
      "todo_completed": 1,
      "markup_language": 1,
      "user_created_time": 1,
      "user_updated_time": 1
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "tag",
    "accessor": "Tag",
    "op": "create",
    "method": "POST",
    "path": "/tags",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "title": "x",
      "created_time": 1,
      "updated_time": 1,
      "user_created_time": 1,
      "user_updated_time": 1
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "tag",
    "accessor": "Tag",
    "op": "list",
    "method": "GET",
    "path": "/tags/{id}/notes",
    "action": "note",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {
      "field": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "items": [
        {
          "id": "x",
          "parent_id": "x",
          "title": "x",
          "body": "x",
          "created_time": 1,
          "updated_time": 1,
          "is_conflict": 1,
          "latitude": 1,
          "longitude": 1,
          "altitude": 1,
          "author": "x",
          "source_url": "x",
          "is_todo": 1,
          "todo_due": 1,
          "todo_completed": 1,
          "markup_language": 1,
          "user_created_time": 1,
          "user_updated_time": 1
        }
      ],
      "has_more": true
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "tag",
    "accessor": "Tag",
    "op": "list",
    "method": "GET",
    "path": "/tags",
    "args": [],
    "select": {
      "field": "v1",
      "order_by": "v1",
      "order_dir": "v1",
      "page": 1
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields",
      "page",
      "order_by",
      "order_dir"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      },
      {
        "name": "order_by",
        "wire": "order_by"
      },
      {
        "name": "order_dir",
        "wire": "order_dir"
      },
      {
        "name": "page",
        "wire": "page"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "items": [
        {
          "id": "x",
          "title": "x",
          "created_time": 1,
          "updated_time": 1,
          "user_created_time": 1,
          "user_updated_time": 1
        }
      ],
      "has_more": true
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "tag",
    "accessor": "Tag",
    "op": "load",
    "method": "GET",
    "path": "/tags/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {
      "field": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "fields"
    ],
    "queryArgs": [
      {
        "name": "field",
        "wire": "fields"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "title": "x",
      "created_time": 1,
      "updated_time": 1,
      "user_created_time": 1,
      "user_updated_time": 1
    },
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "tag",
    "accessor": "Tag",
    "op": "remove",
    "method": "DELETE",
    "path": "/tags/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id",
    "ownQuery": "token"
  },
  {
    "entity": "tag",
    "accessor": "Tag",
    "op": "update",
    "method": "PUT",
    "path": "/tags/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "token"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "title": "x",
      "created_time": 1,
      "updated_time": 1,
      "user_created_time": 1,
      "user_updated_time": 1
    },
    "idField": "id",
    "ownQuery": "token"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
