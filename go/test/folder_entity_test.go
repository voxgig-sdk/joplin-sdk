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

func TestFolderEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Folder(nil)
		if ent == nil {
			t.Fatal("expected non-nil FolderEntity")
		}
	})

	// Feature #4: the entity Stream(action, ...) method runs the op pipeline and
	// returns a channel over result items. With the streaming feature active it
	// yields the feature's incremental output; otherwise it falls back to the
	// materialised list so Stream always yields.
	t.Run("stream", func(t *testing.T) {
		seed := map[string]any{
			"entity": map[string]any{
				"folder": map[string]any{
					"s1": map[string]any{"id": "s1"},
					"s2": map[string]any{"id": "s2"},
					"s3": map[string]any{"id": "s3"},
				},
			},
		}

		// Fallback: streaming inactive -> yields the materialised list items.
		base := sdk.TestSDK(seed, nil)
		var seen []any
		for item := range base.Folder(nil).Stream("list", nil, nil) {
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
			for item := range streamSdk.Folder(nil).Stream("list", nil, nil) {
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
		setup := folderBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "folder." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set JOPLIN_TEST_FOLDER_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		folderRef01Ent := client.Folder(nil)
		folderRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "folder"}), "folder_ref01"))

		folderRef01DataResult, err := folderRef01Ent.Create(folderRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		folderRef01Data = core.ToMapAny(entityData(folderRef01DataResult))
		if folderRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if folderRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		folderRef01Match := map[string]any{}

		folderRef01ListResult, err := folderRef01Ent.List(folderRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		folderRef01List, folderRef01ListOk := folderRef01ListResult.([]any)
		if !folderRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", folderRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(folderRef01List), map[string]any{"id": folderRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		folderRef01DataUp0Up := map[string]any{
			"id": folderRef01Data["id"],
		}

		folderRef01MarkdefUp0Name := "parent_id"
		folderRef01MarkdefUp0Value := fmt.Sprintf("Mark01-folder_ref01_%d", setup.now)
		folderRef01DataUp0Up[folderRef01MarkdefUp0Name] = folderRef01MarkdefUp0Value

		folderRef01ResdataUp0Result, err := folderRef01Ent.Update(folderRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		folderRef01ResdataUp0 := core.ToMapAny(entityData(folderRef01ResdataUp0Result))
		if folderRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if folderRef01ResdataUp0["id"] != folderRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if folderRef01ResdataUp0[folderRef01MarkdefUp0Name] != folderRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", folderRef01MarkdefUp0Name, folderRef01ResdataUp0[folderRef01MarkdefUp0Name])
		}

		// LOAD
		folderRef01MatchDt0 := map[string]any{
			"id": folderRef01Data["id"],
		}
		folderRef01DataDt0Loaded, err := folderRef01Ent.Load(folderRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		folderRef01DataDt0LoadResult := core.ToMapAny(entityData(folderRef01DataDt0Loaded))
		if folderRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if folderRef01DataDt0LoadResult["id"] != folderRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

		// REMOVE
		folderRef01MatchRm0 := map[string]any{
			"id": folderRef01Data["id"],
		}
		_, err = folderRef01Ent.Remove(folderRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		folderRef01MatchRt0 := map[string]any{}

		folderRef01ListRt0Result, err := folderRef01Ent.List(folderRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		folderRef01ListRt0, folderRef01ListRt0Ok := folderRef01ListRt0Result.([]any)
		if !folderRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", folderRef01ListRt0Result)
		}

		notFoundItem := vs.Select(entityListToData(folderRef01ListRt0), map[string]any{"id": folderRef01Data["id"]})
		if !vs.IsEmpty(notFoundItem) {
			t.Fatal("expected removed entity to not be in list")
		}

	})
}

func folderBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "folder", "FolderTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read folder test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse folder test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"folder01", "folder02", "folder03"},
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
	entidEnvRaw := os.Getenv("JOPLIN_TEST_FOLDER_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"JOPLIN_TEST_FOLDER_ENTID": idmap,
		"JOPLIN_TEST_LIVE":      "FALSE",
		"JOPLIN_TEST_EXPLAIN":   "FALSE",
		"JOPLIN_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["JOPLIN_TEST_FOLDER_ENTID"])
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
