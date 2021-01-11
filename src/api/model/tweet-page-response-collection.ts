import { ApiReponseCollection } from "../common/api-response-collection.model";

export interface TweetPageResponseCollection extends ApiReponseCollection {
    nextPageToken: string
}