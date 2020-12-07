import * as chai from "chai";
import chaiHttp = require("chai-http");

chai.use(chaiHttp);
const expect = chai.expect;

const request = require("request");

/**
 *  Testing API Calls
 */
describe('Sunset Route/Controller Test', function () {

    it("GET Request", (done) => {
        chai.request('http://localhost:3000')
            .get('/api/12345')
            .set('test-header', "my-header")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.param1).to.be.equal("12345");
                done();
            });
    });

    it("POST Request", (done) => {
        chai.request('http://localhost:3000')
            .post('/api/12345')
            .set('test-header', "my-header")
            .send({ param2: "4321" })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.param1).to.be.equal("12345");
                expect(res.body.param2).to.be.equal("4321");
                done();
            });
    });

    it("PUT Request", (done) => {
        chai.request('http://localhost:3000')
            .put('/api/12345')
            .set('test-header', "my-header")
            .send({ param2: "4321" })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.param1).to.be.equal("12345");
                expect(res.body.param2).to.be.equal("4321");
                done();
            });
    });

    it("DELETE Request", (done) => {
        request({
            method: 'delete',
            url: 'http://localhost:3000/api/12345',
            headers: {
                "content-type": "application/json",
            },
            json: true
        }, function (error, response, body) {
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body.param1).to.be.equal("12345");
            done();
        });
    });

    it("GET Decorated Request", (done) => {
        chai.request('http://localhost:3000')
            .get('/api/decorated/12345')
            .set('test-header', "my-header")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.param1).to.be.equal("12345");
                done();
            });
    });

    it("POST Decorated Request", (done) => {
        chai.request('http://localhost:3000')
            .post('/api/decorated/12345')
            .set('test-header', "my-header")
            .send({ param2: "4321" })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.param1).to.be.equal("12345");
                expect(res.body.param2).to.be.equal("4321");
                done();
            });
    });

    it("PUT Decorated Request", (done) => {
        chai.request('http://localhost:3000')
            .put('/api/decorated/12345')
            .set('test-header', "my-header")
            .send({ param2: "4321" })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.param1).to.be.equal("12345");
                expect(res.body.param2).to.be.equal("4321");
                done();
            });
    });

    it("DELETE Decorated Request", (done) => {
        request({
            method: 'delete',
            url: 'http://localhost:3000/api/decorated/12345',
            headers: {
                "content-type": "application/json",
            },
            json: true
        }, function (error, response, body) {
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body.param1).to.be.equal("12345");
            done();
        });
    });

    it("Multiple Async Calls (Fail)", async () => {
        const requests = [];
        for(let i=0;i<100;i++){
            requests.push(requestHelper("async", i));
        }

        const matches = await Promise.all(requests);

        expect(matches.some(match => match === false)).to.be.true;

        return true;
    }).timeout(5000);

    it("Multiple Synced Calls", async () => {
        const requests = [];
        for(let i=0;i<100;i++){
            requests.push(requestHelper("synced", i));
        }

        const matches = await Promise.all(requests);

        expect(matches.some(match => match === false)).to.be.false;

        return true;
    }).timeout(15000);

    it("Multiple Synced Calls with Exceptions", async () => {
        const requests = [];
        for(let i=0;i<100;i++){
            requests.push(requestHelperResponseCode("synced-exception", i));
        }

        const matches = await Promise.all(requests);

        expect(matches[5]).to.equal(500);
        expect(matches[10]).to.equal(null);

        return true;
    }).timeout(15000);

});

const requestHelperResponseCode = (path, index) => {
    return new Promise((resolve) => {
        request({
            method: 'post',
            url: 'http://localhost:3000/api/'+path+'/' + index,
            headers: {
                "content-type": "application/json",
            },
            json: true
        }, function (error, response, body) {
            if (error)
                return resolve(null);

            resolve(response.statusCode);
        });
    })
}

const requestHelper = (path, index) => {
    return new Promise((resolve) => {
        request({
            method: 'post',
            url: 'http://localhost:3000/api/'+path+'/' + index,
            headers: {
                "content-type": "application/json",
            },
            json: true
        }, function (error, response, body) {
            if (response.statusCode == 200)
                resolve(response.body.match);
            else
                resolve(null);
        });
    })
}
