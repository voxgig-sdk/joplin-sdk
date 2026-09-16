# Joplin SDK feature factory

from joplin_sdk.feature.base_feature import JoplinBaseFeature
from joplin_sdk.feature.debug_feature import JoplinDebugFeature
from joplin_sdk.feature.idempotency_feature import JoplinIdempotencyFeature
from joplin_sdk.feature.metrics_feature import JoplinMetricsFeature
from joplin_sdk.feature.paging_feature import JoplinPagingFeature
from joplin_sdk.feature.ratelimit_feature import JoplinRatelimitFeature
from joplin_sdk.feature.retry_feature import JoplinRetryFeature
from joplin_sdk.feature.test_feature import JoplinTestFeature
from joplin_sdk.feature.timeout_feature import JoplinTimeoutFeature


_FEATURES = {
    "base": lambda: JoplinBaseFeature(),
    "debug": lambda: JoplinDebugFeature(),
    "idempotency": lambda: JoplinIdempotencyFeature(),
    "metrics": lambda: JoplinMetricsFeature(),
    "paging": lambda: JoplinPagingFeature(),
    "ratelimit": lambda: JoplinRatelimitFeature(),
    "retry": lambda: JoplinRetryFeature(),
    "test": lambda: JoplinTestFeature(),
    "timeout": lambda: JoplinTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
