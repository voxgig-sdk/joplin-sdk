<?php
declare(strict_types=1);

// Joplin SDK utility: prepare_auth

class JoplinPrepareAuth
{
    private const QUERY_AUTH = 'token';
    private const OPTION_APIKEY = 'apikey';
    private const NOT_FOUND = '__NOTFOUND__';

    // The client's auth.name option, when set, replaces the name the API declares.
    private static function authName(array $options): string
    {
        $name = \Voxgig\Struct\Struct::getpath($options, 'auth.name');
        return is_string($name) && '' !== $name ? $name : self::QUERY_AUTH;
    }

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

        $name = self::authName($options);

        // A credential left under the declared name would travel beside the renamed one.
        if ($name !== self::QUERY_AUTH) {
            unset($query[self::QUERY_AUTH]);
        }

        $apikey = \Voxgig\Struct\Struct::getprop($options, self::OPTION_APIKEY, self::NOT_FOUND);

        if (
            (is_string($apikey) && ($apikey === self::NOT_FOUND || $apikey === ''))
            || $apikey === null
        ) {
            unset($query[$name]);
        } else {
            // NO PREFIX IN A QUERY STRING. `?token=Bearer%20abc` is not a
            // thing any API reads; the prefix is a header convention and is
            // dropped here deliberately rather than silently concatenated.
            $query[$name] = is_string($apikey) ? $apikey : '';
        }

        return [$spec, null];
    }
}
