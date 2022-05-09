import type { webpack5 as webpack } from 'next/dist/compiled/webpack/webpack';
import { SimpleWebpackError } from './simpleWebpackError';
import { NextConfig } from '../../../../server/config-shared';
export declare function getModuleBuildError(compilation: webpack.Compilation, input: any, config: NextConfig): Promise<SimpleWebpackError | false>;
