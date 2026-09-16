<?php
declare(strict_types=1);

// Joplin SDK base feature

class JoplinBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(JoplinContext $ctx, array $options): void {}
    public function PostConstruct(JoplinContext $ctx): void {}
    public function PostConstructEntity(JoplinContext $ctx): void {}
    public function SetData(JoplinContext $ctx): void {}
    public function GetData(JoplinContext $ctx): void {}
    public function GetMatch(JoplinContext $ctx): void {}
    public function SetMatch(JoplinContext $ctx): void {}
    public function PrePoint(JoplinContext $ctx): void {}
    public function PreSpec(JoplinContext $ctx): void {}
    public function PreRequest(JoplinContext $ctx): void {}
    public function PreResponse(JoplinContext $ctx): void {}
    public function PreResult(JoplinContext $ctx): void {}
    public function PreDone(JoplinContext $ctx): void {}
    public function PreUnexpected(JoplinContext $ctx): void {}
}
