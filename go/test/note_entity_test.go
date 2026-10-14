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

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const noteEntityLiveStrict = true


type noteFailHook struct {
	sdk.BaseFeature
	unexpected int
}

func (f *noteFailHook) PreSpec(ctx *sdk.Context) {
	panic("note hook failed")
}

func (f *noteFailHook) PreUnexpected(ctx *sdk.Context) {
	f.unexpected++
}

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
		for si := range base.Note(nil).Stream("list", nil, nil) {
			if si.Err != nil {
				t.Fatalf("stream failed: %v", si.Err)
			}
			seen = append(seen, si.Item)
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
			for si := range streamSdk.Note(nil).Stream("list", nil, nil) {
				if si.Err != nil {
					t.Fatalf("stream failed: %v", si.Err)
				}
				if sub, ok := si.Item.([]any); ok {
					got = append(got, sub...)
				} else {
					got = append(got, si.Item)
				}
			}
			if len(got) != 3 {
				t.Fatalf("expected 3 items via streaming feature, got %d", len(got))
			}
		}
	})

	t.Run("stream-error", func(t *testing.T) {
		offline := map[string]any{"net": map[string]any{"offline": true}}
		var streamerr error
		for si := range sdk.TestSDK(offline, nil).Note(nil).Stream("list", nil, nil) {
			if si.Err != nil {
				streamerr = si.Err
			}
		}
		if nil == streamerr || !strings.Contains(streamerr.Error(), "offline") {
			t.Fatalf("expected the transport failure as a stream value, got %v", streamerr)
		}

		quiet := map[string]any{"ctrl": map[string]any{"throw": false}}
		for si := range sdk.TestSDK(offline, nil).Note(nil).Stream("list", nil, quiet) {
			if si.Err != nil {
				t.Fatalf("throw false: expected no error value, got %v", si.Err)
			}
		}

		if fhHasFeature("rbac") {
			denied := sdk.TestSDK(nil, map[string]any{
				"feature": map[string]any{"rbac": map[string]any{"active": true, "deny": true}},
			})
			var denyerr error
			for si := range denied.Note(nil).Stream("list", nil, nil) {
				if si.Err != nil {
					denyerr = si.Err
				}
			}
			if sdkerr, ok := denyerr.(*core.JoplinError); !ok || "rbac_denied" != sdkerr.Code {
				t.Fatalf("expected the rbac denial as a stream value, got %v", denyerr)
			}
		}
	})

	t.Run("stream-ctrl", func(t *testing.T) {
		explain := map[string]any{}
		ctrl := map[string]any{"explain": explain}
		for range sdk.TestSDK(nil, nil).Note(nil).Stream("list", nil, map[string]any{"ctrl": ctrl}) {
		}
		if _, has := ctrl["stream"]; has || 1 != len(ctrl) {
			t.Fatalf("the stream changed the caller's ctrl")
		}
		if 0 == len(explain) {
			t.Fatalf("the caller's explain record was not filled")
		}
	})

	t.Run("unexpected", func(t *testing.T) {
		hook := &noteFailHook{
			BaseFeature: sdk.BaseFeature{Version: "0.0.1", Name: "failhook", Active: true}}
		client := sdk.TestSDK(nil, map[string]any{"extend": []any{hook}})

		_, err := client.Note(nil).List(nil, nil)
		if nil == err || !strings.Contains(err.Error(), "hook failed") {
			t.Fatalf("expected the hook's failure, got %v", err)
		}
		if 0 == hook.unexpected {
			t.Fatalf("PreUnexpected did not fire")
		}

		fired := hook.unexpected
		if _, err := client.Note(nil).List(nil, map[string]any{"throw": false}); nil != err {
			t.Fatalf("throw false: expected no error, got %v", err)
		}
		if fired == hook.unexpected {
			t.Fatalf("throw false: PreUnexpected did not fire")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.Note(nil).List(map[string]any{"field": 1}, nil)
		if sdkerr, ok := err.(*core.JoplinError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
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
		client := setup.client
		_ = client

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

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
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
