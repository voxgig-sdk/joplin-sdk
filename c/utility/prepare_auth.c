// prepare_auth utility (mirrors utility/prepare_auth.rs).
//
// GENERATED, not templated: where the credential goes - header, query or
// cookie, and under what name - is a fact about THIS API, and tm/ can only
// hold one answer. See PrepareAuth_c.

#include "sdk.h"

#include <stdlib.h>
#include <string.h>

#define CRED_NAME "token"
#define OPTION_APIKEY "apikey"
#define NOT_FOUND "__NOTFOUND__"

// The client's auth.name option, when set, replaces the name the API declares.
static const char* auth_name(voxgig_value* options) {
  voxgig_value* v = getpath2(options, "auth", "name");
  const char* name = voxgig_is_string(v) ? voxgig_as_string(v) : NULL;
  return (NULL == name || '\0' == name[0]) ? CRED_NAME : name;
}

// Places or clears the credential under name, the one in effect.
static Spec* prepare_auth_as(Context* ctx, Spec* spec, voxgig_value* query,
                             voxgig_value* options, const char* name,
                             PNError** err) {
  // A credential left under the declared name would travel beside the renamed one.
  if (0 != strcmp(name, CRED_NAME)) {
    voxgig_value* k = voxgig_new_string(CRED_NAME);
    voxgig_delprop(query, k);
    voxgig_release(k);
  }

  voxgig_value* akey_key = voxgig_new_string(OPTION_APIKEY);
  voxgig_value* nf = voxgig_new_string(NOT_FOUND);
  voxgig_value* apikey = voxgig_getprop(options, akey_key, nf);
  voxgig_release(akey_key);
  voxgig_release(nf);

  bool skip;
  if (v_is_noval(apikey) || v_is_null(apikey)) {
    skip = true;
  } else if (voxgig_is_string(apikey)) {
    const char* s = voxgig_as_string(apikey);
    skip = (strcmp(s, NOT_FOUND) == 0 || s[0] == '\0');
  } else {
    skip = false;
  }

  if (skip) {
    voxgig_value* k = voxgig_new_string(name);
    voxgig_delprop(query, k);
    voxgig_release(k);
  } else {
    const char* apikey_val = voxgig_is_string(apikey) ? voxgig_as_string(apikey) : "";
    setp(query, name, v_str(apikey_val));
  }

  return spec;
}

Spec* prepare_auth_util(Context* ctx, PNError** err) {
  *err = NULL;
  Spec* spec = ctx->spec;
  if (!spec) {
    *err = context_make_error(ctx, "auth_no_spec", "Expected context spec property to be defined.");
    return NULL;
  }

  voxgig_value* query = spec->query;
  voxgig_value* options = ctx->client ? sdk_options_map(ctx->client) : ctx->options;

  voxgig_value* auth = getp(options, "auth");
  if (v_is_noval(auth) || v_is_null(auth)) {
    voxgig_value* k = voxgig_new_string(CRED_NAME);
    voxgig_delprop(query, k);
    voxgig_release(k);
    return spec;
  }

  return prepare_auth_as(ctx, spec, query, options, auth_name(options), err);
}
