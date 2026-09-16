# Joplin SDK utility: prepare_auth
require_relative 'struct/voxgig_struct'
module JoplinUtilities
  QUERY_AUTH = "token"
  OPTION_APIKEY = "apikey"
  NOT_FOUND = "__NOTFOUND__"

  PrepareAuth = ->(ctx) {
    spec = ctx.spec
    return nil, ctx.make_error("auth_no_spec", "Expected context spec property to be defined.") unless spec

    query = spec.query
    options = ctx.client.options_map

    # Public APIs that need no auth omit the options.auth block entirely.
    if options["auth"].nil?
      query.delete(QUERY_AUTH)
      return spec, nil
    end

    apikey = VoxgigStruct.getprop(options, OPTION_APIKEY, NOT_FOUND)

    if apikey.nil? || (apikey.is_a?(String) && (apikey == NOT_FOUND || apikey == ""))
      query.delete(QUERY_AUTH)
    else
      apikey_val = apikey.is_a?(String) ? apikey : ""
      # NO PREFIX IN A QUERY STRING: `?token=Bearer%20abc` is not a thing
      # any API reads, so options.auth.prefix is dropped rather than joined.
      query[QUERY_AUTH] = apikey_val
    end

    return spec, nil
  }
end
