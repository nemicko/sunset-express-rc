import {Sunset} from "../src/Sunset";
import {TestAPI} from "./app/TestAPI";
import {StaticRoute} from "../src/StaticRoute";

var bodyParser = require('body-parser')

process.env.NODE_ENV = 'test';

process.on('unhandledRejection', function(reason, p){
    console.log(reason);
    console.log(p);
});

process.on('uncaughtException', function (exception) {
    console.error(exception);
});

var sunset = null;

before(done => {

    sunset = new Sunset(3000);
    sunset.startup();

    sunset.use(bodyParser.json());

    sunset.registerRoute("/api", (new TestAPI()));

    let staticRoute = new StaticRoute();
    staticRoute.setMapping("/", "/public/media/xxx/xx");

    sunset.registerRoute("/", staticRoute);

    done();

});

after(function () {
    sunset.terminate();
});

