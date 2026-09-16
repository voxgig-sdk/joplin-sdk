<?php
declare(strict_types=1);

// Joplin SDK utility: result_body

class JoplinResultBody
{
    public static function call(JoplinContext $ctx): ?JoplinResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
