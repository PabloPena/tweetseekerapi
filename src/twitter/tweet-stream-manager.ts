import { SocketUtil } from "../util/socket.util";
import { Tweet } from "../api/model/tweet.model";
import config from "../config/config";
import { NotificationAction } from "../api/notification/notification-action.enum";
import TweetRepository from "../respositories/tweet.repository";
import * as request from 'request';

export class TweetStreamManager {

    static connectToStream(broadcastId: string): Promise<request.Request> {
        return new Promise<request.Request>((resolve, reject) => {
            TweetRepository.getFilteredStream().then((stream: request.Request) => {
                // Return stream after all
                resolve(stream);

                // Manage stream events

                // Data event
                stream.on('data', (data: any) => {
                    try {
                        // Tweet reveived
                        console.log("Data received:")
                        console.log(data);
                        const jsonData = JSON.parse(data);
                        SocketUtil.notify(broadcastId, {
                            action: jsonData?.data ? NotificationAction.TWEET_RECEIVED : NotificationAction.UNEXPECTED_ERRORS,
                            data: jsonData?.data ? Tweet.adaptApiEntity(jsonData.data, null, jsonData.includes) : jsonData
                        })
                    } catch (e) {
                        console.log("Data not read", e);
                        // Keep alive. Do nothing.
                    }
                }).on('error', (error: any) => {
                    if (error.code === 'ETIMEDOUT') {
                        stream.emit('timeout');
                    }
                });

                // Timeout event
                // We will enable a retrying mechanism with exponential backoff logic is applied.
                let attempts = 0;
                let timeout = 0;
                stream.on('timeout', () => {
                    // Reconnect on timeout error
                    setTimeout(() => {
                        attempts++;
                        timeout++;
                        if (attempts < config.twitterApi.numAttempts) TweetStreamManager.connectToStream(broadcastId);
                    }, 2 ** timeout);
                })
            }).catch(err => {
                reject(err);
            })
        });
    }
}