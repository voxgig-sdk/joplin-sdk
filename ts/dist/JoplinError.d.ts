import { Context } from './Context';
declare class JoplinError extends Error {
    isJoplinError: boolean;
    sdk: string;
    code: string;
    ctx: Context;
    status: number;
    get notFound(): boolean;
    constructor(code: string, msg: string, ctx: Context);
}
export { JoplinError };
