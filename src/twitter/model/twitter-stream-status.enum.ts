// Request Status Enum Definition
export type TweetStreamStatus = -1 | 0 | 1;
export const TweetStreamStatus = {
    STARTED: 0 as TweetStreamStatus,
    STOPPED: -1 as TweetStreamStatus,
    FINISHED: 1 as TweetStreamStatus
}
