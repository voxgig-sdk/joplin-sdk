# Joplin SDK exists test

import pytest
from joplin_sdk import JoplinSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = JoplinSDK.test(None, None)
        assert testsdk is not None
