import { expect } from 'chai';
import { CrawlerProcess } from '../src/crawler/crawler-process'

describe("CrawlerProcess", function () {
    it("returns list of urls", function () {
        const process = new CrawlerProcess('TEST','https://elpais.com');
        process.doWork().then(result => {
            expect(result && result.length > 0).to.equal(true);
        });
    });
});
