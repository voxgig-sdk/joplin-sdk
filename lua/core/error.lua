-- Joplin SDK error

local JoplinError = {}
JoplinError.__index = JoplinError


function JoplinError.new(code, msg, ctx)
  local self = setmetatable({}, JoplinError)
  self.is_sdk_error = true
  self.sdk = "Joplin"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function JoplinError:error()
  return self.msg
end


function JoplinError:__tostring()
  return self.msg
end


return JoplinError
