<?php
declare(strict_types=1);

// Joplin SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class JoplinMakeContext
{
    public static function call(array $ctxmap, ?JoplinContext $basectx): JoplinContext
    {
        return new JoplinContext($ctxmap, $basectx);
    }
}
