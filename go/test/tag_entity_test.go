package sdktest

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/joplin-sdk/go"
	"github.com/voxgig-sdk/joplin-sdk/go/core"

	vs "github.com/voxgig-sdk/joplin-sdk/go/utility/struct"
)

func TestTagEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Tag(nil)
		if ent == nil {
			t.Fatal("expected non-nil TagEntity")
		}
	})

	// Feature #4: the entity Stream(action, ...) method runs the op pipeline and
	// returns a channel over result items. With the streaming feature active it
	// yields the feature's incremental output; otherwise it falls back to the
	// materialised list so Stream always yields.
	t.Run("stream", func(t *testing.T) {
		seed := map[string]any{
			"entity": map[string]any{
				"tag": map[string]any{
					"s1": map[string]any{"id": "s1"},
					"s2": map[string]any{"id": "s2"},
					"s3": map[string]any{"id": "s3"},
				},
			},
		}

		// Fallback: streaming inactive -> yields the materialised list items.
		base := sdk.TestSDK(seed, nil)
		var seen []any
		for item := range base.Tag(nil).Stream("list", nil, nil) {
			seen = append(seen, item)
		}
		if len(seen) != 3 {
			t.Fatalf("expected 3 streamed items, got %d", len(seen))
		}

		// Inbound: streaming active -> yields each item from the feature iterator.
		hasStreaming := false
		if fm, ok := core.SharedConfig()["feature"].(map[string]any); ok {
			_, hasStreaming = fm["streaming"]
		}
		if hasStreaming {
			streamSdk := sdk.TestSDK(seed, map[string]any{
				"feature": map[string]any{"streaming": map[string]any{"active": true}},
			})
			var got []any
			for item := range streamSdk.Tag(nil).Stream("list", nil, nil) {
				if sub, ok := item.([]any); ok {
					got = append(got, sub...)
				} else {
					got = append(got, item)
				}
			}
			if len(got) != 3 {
				t.Fatalf("expected 3 items via streaming feature, got %d", len(got))
			}
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := tagBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "tag." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set JOPLIN_TEST_TAG_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		tagRef01Ent := client.Tag(nil)
		tagRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "tag"}), "tag_ref01"))

		tagRef01DataResult, err := tagRef01Ent.Create(tagRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		tagRef01Data = core.ToMapAny(entityData(tagRef01DataResult))
		if tagRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if tagRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		tagRef01Match := map[string]any{}

		tagRef01ListResult, err := tagRef01Ent.List(tagRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		tagRef01List, tagRef01ListOk := tagRef01ListResult.([]any)
		if !tagRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", tagRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(tagRef01List), map[string]any{"id": tagRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		tagRef01DataUp0Up := map[string]any{
			"id": tagRef01Data["id"],
		}

		tagRef01MarkdefUp0Name := "title"
		tagRef01MarkdefUp0Value := fmt.Sprintf("Mark01-tag_ref01_%d", setup.now)
		tagRef01DataUp0Up[tagRef01MarkdefUp0Name] = tagRef01MarkdefUp0Value

		tagRef01ResdataUp0Result, err := tagRef01Ent.Update(tagRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		tagRef01ResdataUp0 := core.ToMapAny(entityData(tagRef01ResdataUp0Result))
		if tagRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if tagRef01ResdataUp0["id"] != tagRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if tagRef01ResdataUp0[tagRef01MarkdefUp0Name] != tagRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", tagRef01MarkdefUp0Name, tagRef01ResdataUp0[tagRef01MarkdefUp0Name])
		}

		// LOAD
		tagRef01MatchDt0 := map[string]any{
			"id": tagRef01Data["id"],
		}
		tagRef01DataDt0Loaded, err := tagRef01Ent.Load(tagRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		tagRef01DataDt0LoadResult := core.ToMapAny(entityData(tagRef01DataDt0Loaded))
		if tagRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if tagRef01DataDt0LoadResult["id"] != tagRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

		// REMOVE
		tagRef01MatchRm0 := map[string]any{
			"id": tagRef01Data["id"],
		}
		_, err = tagRef01Ent.Remove(tagRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		tagRef01MatchRt0 := map[string]any{}

		tagRef01ListRt0Result, err := tagRef01Ent.List(tagRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		tagRef01ListRt0, tagRef01ListRt0Ok := tagRef01ListRt0Result.([]any)
		if !tagRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", tagRef01ListRt0Result)
		}

		notFoundItem := vs.Select(entityListToData(tagRef01ListRt0), map[string]any{"id": tagRef01Data["id"]})
		if !vs.IsEmpty(notFoundItem) {
			t.Fatal("expected removed entity to not be in list")
		}

	})
}

func tagBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "tag", "TagTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read tag test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse tag test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"tag01", "tag02", "tag03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("JOPLIN_TEST_TAG_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"JOPLIN_TEST_TAG_ENTID": idmap,
		"JOPLIN_TEST_LIVE":      "FALSE",
		"JOPLIN_TEST_EXPLAIN":   "FALSE",
		"JOPLIN_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["JOPLIN_TEST_TAG_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["JOPLIN_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["JOPLIN_APIKEY"],
			},
			extraOpts,
		})
		client = sdk.NewJoplinSDK(core.ToMapAny(mergedOpts))
	}

	live := env["JOPLIN_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["JOPLIN_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
