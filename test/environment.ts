import {Sunset} from "../src/Sunset";
import {TestAPI} from "./app/TestAPI";
import {StaticRoute} from "../src/StaticRoute";
import {Application} from "./app/Application";

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

    const app = new Application();
    sunset.deployApplication("/", app);

    app.deployRoute("/api", (new TestAPI()));

    let staticRoute = new StaticRoute();
    staticRoute.setMapping("/", "/public/media/xxx/xx");
    app.deployRoute("/", staticRoute);

    done();

});

after(function (done) {
    this.timeout(200000);
    setTimeout(() => {
        sunset.terminate();
        done();
    }, 10000);
});

