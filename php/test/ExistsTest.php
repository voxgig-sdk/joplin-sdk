<?php
declare(strict_types=1);

// Joplin SDK exists test

require_once __DIR__ . '/../joplin_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = JoplinSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
