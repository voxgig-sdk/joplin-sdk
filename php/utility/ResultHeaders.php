<?php
declare(strict_types=1);

// Joplin SDK utility: result_headers

class JoplinResultHeaders
{
    public static function call(JoplinContext $ctx): ?JoplinResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
