import * as express from "express";
import {IFilterMiddleware} from "./IFilterMiddleware";
import {IExtendedRequest} from "./IExtendedRequest";
import {SyncedRequestHandler} from "./SyncedRequestHandler";

declare type RequestMapping = {
    method: string,
    path: string,
    target: any,
    filter?: IFilterMiddleware,
    synced: boolean,
    bufferSize: number
}

export class ExpressController {

    private filter: IFilterMiddleware;
    private router: express.Router;
    private syncedBuffer: Map<string, Array<any>>;
    private syncedBufferProcess: Map<string, boolean>;

    private decoratedMethods: Array<RequestMapping>;

    constructor() {
        this.router = express.Router();
        this.syncedBuffer = new Map<string, Array<any>>();
        this.syncedBufferProcess = new Map<string, boolean>();

        this.router.use((req, res, next) => {
           if (this.filter)
               return this.filter.apply(req, res, next);
           next();
        });

        // call pre-init
        this.beforeInit();

        // init routes
        if (this.decoratedMethods) {
            this.decoratedMethods.forEach(path => {
                if (path.synced){
                    const handler = new SyncedRequestHandler(path.bufferSize, path.target.bind(this));
                    this[path.method](path.path, handler.getHandler(), path.filter);
                } else {
                    this[path.method](path.path, path.target.bind(this), path.filter);
                }
            });
        }

    }

    /**
     * Apply additional express middleware or pre-init
     * stuff before adding controllers
     *
     */
    public beforeInit(){}

    public applyFilter(filter: IFilterMiddleware): void {
        this.filter = filter;
    }

    public getExpressRouter(): express.Router {
        return this.router;
    }

    /**
     *  Define GET rule
     */
    public get (path: string, handler: (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => any, filter?: IFilterMiddleware) {
        if (filter)
            this.router.get(path, filter.apply.bind(filter), handler);
        else
            this.router.get(path, handler);
    }

    /**
     *  Define POST rule
     */
    public post(path: string, handler: (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => any, filter?: IFilterMiddleware) {
        if (filter)
            this.router.post(path, filter.apply.bind(filter), handler);
        else
            this.router.post(path, handler);
    }

    /**
     *  Define PUT rule
     */
    public put(path: string, handler: (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => any, filter?: IFilterMiddleware) {
        if (filter)
            this.router.put(path, filter.apply.bind(filter), handler);
        else
            this.router.put(path, handler);
    }

    /**
     *  Define DELETE rule
     */
    public delete(path: string, handler: (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => any, filter?: IFilterMiddleware) {
        if (filter)
            this.router.delete(path, filter.apply.bind(filter), handler);
        else
            this.router.delete(path, handler);
    }


}


/**
 * Request Type and Method mapping with Decorators
 */

/**
 * GET Request
 * @param {string} path
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 */
export function Get(path: string, filter?: IFilterMiddleware) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        if (!target.decoratedMethods) target.decoratedMethods = Array<RequestMapping>();

        const decoratedMethod = target.decoratedMethods.find(element => element.path === path && element.method === "get");

        if (decoratedMethod) {
            decoratedMethod.target = descriptor.value;
            decoratedMethod.filter = filter;
        } else {
            target.decoratedMethods.push({
                method: "get",
                path: path,
                target: descriptor.value,
                filter: filter
            });
        }
    };
}

/**
 * POST Request
 * @param {string} path
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 */
export function Post(path: string, filter?: IFilterMiddleware) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        if (!target.decoratedMethods) target.decoratedMethods = Array<RequestMapping>();

        const decoratedMethod = target.decoratedMethods.find(element => element.path === path && element.method === "post");

        if (decoratedMethod) {
            decoratedMethod.target = descriptor.value;
            decoratedMethod.filter = filter;
        } else {
            target.decoratedMethods.push({
                method: "post",
                path: path,
                target: descriptor.value,
                filter: filter
            });
        }
    };
}

/**
 * SyncedPOST Request
 *
 * Controls amount of parallel requests, with awaiting for promise to complete
 *
 * @param {string} path
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 */
export function SyncedPost(path: string, bufferSize: number, filter?: IFilterMiddleware) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        if (!target.decoratedMethods) target.decoratedMethods = Array<RequestMapping>();

        const decoratedMethod = target.decoratedMethods.find(element => element.path === path && element.method === "post");

        if (decoratedMethod) {
            decoratedMethod.target = descriptor.value;
            decoratedMethod.filter = filter;
        } else {
            target.decoratedMethods.push({
                method: "post",
                path: path,
                target: descriptor.value,
                filter: filter,
                synced: true,
                bufferSize: bufferSize
            });
        }
    };
}



/**
 * PUT Request
 * @param {string} path
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 */
export function Put(path: string, filter?: IFilterMiddleware) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        if (!target.decoratedMethods) target.decoratedMethods = Array<RequestMapping>();

        const decoratedMethod = target.decoratedMethods.find(element => element.path === path && element.method === "put");

        if (decoratedMethod) {
            decoratedMethod.target = descriptor.value;
            decoratedMethod.filter = filter;
        } else {
            target.decoratedMethods.push({
                method: "put",
                path: path,
                target: descriptor.value,
                filter: filter
            });
        }
    };
}

/**
 * DELETE Request
 * @param {string} path
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => any}
 */
export function Delete(path: string, filter?: IFilterMiddleware) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        if (!target.decoratedMethods) target.decoratedMethods = Array<RequestMapping>();

        const decoratedMethod = target.decoratedMethods.find(element => element.path === path && element.method === "delete");

        if (decoratedMethod) {
            decoratedMethod.target = descriptor.value;
            decoratedMethod.filter = filter;
        } else {
            target.decoratedMethods.push({
                method: "delete",
                path: path,
                target: descriptor.value,
                filter: filter
            });
        }
    };
}
