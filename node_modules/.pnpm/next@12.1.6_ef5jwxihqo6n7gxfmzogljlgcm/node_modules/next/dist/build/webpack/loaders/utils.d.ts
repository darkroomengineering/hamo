export declare const defaultJsFileExtensions: string[];
export declare function isNextBuiltinClientComponent(resourcePath: string): boolean;
export declare function buildExports(moduleExports: any, isESM: boolean): string;
export declare const createClientComponentFilter: () => (importSource: string) => boolean;
export declare const createServerComponentFilter: () => (importSource: string) => boolean;
