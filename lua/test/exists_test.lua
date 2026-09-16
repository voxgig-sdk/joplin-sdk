-- Joplin SDK exists test

local sdk = require("joplin_sdk")

describe("JoplinSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
