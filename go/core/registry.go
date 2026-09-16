package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewDebugFeatureFunc func() Feature

var NewIdempotencyFeatureFunc func() Feature

var NewMetricsFeatureFunc func() Feature

var NewPagingFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewFolderEntityFunc func(client *JoplinSDK, entopts map[string]any) JoplinEntity

var NewNoteEntityFunc func(client *JoplinSDK, entopts map[string]any) JoplinEntity

var NewTagEntityFunc func(client *JoplinSDK, entopts map[string]any) JoplinEntity

