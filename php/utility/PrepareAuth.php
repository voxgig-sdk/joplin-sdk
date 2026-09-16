<?php
declare(strict_types=1);

// Joplin SDK utility: prepare_auth

class JoplinPrepareAuth
{
    private const QUERY_AUTH = 'token';
    private const OPTION_APIKEY = 'apikey';
    private const NOT_FOUND = '__NOTFOUND__';

    public static function call(JoplinContext $ctx): array
    {
        $spec = $ctx->spec;
        if (!$spec) {
            return [null, $ctx->make_error('auth_no_spec', 'Expected context spec property to be defined.')];
        }

        $query = &$spec->query;
        $options = $ctx->client->options_map();

        // Public APIs that need no auth omit the options.auth block entirely.
        if (!isset($options['auth']) || $options['auth'] === null) {
            unset($query[self::QUERY_AUTH]);
            return [$spec, null];
        }

        $apikey = \Voxgig\Struct\Struct::getprop($options, self::OPTION_APIKEY, self::NOT_FOUND);

        if (
            (is_string($apikey) && ($apikey === self::NOT_FOUND || $apikey === ''))
            || $apikey === null
        ) {
            unset($query[self::QUERY_AUTH]);
        } else {
            // NO PREFIX IN A QUERY STRING. `?token=Bearer%20abc` is not a
            // thing any API reads; the prefix is a header convention and is
            // dropped here deliberately rather than silently concatenated.
            $query[self::QUERY_AUTH] = is_string($apikey) ? $apikey : '';
        }

        return [$spec, null];
    }
}
