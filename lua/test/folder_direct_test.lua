-- Folder direct test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("joplin_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

-- main.kit.test.live.strict is true (the default is true): a live
-- request that fails, or a live test missing an input it needs,
-- fails the test.
-- An account with no record for a test to read skips it either way.
local LIVE_STRICT = true

local function live_ok(result, err)
  if err ~= nil or type(result) ~= "table" or result["err"] ~= nil or not result["ok"] then
    return false
  end
  local status = helpers.to_int(result["status"])
  return status >= 200 and status < 300
end

describe("FolderDirect", function()
  it("should direct-list-folder", function()
    local setup = folder_direct_setup({
      { id = "direct01" },
      { id = "direct02" },
    })
    local _should_skip, _reason = runner.is_control_skipped("direct", "direct-list-folder", setup.live and "live" or "unit")
    if _should_skip then
      pending(_reason or "skipped via sdk-test-control.json")
      return
    end
    if setup.live then
      for _, _live_key in ipairs({"folder01"}) do
        if setup.idmap[_live_key] == nil then
          runner.live_miss(pending, LIVE_STRICT, "Live test blocked: needs " .. _live_key .. " via JOPLIN_TEST_FOLDER_ENTID")
        end
      end
    end
    local client = setup.client

    local params = {}
    if setup.live then
      params["id"] = setup.idmap["folder01"]
    else
      params["id"] = "direct01"
    end

    local result, err = client:direct({
      path = "folders/{id}/notes",
      method = "GET",
      params = params,
    })
    if setup.live then
      if not live_ok(result, err) then
        runner.live_miss(pending, LIVE_STRICT, "Live list failed: " .. runner.live_describe(result, err))
      end
      if runner.live_list(result["data"]) == nil then
        runner.live_miss(pending, LIVE_STRICT, "Live list returned no list: " .. runner.live_describe(result, err))
      end
      assert.is_table(runner.live_list(result["data"]))
    else
      assert.is_nil(err)
      assert.is_true(result["ok"])
      assert.are.equal(200, helpers.to_int(result["status"]))
      assert.is_table(result["data"])
      assert.are.equal(2, #result["data"])
      assert.are.equal(1, #setup.calls)
    end
  end)

  it("should direct-load-folder", function()
    local setup = folder_direct_setup({ id = "direct01" })
    local _should_skip, _reason = runner.is_control_skipped("direct", "direct-load-folder", setup.live and "live" or "unit")
    if _should_skip then
      pending(_reason or "skipped via sdk-test-control.json")
      return
    end
    if setup.live then
      for _, _live_key in ipairs({"folder01"}) do
        if setup.idmap[_live_key] == nil then
          runner.live_miss(pending, LIVE_STRICT, "Live test blocked: needs " .. _live_key .. " via JOPLIN_TEST_FOLDER_ENTID")
        end
      end
    end
    local client = setup.client

    local params = {}
    local query = {}
    if setup.live then
      local list_result, list_err = client:direct({
        path = "folders/{id}/notes",
        method = "GET",
        params = {["id"] = setup.idmap["folder01"]},
      })
      if not live_ok(list_result, list_err) then
        runner.live_miss(pending, LIVE_STRICT, "Live list discovery failed: " .. runner.live_describe(list_result, list_err))
      end
      local records = runner.live_list(list_result["data"])
      if records == nil then
        runner.live_miss(pending, LIVE_STRICT, "Live list discovery returned no list: " .. runner.live_describe(list_result, list_err))
      end
      if records[1] == nil then
        runner.live_empty(pending, "The account has no folder record to load")
      end
      local first = type(records[1]) == "table" and records[1] or {}
      local found = first["id"] or first["id"]
      if found == nil then
        runner.live_miss(pending, LIVE_STRICT, "Live load blocked: discovery returned no usable identity")
      end
      params["id"] = found
    else
      params["id"] = "direct01"
    end

    local result, err = client:direct({
      path = "folders/{id}",
      method = "GET",
      params = params,
      query = query,
    })
    if setup.live then
      if not live_ok(result, err) then
        runner.live_miss(pending, LIVE_STRICT, "Live load failed: " .. runner.live_describe(result, err))
      end
      if result["data"] == nil then
        runner.live_miss(pending, LIVE_STRICT, "Live load returned no data: " .. runner.live_describe(result, err))
      end
      assert.is_not_nil(result["data"])
    else
      assert.is_nil(err)
      assert.is_true(result["ok"])
      assert.are.equal(200, helpers.to_int(result["status"]))
      assert.is_not_nil(result["data"])
      if type(result["data"]) == "table" then
        assert.are.equal("direct01", result["data"]["id"])
      end
      assert.are.equal(1, #setup.calls)
    end
  end)

end)


function folder_direct_setup(mockres)
  runner.load_env_local()

  local calls = {}

  local env = runner.env_override({
    ["JOPLIN_TEST_FOLDER_ENTID"] = {},
    ["JOPLIN_TEST_LIVE"] = "FALSE",
    ["JOPLIN_APIKEY"] = "",
  })

  local live = env["JOPLIN_TEST_LIVE"] == "TRUE"

  if live then
    local merged_opts = {
      apikey = env["JOPLIN_APIKEY"],
    }
    -- sdk-test-control.json's test.client.options goes UNDER the generated
    -- fields: it adds to the live client, it does not redirect it.
    for _k, _v in pairs(runner.live_client_options()) do
      if merged_opts[_k] == nil then
        merged_opts[_k] = _v
      end
    end
    local client = sdk.new(merged_opts)
    local idmap = env["JOPLIN_TEST_FOLDER_ENTID"]
    return {
      client = client,
      calls = calls,
      live = true,
      idmap = type(idmap) == "table" and idmap or {},
    }
  end

  local function mock_fetch(url, init)
    table.insert(calls, { url = url, init = init })
    return {
      status = 200,
      statusText = "OK",
      headers = {},
      json = function()
        if mockres ~= nil then
          return mockres
        end
        return { id = "direct01" }
      end,
      body = "mock",
    }, nil
  end

  local client = sdk.new({
    base = "http://localhost:8080",
    system = {
      fetch = mock_fetch,
    },
  })

  return {
    client = client,
    calls = calls,
    live = false,
    idmap = {},
  }
end
