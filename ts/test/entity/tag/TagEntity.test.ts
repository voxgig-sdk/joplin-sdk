

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { JoplinSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('TagEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when JOPLIN_TEST_LIVE=TRUE.
  afterEach(liveDelay('JOPLIN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = JoplinSDK.test()
    const ent = testsdk.Tag()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.JOPLIN_TEST_LIVE
    for (const op of ['create', 'list', 'update', 'load', 'remove']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'tag.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"created_time":{"a":true,"h":"Created Time","n":"created_time","r":false,"sh":"When the tag was created.","t":"`$INTEGER`","key$":"created_time","index$":0},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":1},"title":{"a":true,"h":"Title","n":"title","r":false,"sh":"The tag title.","t":"`$STRING`","key$":"title","index$":2},"updated_time":{"a":true,"h":"Updated Time","n":"updated_time","r":false,"sh":"When the tag was last updated.","t":"`$INTEGER`","key$":"updated_time","index$":3},"user_created_time":{"a":true,"h":"User Created Time","n":"user_created_time","r":false,"sh":"When the tag was created.","t":"`$INTEGER`","key$":"user_created_time","index$":4},"user_updated_time":{"a":true,"h":"User Updated Time","n":"user_updated_time","r":false,"sh":"When the tag was last updated.","t":"`$INTEGER`","key$":"user_updated_time","index$":5}},"id":{"field":"id","name":"id"},"name":"tag","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /tags","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/tags","q":{},"r":{},"s":[{"lit":"tags"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /tags","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"field","or":"field","r":false,"t":"`$STRING`","index$":0},{"a":true,"k":"query","n":"order_by","or":"order_by","r":false,"t":"`$STRING`","index$":1},{"a":true,"k":"query","n":"order_dir","or":"order_dir","r":false,"t":"`$STRING`","index$":2},{"a":true,"ex":1,"k":"query","n":"page","or":"page","r":false,"t":"`$INTEGER`","index$":3}]},"k":"http","m":"GET","o":"/tags","q":{"exist":["field","order_by","order_dir","page"]},"r":{},"s":[{"lit":"tags"}],"t":{"req":"`reqdata`","res":"`body.items`"},"index$":0},{"a":true,"co":{"id":"GET /tags/{id}/notes","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}],"query":[{"a":true,"k":"query","n":"field","or":"field","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/tags/{id}/notes","q":{"$action":"note","exist":["field","id"]},"r":{},"s":[{"lit":"tags"},{"var":"id"},{"lit":"notes"}],"t":{"req":"`reqdata`","res":"`body.items`"},"index$":1}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /tags/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}],"query":[{"a":true,"k":"query","n":"field","or":"field","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/tags/{id}","q":{"exist":["field","id"]},"r":{},"s":[{"lit":"tags"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /tags/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"DELETE","o":"/tags/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"tags"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"},"update":{"input":"data","name":"update","points":[{"a":true,"co":{"id":"PUT /tags/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"PUT","o":"/tags/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"tags"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"tag","name__orig":"tag","Name":"Tag","name_":"tag","name-":"tag","NAME":"TAG","index$":2}, {"active":true,"entity":"tag","key$":"BasicTagFlow","kind":"basic","name":"BasicTagFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"tag_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"tag_ref01"}}],"index$":1},{"a":true,"d":{},"i":{"ref":"tag_ref01","srcdatavar":"tag_ref01_data","suffix":"_up0","textfield":"title"},"m":{},"o":"update","s":[{"apply":"TextFieldMark","def":{"mark":"Mark01-tag_ref01"}}],"v":[],"index$":2},{"a":true,"d":{},"i":{"ref":"tag_ref01","srcdatavar":"tag_ref01_data","suffix":"_dt0"},"m":{"id":"tag01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-tag_ref01"}}],"index$":3},{"a":true,"d":{},"i":{"ref":"tag_ref01","suffix":"_rm0"},"m":{"id":"tag01"},"o":"remove","s":[],"v":[],"index$":4},{"a":true,"d":{},"i":{"suffix":"_rt0"},"m":{},"o":"list","s":[],"v":[{"apply":"ItemNotExists","def":{"ref":"tag_ref01"}}],"index$":5}]}, 'Tag', {"POST /tags":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"string","key$":"id"},"title":{"description":"The tag title.","type":"string","key$":"title"},"created_time":{"description":"When the tag was created.","type":"integer","key$":"created_time"},"updated_time":{"description":"When the tag was last updated.","type":"integer","key$":"updated_time"},"user_created_time":{"description":"When the tag was created. May differ from created_time as the user can set it.","type":"integer","key$":"user_created_time"},"user_updated_time":{"description":"When the tag was last updated. May differ from updated_time as the user can set it.","type":"integer","key$":"user_updated_time"}},"x-ref":"#/components/schemas/Tag","index$":1}}}},"parameters":[]},"GET /tags":{"protocol":"http","parameters":[{"name":"fields","in":"query","required":false,"schema":{"type":"string"},"description":"Comma-separated list of properties to return. Request only what you need.","x-ref":"#/components/parameters/fields","index$":0},{"name":"page","in":"query","required":false,"schema":{"type":"integer","default":1},"description":"1-based page number. Read has_more to know whether to ask for the next.","x-ref":"#/components/parameters/page","index$":1},{"name":"order_by","in":"query","required":false,"schema":{"type":"string"},"description":"Property to sort by, for example updated_time.","x-ref":"#/components/parameters/order_by","index$":2},{"name":"order_dir","in":"query","required":false,"schema":{"type":"string","enum":["ASC","DESC"]},"description":"Sort direction.","x-ref":"#/components/parameters/order_dir","index$":3}]},"GET /tags/{id}/notes":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"description":"The item ID.","x-ref":"#/components/parameters/id","index$":0},{"name":"fields","in":"query","required":false,"schema":{"type":"string"},"description":"Comma-separated list of properties to return. Request only what you need.","x-ref":"#/components/parameters/fields","index$":1}]},"GET /tags/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"description":"The item ID.","x-ref":"#/components/parameters/id","index$":0},{"name":"fields","in":"query","required":false,"schema":{"type":"string"},"description":"Comma-separated list of properties to return. Request only what you need.","x-ref":"#/components/parameters/fields","index$":1}]},"DELETE /tags/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"description":"The item ID.","x-ref":"#/components/parameters/id","index$":0}]},"PUT /tags/{id}":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"string","key$":"id"},"title":{"description":"The tag title.","type":"string","key$":"title"},"created_time":{"description":"When the tag was created.","type":"integer","key$":"created_time"},"updated_time":{"description":"When the tag was last updated.","type":"integer","key$":"updated_time"},"user_created_time":{"description":"When the tag was created. May differ from created_time as the user can set it.","type":"integer","key$":"user_created_time"},"user_updated_time":{"description":"When the tag was last updated. May differ from updated_time as the user can set it.","type":"integer","key$":"user_updated_time"}},"x-ref":"#/components/schemas/Tag","index$":1}}}},"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"description":"The item ID.","x-ref":"#/components/parameters/id","index$":0}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const tag_ref01_ent = client.Tag()
    let tag_ref01_data = setup.data.new.tag['tag_ref01']

    tag_ref01_data = (await tag_ref01_ent.create(tag_ref01_data)).data()
    assert(null != tag_ref01_data.id)


    // LIST
    const tag_ref01_match: any = {}

    const tag_ref01_list = (await tag_ref01_ent.list(tag_ref01_match)).map((e: any) => e.data())

    assert(!isempty(select(tag_ref01_list, { id: tag_ref01_data.id })))


    // UPDATE
    const tag_ref01_data_up0: any = {}
    tag_ref01_data_up0.id = tag_ref01_data.id

    const tag_ref01_markdef_up0 = { name: 'title', value: 'Mark01-tag_ref01_' + setup.now }
    ;(tag_ref01_data_up0 as any)[tag_ref01_markdef_up0.name] = tag_ref01_markdef_up0.value

    const tag_ref01_resdata_up0 = (await tag_ref01_ent.update(tag_ref01_data_up0)).data()
    assert(tag_ref01_resdata_up0.id === tag_ref01_data_up0.id)

    assert((tag_ref01_resdata_up0 as any)[tag_ref01_markdef_up0.name] === tag_ref01_markdef_up0.value)


    // LOAD
    const tag_ref01_match_dt0: any = {}
    tag_ref01_match_dt0.id = tag_ref01_data.id
    const tag_ref01_data_dt0 = (await tag_ref01_ent.load(tag_ref01_match_dt0)).data()
    assert(tag_ref01_data_dt0.id === tag_ref01_data.id)


    // REMOVE
    const tag_ref01_match_rm0: any = { id: tag_ref01_data.id }
    await tag_ref01_ent.remove(tag_ref01_match_rm0)
  

    // LIST
    const tag_ref01_match_rt0: any = {}

    const tag_ref01_list_rt0 = (await tag_ref01_ent.list(tag_ref01_match_rt0)).map((e: any) => e.data())

    assert(isempty(select(tag_ref01_list_rt0, { id: tag_ref01_data.id })))


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/tag/TagTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = JoplinSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['tag01','tag02','tag03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'JOPLIN_TEST_TAG_ENTID': idmap,
    'JOPLIN_TEST_LIVE': 'FALSE',
    'JOPLIN_TEST_EXPLAIN': 'FALSE',
    'JOPLIN_APIKEY': '',
  })

  idmap = env['JOPLIN_TEST_TAG_ENTID']

  const live = 'TRUE' === env.JOPLIN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['JOPLIN_TEST_TAG_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new JoplinSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.JOPLIN_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.JOPLIN_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
