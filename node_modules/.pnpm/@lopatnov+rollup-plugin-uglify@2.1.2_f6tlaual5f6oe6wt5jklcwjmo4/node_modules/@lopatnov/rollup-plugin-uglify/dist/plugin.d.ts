import { Plugin } from 'rollup';
import { MinifyOptions } from "terser";
export interface IUglifyOptions extends MinifyOptions {
    include?: string | RegExp;
    exclude?: string | RegExp;
}
declare function uglify(options?: IUglifyOptions): Plugin;
export default uglify;
