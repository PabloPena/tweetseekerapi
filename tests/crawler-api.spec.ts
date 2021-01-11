import { expect } from 'chai';
import * as request from 'request';

describe("CrawlerApi", function () {
    it("returns new crawler object", function () {
        const url = "http://localhost:3000/api/v2/crawl";
        const jsonBody = {
            url: 'https://elpais.com',
            broadcastId: 'TEST'
        }
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonBody,
            json:true
        }
        request.post(url, options, function (error: any, response: any, body: any) {
            expect(response.statusCode).to.equal(200);
        });
    });
    
    it("returns invalid input", function () {
        const url = "http://localhost:3000/api/v2/crawl";
        const jsonBody = {
            url: 'elpais.com',
            broadcastId: 'TEST'
        }
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonBody,
            json: true
        }
        request.post(url, options, function (error: any, response: any, body: any) {
            expect(response.statusCode).to.equal(405);
        });
    });
});