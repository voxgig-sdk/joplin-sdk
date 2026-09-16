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

func TestNoteEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Note(nil)
		if ent == nil {
			t.Fatal("expected non-nil NoteEntity")
		}
	})

	// Feature #4: the entity Stream(action, ...) method runs the op pipeline and
	// returns a channel over result items. With the streaming feature active it
	// yields the feature's incremental output; otherwise it falls back to the
	// materialised list so Stream always yields.
	t.Run("stream", func(t *testing.T) {
		seed := map[string]any{
			"entity": map[string]any{
				"note": map[string]any{
					"s1": map[string]any{"id": "s1"},
					"s2": map[string]any{"id": "s2"},
					"s3": map[string]any{"id": "s3"},
				},
			},
		}

		// Fallback: streaming inactive -> yields the materialised list items.
		base := sdk.TestSDK(seed, nil)
		var seen []any
		for item := range base.Note(nil).Stream("list", nil, nil) {
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
			for item := range streamSdk.Note(nil).Stream("list", nil, nil) {
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
		setup := noteBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "note." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set JOPLIN_TEST_NOTE_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		noteRef01Ent := client.Note(nil)
		noteRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "note"}), "note_ref01"))

		noteRef01DataResult, err := noteRef01Ent.Create(noteRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		noteRef01Data = core.ToMapAny(entityData(noteRef01DataResult))
		if noteRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if noteRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		noteRef01Match := map[string]any{}

		noteRef01ListResult, err := noteRef01Ent.List(noteRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		noteRef01List, noteRef01ListOk := noteRef01ListResult.([]any)
		if !noteRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", noteRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(noteRef01List), map[string]any{"id": noteRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		noteRef01DataUp0Up := map[string]any{
			"id": noteRef01Data["id"],
		}

		noteRef01MarkdefUp0Name := "author"
		noteRef01MarkdefUp0Value := fmt.Sprintf("Mark01-note_ref01_%d", setup.now)
		noteRef01DataUp0Up[noteRef01MarkdefUp0Name] = noteRef01MarkdefUp0Value

		noteRef01ResdataUp0Result, err := noteRef01Ent.Update(noteRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		noteRef01ResdataUp0 := core.ToMapAny(entityData(noteRef01ResdataUp0Result))
		if noteRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if noteRef01ResdataUp0["id"] != noteRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if noteRef01ResdataUp0[noteRef01MarkdefUp0Name] != noteRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", noteRef01MarkdefUp0Name, noteRef01ResdataUp0[noteRef01MarkdefUp0Name])
		}

		// LOAD
		noteRef01MatchDt0 := map[string]any{
			"id": noteRef01Data["id"],
		}
		noteRef01DataDt0Loaded, err := noteRef01Ent.Load(noteRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		noteRef01DataDt0LoadResult := core.ToMapAny(entityData(noteRef01DataDt0Loaded))
		if noteRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if noteRef01DataDt0LoadResult["id"] != noteRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

		// REMOVE
		noteRef01MatchRm0 := map[string]any{
			"id": noteRef01Data["id"],
		}
		_, err = noteRef01Ent.Remove(noteRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		noteRef01MatchRt0 := map[string]any{}

		noteRef01ListRt0Result, err := noteRef01Ent.List(noteRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		noteRef01ListRt0, noteRef01ListRt0Ok := noteRef01ListRt0Result.([]any)
		if !noteRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", noteRef01ListRt0Result)
		}

		notFoundItem := vs.Select(entityListToData(noteRef01ListRt0), map[string]any{"id": noteRef01Data["id"]})
		if !vs.IsEmpty(notFoundItem) {
			t.Fatal("expected removed entity to not be in list")
		}

	})
}

func noteBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "note", "NoteTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read note test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse note test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"note01", "note02", "note03"},
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
	entidEnvRaw := os.Getenv("JOPLIN_TEST_NOTE_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"JOPLIN_TEST_NOTE_ENTID": idmap,
		"JOPLIN_TEST_LIVE":      "FALSE",
		"JOPLIN_TEST_EXPLAIN":   "FALSE",
		"JOPLIN_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["JOPLIN_TEST_NOTE_ENTID"])
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
