# Joplin SDK utility: prepare_auth

from __future__ import annotations
from joplin_sdk.utility.voxgig_struct import voxgig_struct as vs

QUERY_AUTH = "token"
OPTION_APIKEY = "apikey"
NOT_FOUND = "__NOTFOUND__"


def prepare_auth_util(ctx):
    spec = ctx.spec
    if spec is None:
        return None, ctx.make_error("auth_no_spec",
            "Expected context spec property to be defined.")

    query = spec.query
    options = ctx.client.options_map()

    # Public APIs that need no auth omit the options.auth block entirely.
    if options.get("auth") is None:
        query.pop(QUERY_AUTH, None)
        return spec, None

    apikey = vs.getprop(options, OPTION_APIKEY, NOT_FOUND)

    if (
        (isinstance(apikey, str) and apikey == NOT_FOUND)
        or apikey is None
        or apikey == ""
    ):
        query.pop(QUERY_AUTH, None)
    else:
        apikey_val = ""
        if isinstance(apikey, str):
            apikey_val = apikey
        # NO PREFIX IN A QUERY STRING. `?token=Bearer%20abc` is not a
        # thing any API reads: the prefix is a header convention, so it is
        # dropped here deliberately rather than silently concatenated.
        query[QUERY_AUTH] = apikey_val

    return spec, None
