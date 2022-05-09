export declare type MiddlewareSSRLoaderQuery = {
    absolute500Path: string;
    absoluteAppPath: string;
    absoluteAppServerPath: string;
    absoluteDocumentPath: string;
    absoluteErrorPath: string;
    absolutePagePath: string;
    buildId: string;
    dev: boolean;
    isServerComponent: boolean;
    page: string;
    stringifiedConfig: string;
};
export default function middlewareSSRLoader(this: any): Promise<string>;
