# Tag entity test

require "minitest/autorun"
require "json"
require_relative "../Joplin_sdk"
require_relative "runner"

class TagEntityTest < Minitest::Test
  def test_create_instance
    testsdk = JoplinSDK.test(nil, nil)
    ent = testsdk.Tag(nil)
    assert !ent.nil?
  end

  # Feature #4: the entity stream(action, ...) method runs the op pipeline and
  # returns an Enumerator over result items. With the streaming feature active
  # it yields the feature's incremental output; otherwise it falls back to the
  # materialised list so stream always yields.
  def test_stream
    seed = {
      "entity" => {
        "tag" => {
          "s1" => { "id" => "s1" },
          "s2" => { "id" => "s2" },
          "s3" => { "id" => "s3" },
        },
      },
    }

    # Fallback: streaming inactive -> yields the materialised list items.
    base = JoplinSDK.test(seed, nil)
    seen = base.Tag(nil).stream("list", nil, nil).to_a
    assert_equal 3, seen.length

    # Inbound: streaming active -> yields each item from the feature.
    cfg = JoplinConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("streaming")
      sdk = JoplinSDK.test(seed, { "feature" => { "streaming" => { "active" => true } } })
      got = []
      sdk.Tag(nil).stream("list", nil, nil).each do |item|
        if item.is_a?(Array)
          got.concat(item)
        else
          got << item
        end
      end
      assert_equal 3, got.length
    end
  end

  def test_basic_flow
    setup = tag_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "list", "update", "load", "remove"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "tag." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set JOPLIN_TEST_TAG_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    tag_ref01_ent = client.Tag(nil)
    tag_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.tag"), "tag_ref01"))

    tag_ref01_data_result = tag_ref01_ent.create(tag_ref01_data, nil)
    tag_ref01_data = Helpers.to_map(tag_ref01_data_result.respond_to?(:data_get) ? tag_ref01_data_result.data_get : tag_ref01_data_result)
    assert !tag_ref01_data.nil?
    assert !tag_ref01_data["id"].nil?

    # LIST
    tag_ref01_match = {}

    tag_ref01_list_result = tag_ref01_ent.list(tag_ref01_match, nil)
    assert tag_ref01_list_result.is_a?(Array)

    found_item = Vs.select(
      Runner.entity_list_to_data(tag_ref01_list_result),
      { "id" => tag_ref01_data["id"] })
    assert !Vs.isempty(found_item)

    # UPDATE
    tag_ref01_data_up0_up = {
      "id" => tag_ref01_data["id"],
    }

    tag_ref01_markdef_up0_name = "title"
    tag_ref01_markdef_up0_value = "Mark01-tag_ref01_#{setup[:now]}"
    tag_ref01_data_up0_up[tag_ref01_markdef_up0_name] = tag_ref01_markdef_up0_value

    tag_ref01_resdata_up0_result = tag_ref01_ent.update(tag_ref01_data_up0_up, nil)
    tag_ref01_resdata_up0 = Helpers.to_map(tag_ref01_resdata_up0_result.respond_to?(:data_get) ? tag_ref01_resdata_up0_result.data_get : tag_ref01_resdata_up0_result)
    assert !tag_ref01_resdata_up0.nil?
    assert_equal tag_ref01_resdata_up0["id"], tag_ref01_data_up0_up["id"]
    assert_equal tag_ref01_resdata_up0[tag_ref01_markdef_up0_name], tag_ref01_markdef_up0_value

    # LOAD
    tag_ref01_match_dt0 = {
      "id" => tag_ref01_data["id"],
    }
    tag_ref01_data_dt0_loaded = tag_ref01_ent.load(tag_ref01_match_dt0, nil)
    tag_ref01_data_dt0_load_result = Helpers.to_map(tag_ref01_data_dt0_loaded.respond_to?(:data_get) ? tag_ref01_data_dt0_loaded.data_get : tag_ref01_data_dt0_loaded)
    assert !tag_ref01_data_dt0_load_result.nil?
    assert_equal tag_ref01_data_dt0_load_result["id"], tag_ref01_data["id"]

    # REMOVE
    tag_ref01_match_rm0 = {
      "id" => tag_ref01_data["id"],
    }
    tag_ref01_ent.remove(tag_ref01_match_rm0, nil)

    # LIST
    tag_ref01_match_rt0 = {}

    tag_ref01_list_rt0_result = tag_ref01_ent.list(tag_ref01_match_rt0, nil)
    assert tag_ref01_list_rt0_result.is_a?(Array)

    not_found_item = Vs.select(
      Runner.entity_list_to_data(tag_ref01_list_rt0_result),
      { "id" => tag_ref01_data["id"] })
    assert Vs.isempty(not_found_item)

  end
end

def tag_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "tag", "TagTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = JoplinSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["tag01", "tag02", "tag03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Detect ENTID env override before envOverride consumes it. When live
  # mode is on without a real override, the basic test runs against synthetic
  # IDs from the fixture and 4xx's. Surface this so the test can skip.
  entid_env_raw = ENV["JOPLIN_TEST_TAG_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "JOPLIN_TEST_TAG_ENTID" => idmap,
    "JOPLIN_TEST_LIVE" => "FALSE",
    "JOPLIN_TEST_EXPLAIN" => "FALSE",
    "JOPLIN_APIKEY" => "",
  })

  idmap_resolved = Helpers.to_map(
    env["JOPLIN_TEST_TAG_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["JOPLIN_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
        "apikey" => env["JOPLIN_APIKEY"],
      },
      extra || {},
    ])
    client = JoplinSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["JOPLIN_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["JOPLIN_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
