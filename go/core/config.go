package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "Joplin",
			"slug": "joplin",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"debug": map[string]any{
				"options": map[string]any{
					"active": false,
					"max": 100,
					"redact": []any{
						"authorization",
						"cookie",
						"set-cookie",
						"api-key",
						"apikey",
						"x-api-key",
						"idempotency-key",
					},
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"onEntry": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"idempotency": map[string]any{
				"options": map[string]any{
					"active": false,
					"header": "Idempotency-Key",
					"methods": []any{
						"POST",
						"PUT",
						"PATCH",
						"DELETE",
					},
					"ops": []any{
						"create",
						"update",
						"remove",
					},
				},
				"optspec": map[string]any{
					"keygen": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"metrics": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"paging": map[string]any{
				"options": map[string]any{
					"active": false,
					"afterVar": "after",
					"cursorParam": "cursor",
					"firstVar": "first",
					"limitParam": "limit",
					"pageParam": "page",
					"startPage": 1,
				},
				"optspec": map[string]any{
					"limit": "`$NUMBER`",
					"ops": "`$LIST`",
				},
				"strict": false,
				"transport": "none",
			},
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "http://localhost:41184",
			"auth": map[string]any{
				"prefix": "",
				"in": "query",
				"name": "token",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"folder": map[string]any{},
				"note": map[string]any{},
				"tag": map[string]any{},
			},
		},
		"entity": map[string]any{
			"folder": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "created_time",
						"title": "Created Time",
						"type": "`$INTEGER`",
						"short": "When the folder was created.",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "is_shared",
						"title": "Is Shared",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "parent_id",
						"title": "Parent Id",
						"type": "`$STRING`",
						"short": "ID of the parent notebook, empty for a top-level notebook.",
					},
					map[string]any{
						"name": "title",
						"title": "Title",
						"type": "`$STRING`",
						"short": "The folder title.",
					},
					map[string]any{
						"name": "updated_time",
						"title": "Updated Time",
						"type": "`$INTEGER`",
						"short": "When the folder was last updated.",
					},
					map[string]any{
						"name": "user_created_time",
						"title": "User Created Time",
						"type": "`$INTEGER`",
						"short": "When the folder was created.",
					},
					map[string]any{
						"name": "user_updated_time",
						"title": "User Updated Time",
						"type": "`$INTEGER`",
						"short": "When the folder was last updated.",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "folder",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/folders",
								"segments": []any{
									map[string]any{
										"lit": "folders",
									},
								},
								"parts": []any{
									"folders",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
							},
						},
					},
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/folders",
								"segments": []any{
									map[string]any{
										"lit": "folders",
									},
								},
								"parts": []any{
									"folders",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.items`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "order_by",
											"orig": "order_by",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "order_dir",
											"orig": "order_dir",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "page",
											"orig": "page",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 1,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"field",
										"order_by",
										"order_dir",
										"page",
									},
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/folders/{id}/notes",
								"segments": []any{
									map[string]any{
										"lit": "folders",
									},
									map[string]any{
										"var": "id",
									},
									map[string]any{
										"lit": "notes",
									},
								},
								"parts": []any{
									"folders",
									"{id}",
									"notes",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.items`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"$action": "note",
									"exist": []any{
										"field",
										"id",
									},
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/folders/{id}",
								"segments": []any{
									map[string]any{
										"lit": "folders",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"folders",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"field",
										"id",
									},
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "DELETE",
								"orig": "/folders/{id}",
								"segments": []any{
									map[string]any{
										"lit": "folders",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"folders",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
					"update": map[string]any{
						"input": "data",
						"name": "update",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "PUT",
								"orig": "/folders/{id}",
								"segments": []any{
									map[string]any{
										"lit": "folders",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"folders",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"note": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "altitude",
						"title": "Altitude",
						"type": "`$NUMBER`",
					},
					map[string]any{
						"name": "author",
						"title": "Author",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "body",
						"title": "Body",
						"type": "`$STRING`",
						"short": "The note body, in Markdown.",
					},
					map[string]any{
						"name": "created_time",
						"title": "Created Time",
						"type": "`$INTEGER`",
						"short": "When the note was created.",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "is_conflict",
						"title": "Is Conflict",
						"type": "`$INTEGER`",
						"short": "Tells whether the note is a conflict or not.",
					},
					map[string]any{
						"name": "is_todo",
						"title": "Is Todo",
						"type": "`$INTEGER`",
						"short": "Tells whether this note is a to-do or not.",
					},
					map[string]any{
						"name": "latitude",
						"title": "Latitude",
						"type": "`$NUMBER`",
					},
					map[string]any{
						"name": "longitude",
						"title": "Longitude",
						"type": "`$NUMBER`",
					},
					map[string]any{
						"name": "markup_language",
						"title": "Markup Language",
						"type": "`$INTEGER`",
						"short": "1 for Markdown, 2 for HTML.",
					},
					map[string]any{
						"name": "parent_id",
						"title": "Parent Id",
						"type": "`$STRING`",
						"short": "ID of the notebook that contains this note.",
					},
					map[string]any{
						"name": "source_url",
						"title": "Source Url",
						"type": "`$STRING`",
						"short": "The full URL where the note comes from.",
					},
					map[string]any{
						"name": "title",
						"title": "Title",
						"type": "`$STRING`",
						"short": "The note title.",
					},
					map[string]any{
						"name": "todo_completed",
						"title": "Todo Completed",
						"type": "`$INTEGER`",
						"short": "When the to-do was completed.",
					},
					map[string]any{
						"name": "todo_due",
						"title": "Todo Due",
						"type": "`$INTEGER`",
						"short": "When the to-do is due.",
					},
					map[string]any{
						"name": "updated_time",
						"title": "Updated Time",
						"type": "`$INTEGER`",
						"short": "When the note was last updated.",
					},
					map[string]any{
						"name": "user_created_time",
						"title": "User Created Time",
						"type": "`$INTEGER`",
						"short": "When the note was created.",
					},
					map[string]any{
						"name": "user_updated_time",
						"title": "User Updated Time",
						"type": "`$INTEGER`",
						"short": "When the note was last updated.",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "note",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/notes",
								"segments": []any{
									map[string]any{
										"lit": "notes",
									},
								},
								"parts": []any{
									"notes",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
							},
						},
					},
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/notes",
								"segments": []any{
									map[string]any{
										"lit": "notes",
									},
								},
								"parts": []any{
									"notes",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.items`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "order_by",
											"orig": "order_by",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "order_dir",
											"orig": "order_dir",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "page",
											"orig": "page",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 1,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"field",
										"order_by",
										"order_dir",
										"page",
									},
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/notes/{id}/tags",
								"segments": []any{
									map[string]any{
										"lit": "notes",
									},
									map[string]any{
										"var": "id",
									},
									map[string]any{
										"lit": "tags",
									},
								},
								"parts": []any{
									"notes",
									"{id}",
									"tags",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.items`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"$action": "tag",
									"exist": []any{
										"field",
										"id",
									},
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/notes/{id}",
								"segments": []any{
									map[string]any{
										"lit": "notes",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"notes",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"field",
										"id",
									},
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "DELETE",
								"orig": "/notes/{id}",
								"segments": []any{
									map[string]any{
										"lit": "notes",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"notes",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
					"update": map[string]any{
						"input": "data",
						"name": "update",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "PUT",
								"orig": "/notes/{id}",
								"segments": []any{
									map[string]any{
										"lit": "notes",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"notes",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"tag": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "created_time",
						"title": "Created Time",
						"type": "`$INTEGER`",
						"short": "When the tag was created.",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "title",
						"title": "Title",
						"type": "`$STRING`",
						"short": "The tag title.",
					},
					map[string]any{
						"name": "updated_time",
						"title": "Updated Time",
						"type": "`$INTEGER`",
						"short": "When the tag was last updated.",
					},
					map[string]any{
						"name": "user_created_time",
						"title": "User Created Time",
						"type": "`$INTEGER`",
						"short": "When the tag was created.",
					},
					map[string]any{
						"name": "user_updated_time",
						"title": "User Updated Time",
						"type": "`$INTEGER`",
						"short": "When the tag was last updated.",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "tag",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/tags",
								"segments": []any{
									map[string]any{
										"lit": "tags",
									},
								},
								"parts": []any{
									"tags",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
							},
						},
					},
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/tags",
								"segments": []any{
									map[string]any{
										"lit": "tags",
									},
								},
								"parts": []any{
									"tags",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.items`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "order_by",
											"orig": "order_by",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "order_dir",
											"orig": "order_dir",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "page",
											"orig": "page",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 1,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"field",
										"order_by",
										"order_dir",
										"page",
									},
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/tags/{id}/notes",
								"segments": []any{
									map[string]any{
										"lit": "tags",
									},
									map[string]any{
										"var": "id",
									},
									map[string]any{
										"lit": "notes",
									},
								},
								"parts": []any{
									"tags",
									"{id}",
									"notes",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.items`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"$action": "note",
									"exist": []any{
										"field",
										"id",
									},
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/tags/{id}",
								"segments": []any{
									map[string]any{
										"lit": "tags",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"tags",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "field",
											"orig": "field",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"field",
										"id",
									},
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "DELETE",
								"orig": "/tags/{id}",
								"segments": []any{
									map[string]any{
										"lit": "tags",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"tags",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
					"update": map[string]any{
						"input": "data",
						"name": "update",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "PUT",
								"orig": "/tags/{id}",
								"segments": []any{
									map[string]any{
										"lit": "tags",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"tags",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "debug":
		if NewDebugFeatureFunc != nil {
			return NewDebugFeatureFunc()
		}
	case "idempotency":
		if NewIdempotencyFeatureFunc != nil {
			return NewIdempotencyFeatureFunc()
		}
	case "metrics":
		if NewMetricsFeatureFunc != nil {
			return NewMetricsFeatureFunc()
		}
	case "paging":
		if NewPagingFeatureFunc != nil {
			return NewPagingFeatureFunc()
		}
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
