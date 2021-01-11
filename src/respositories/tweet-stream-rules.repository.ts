import TwitterRequest from '../util/twitter-request';
import config from '../config/config';

class TweetStreamRulesRepository {

  static getAllRules(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
        const options = {
            url: `${config.twitterApi.endpoint}/${config.twitterApi.version}/tweets/search/stream/rules`,
            json: true,
            strictSSL: false
        };
        TwitterRequest.get(options, function (err: any, res: any, body: any) {
            if (err) {
                reject(err)
            } else {
                resolve(res.body)
            }
        })
    });
}

static deleteAllRules(rules: any): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
        if (!Array.isArray(rules)) {
            return null;
        }

        const ids = rules.map((rule: any) => rule.id);

        const options = {
            url: `${config.twitterApi.endpoint}/${config.twitterApi.version}/tweets/search/stream/rules`,
            body: {
                delete: {
                    ids: ids
                }
            },
            json: true,
            strictSSL: false
        };

        TwitterRequest.post(options, function (err: any, res: any, body: any) {
            if (err) {
                reject(err)
            } else {
                resolve(res.body)
            }
        })
    });
}

static setRules(rules: any): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {

        const options = {
            url: `${config.twitterApi.endpoint}/${config.twitterApi.version}/tweets/search/stream/rules`,
            body: {
                add: rules
            },
            json: true,
            strictSSL: false
        };

        TwitterRequest.post(options, function (err: any, res: any, body: any) {
            if (err) {
                reject(err)
            } else {
                resolve(res.body)
            }
        })
    });
}

}

export default TweetStreamRulesRepository;
