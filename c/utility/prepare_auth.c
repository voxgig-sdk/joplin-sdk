// prepare_auth utility (mirrors utility/prepare_auth.rs).
//
// GENERATED, not templated: where the credential goes - header, query or
// cookie, and under what name - is a fact about THIS API, and tm/ can only
// hold one answer. See PrepareAuth_c.

#include "sdk.h"

#include <string.h>

#define CRED_NAME "token"
#define OPTION_APIKEY "apikey"
#define NOT_FOUND "__NOTFOUND__"

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
    voxgig_value* k = voxgig_new_string(CRED_NAME);
    voxgig_delprop(query, k);
    voxgig_release(k);
  } else {
    const char* apikey_val = voxgig_is_string(apikey) ? voxgig_as_string(apikey) : "";
    setp(query, CRED_NAME, v_str(apikey_val));
  }

  return spec;
}
