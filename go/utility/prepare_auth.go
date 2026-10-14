package utility

import (
	vs "github.com/voxgig-sdk/joplin-sdk/go/utility/struct"

	"github.com/voxgig-sdk/joplin-sdk/go/core"
)

const credName = "token"
const optionApikey = "apikey"
const notFound = "__NOTFOUND__"

// The client's auth.name option, when set, replaces the name the API declares.
func authName(options map[string]any) string {
	if name, ok := vs.GetPath(options, []any{"auth", "name"}).(string); ok && name != "" {
		return name
	}
	return credName
}

func prepareAuthUtil(ctx *core.Context) (*core.Spec, error) {
	spec := ctx.Spec
	if spec == nil {
		return nil, ctx.MakeError("auth_no_spec",
			"Expected context spec property to be defined.")
	}

	query := spec.Query
	options := ctx.Client.OptionsMap()

	// Public APIs that need no auth omit the options.auth block entirely.
	if options["auth"] == nil {
		delete(query, credName)
		return spec, nil
	}

	name := authName(options)

	// A credential left under the declared name would travel beside the renamed one.
	if name != credName {
		delete(query, credName)
	}

	apikey := vs.GetProp(options, optionApikey, notFound)

	skip := false
	if apikey == nil {
		skip = true
	} else if apikeyStr, ok := apikey.(string); ok &&
		(apikeyStr == notFound || apikeyStr == "") {
		skip = true
	}

	if skip {
		delete(query, name)
	} else {
		apikeyVal := ""
		if av, ok := apikey.(string); ok {
			apikeyVal = av
		}
		query[name] = apikeyVal
	}

	return spec, nil
}
