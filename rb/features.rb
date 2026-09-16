# Joplin SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/debug_feature'
require_relative 'feature/idempotency_feature'
require_relative 'feature/metrics_feature'
require_relative 'feature/paging_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module JoplinFeatures
  def self.make_feature(name)
    case name
    when "base"
      JoplinBaseFeature.new
    when "debug"
      JoplinDebugFeature.new
    when "idempotency"
      JoplinIdempotencyFeature.new
    when "metrics"
      JoplinMetricsFeature.new
    when "paging"
      JoplinPagingFeature.new
    when "ratelimit"
      JoplinRatelimitFeature.new
    when "retry"
      JoplinRetryFeature.new
    when "test"
      JoplinTestFeature.new
    when "timeout"
      JoplinTimeoutFeature.new
    else
      JoplinBaseFeature.new
    end
  end
end
