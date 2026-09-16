# Joplin SDK exists test

require "minitest/autorun"
require_relative "../Joplin_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = JoplinSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
