# Joplin SDK utility: make_context
require_relative '../core/context'
module JoplinUtilities
  MakeContext = ->(ctxmap, basectx) {
    JoplinContext.new(ctxmap, basectx)
  }
end
