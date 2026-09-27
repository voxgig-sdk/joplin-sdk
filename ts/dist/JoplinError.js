"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoplinError = void 0;
class JoplinError extends Error {
    isJoplinError = true;
    sdk = 'Joplin';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.JoplinError = JoplinError;
//# sourceMappingURL=JoplinError.js.map