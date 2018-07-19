import * as express from "express";
import {IFilterMiddleware} from "./IFilterMiddleware";
import {IExtendedRequest} from "./IExtendedRequest";

declare type RequestMapping = {
    method: string,
    path: string,
    target: any,
    filter?: IFilterMiddleware
}

export class ExpressController {

    private filter: IFilterMiddleware;
    private router: express.Router;

    private decoratedMethods: Array<RequestMapping>;

    constructor() {
        this.router = express.Router();


        this.router.use((req, res, next) => {
           if (this.filter)
               return this.filter.apply(req, res, next);
           next();
        });

        // init routes
        if (this.decoratedMethods) {
            this.decoratedMethods.forEach(path => {
                this[path.method](path.path, path.target.bind(this), path.filter);
            });
        }
    }

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
        target.decoratedMethods.push({
            method: "get",
            path: path,
            target: descriptor.value,
            filter: filter
        });
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
        target.decoratedMethods.push({
            method: "post",
            path: path,
            target: descriptor.value,
            filter: filter
        });
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
        target.decoratedMethods.push({
            method: "put",
            path: path,
            target: descriptor.value,
            filter: filter
        });
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
        target.decoratedMethods.push({
            method: "delete",
            path: path,
            target: descriptor.value,
            filter: filter
        });
    };
}