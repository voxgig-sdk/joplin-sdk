-- Joplin SDK utility: prepare_auth

local vs = require("utility.struct.struct")

local QUERY_AUTH = "token"
local OPTION_APIKEY = "apikey"
local NOT_FOUND = "__NOTFOUND__"

local function prepare_auth_util(ctx)
  local spec = ctx.spec
  if spec == nil then
    return nil, ctx:make_error("auth_no_spec",
      "Expected context spec property to be defined.")
  end

  local query = spec.query
  local options = ctx.client:options_map()

  -- Public APIs that need no auth omit the options.auth block entirely.
  if options.auth == nil then
    query[QUERY_AUTH] = nil
    return spec, nil
  end

  local apikey = vs.getprop(options, OPTION_APIKEY, NOT_FOUND)

  if apikey == nil
    or (type(apikey) == "string" and (apikey == NOT_FOUND or apikey == ""))
  then
    query[QUERY_AUTH] = nil
  else
    -- NO PREFIX IN A QUERY STRING: "?token=Bearer%20abc" is not a thing
    -- any API reads, so the auth.prefix a header placement space-joins is
    -- dropped here deliberately rather than concatenated.
    local apikey_val = ""
    if type(apikey) == "string" then
      apikey_val = apikey
    end
    query[QUERY_AUTH] = apikey_val
  end

  return spec, nil
end

return prepare_auth_util
