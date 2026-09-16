# Joplin SDK utility: make_context

from joplin_sdk.core.context import JoplinContext


def make_context_util(ctxmap, basectx):
    return JoplinContext(ctxmap, basectx)
