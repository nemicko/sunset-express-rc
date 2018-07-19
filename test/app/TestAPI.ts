import {ExpressRouter} from "../../src/ExpressRouter";
import {TestController} from "./TestController";

export class TestAPI extends ExpressRouter{

    constructor(){
        super();

        this.addController("/", new TestController());

        /*
        this.getExpressRouter().use("/", function(){
            console.log("test");
        });*/
    }

}