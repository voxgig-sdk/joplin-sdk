<?php
declare(strict_types=1);

// Note entity test

require_once __DIR__ . '/../joplin_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class NoteEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = JoplinSDK::test(null, null);
        $ent = $testsdk->Note(null);
        $this->assertNotNull($ent);
    }

    // Feature #4: the entity stream(action, ...) method runs the op pipeline
    // and yields result items. With the streaming feature active it yields the
    // feature's incremental output; otherwise it falls back to the materialised
    // list so stream always yields.
    public function test_stream(): void
    {
        $seed = [
            "entity" => [
                "note" => [
                    "s1" => ["id" => "s1"],
                    "s2" => ["id" => "s2"],
                    "s3" => ["id" => "s3"],
                ],
            ],
        ];

        // Fallback: streaming inactive -> yields the materialised list items.
        $base = JoplinSDK::test($seed, null);
        $seen = iterator_to_array($base->Note(null)->stream("list", null, null), false);
        $this->assertCount(3, $seen);

        // Inbound: streaming active -> yields each item from the feature.
        $cfg = JoplinConfig::shared_config();
        if (isset($cfg["feature"]) && is_array($cfg["feature"]) && isset($cfg["feature"]["streaming"])) {
            $sdk = JoplinSDK::test($seed, ["feature" => ["streaming" => ["active" => true]]]);
            $got = [];
            foreach ($sdk->Note(null)->stream("list", null, null) as $item) {
                if (is_array($item) && array_is_list($item)) {
                    foreach ($item as $sub) {
                        $got[] = $sub;
                    }
                } else {
                    $got[] = $item;
                }
            }
            $this->assertCount(3, $got);
        }
    }

    public function test_basic_flow(): void
    {
        $setup = note_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "list", "update", "load", "remove"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "note." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set JOPLIN_TEST_NOTE_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $note_ref01_ent = $client->Note(null);
        $note_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.note"), "note_ref01"));

        $note_ref01_data_result = $note_ref01_ent->create($note_ref01_data, null);
        $note_ref01_data = Helpers::to_map(is_object($note_ref01_data_result) && method_exists($note_ref01_data_result, 'data_get') ? $note_ref01_data_result->data_get() : $note_ref01_data_result);
        $this->assertNotNull($note_ref01_data);
        $this->assertNotNull($note_ref01_data["id"]);

        // LIST
        $note_ref01_match = [];

        $note_ref01_list_result = $note_ref01_ent->list($note_ref01_match, null);
        $this->assertIsArray($note_ref01_list_result);

        $found_item = sdk_select(
            Runner::entity_list_to_data($note_ref01_list_result),
            ["id" => $note_ref01_data["id"]]);
        $this->assertNotEmpty($found_item);

        // UPDATE
        $note_ref01_data_up0_up = [
            "id" => $note_ref01_data["id"],
        ];

        $note_ref01_markdef_up0_name = "author";
        $note_ref01_markdef_up0_value = "Mark01-note_ref01_" . $setup["now"];
        $note_ref01_data_up0_up[$note_ref01_markdef_up0_name] = $note_ref01_markdef_up0_value;

        $note_ref01_resdata_up0_result = $note_ref01_ent->update($note_ref01_data_up0_up, null);
        $note_ref01_resdata_up0 = Helpers::to_map(is_object($note_ref01_resdata_up0_result) && method_exists($note_ref01_resdata_up0_result, 'data_get') ? $note_ref01_resdata_up0_result->data_get() : $note_ref01_resdata_up0_result);
        $this->assertNotNull($note_ref01_resdata_up0);
        $this->assertEquals($note_ref01_resdata_up0["id"], $note_ref01_data_up0_up["id"]);
        $this->assertEquals($note_ref01_resdata_up0[$note_ref01_markdef_up0_name], $note_ref01_markdef_up0_value);

        // LOAD
        $note_ref01_match_dt0 = [
            "id" => $note_ref01_data["id"],
        ];
        $note_ref01_data_dt0_loaded = $note_ref01_ent->load($note_ref01_match_dt0, null);
        $note_ref01_data_dt0_load_result = Helpers::to_map(is_object($note_ref01_data_dt0_loaded) && method_exists($note_ref01_data_dt0_loaded, 'data_get') ? $note_ref01_data_dt0_loaded->data_get() : $note_ref01_data_dt0_loaded);
        $this->assertNotNull($note_ref01_data_dt0_load_result);
        $this->assertEquals($note_ref01_data_dt0_load_result["id"], $note_ref01_data["id"]);

        // REMOVE
        $note_ref01_match_rm0 = [
            "id" => $note_ref01_data["id"],
        ];
        $note_ref01_ent->remove($note_ref01_match_rm0, null);

        // LIST
        $note_ref01_match_rt0 = [];

        $note_ref01_list_rt0_result = $note_ref01_ent->list($note_ref01_match_rt0, null);
        $this->assertIsArray($note_ref01_list_rt0_result);

        $not_found_item = sdk_select(
            Runner::entity_list_to_data($note_ref01_list_rt0_result),
            ["id" => $note_ref01_data["id"]]);
        $this->assertEmpty($not_found_item);

    }
}

function note_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/note/NoteTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = JoplinSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["note01", "note02", "note03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("JOPLIN_TEST_NOTE_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "JOPLIN_TEST_NOTE_ENTID" => $idmap,
        "JOPLIN_TEST_LIVE" => "FALSE",
        "JOPLIN_TEST_EXPLAIN" => "FALSE",
        "JOPLIN_APIKEY" => "",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["JOPLIN_TEST_NOTE_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["JOPLIN_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            Runner::live_client_options(),
            [
                "apikey" => $env["JOPLIN_APIKEY"],
            ],
            // ismap, not a plain "?? []" default: an empty PHP array is a
            // LIST, and a non-map later entry REPLACES the accumulated map in
            // merge - so the no-extras call discarded live_client_options()
            // and the apikey/server map above it.
            Vs::ismap($extra) ? $extra : new \stdClass(),
        ]);
        // "?? []" because merge legitimately answers with a stdClass when every
        // contributing entry is an EMPTY map - an SDK with no apikey and no
        // server variables generates an empty middle entry, so that is the
        // common case, not the edge one. to_map returns null for a non-array by
        // design, and the constructor takes a non-nullable array, so without the
        // fallback every such SDK died on "must be of type array, null given"
        // the moment live mode was switched on. Offline mode never reaches this
        // branch, which is why the offline suite stayed green.
        $client = new JoplinSDK(Helpers::to_map($merged_opts) ?? []);
    }

    $live = $env["JOPLIN_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["JOPLIN_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
