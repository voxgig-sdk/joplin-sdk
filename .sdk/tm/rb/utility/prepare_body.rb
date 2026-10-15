# Joplin SDK utility: prepare_body
require_relative 'media'
module JoplinUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return JoplinUtilities.raw_body(ctx.reqdata) if JoplinUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
