import { TweetStreamStatus } from "./twitter-stream-status.enum";

// Crawler Request Model Class Definition
export class TweetStream {

  // The state by default
  public status: TweetStreamStatus = TweetStreamStatus.STARTED;
  public requested: Date;

  constructor(
    public stream: any
  ) {
    // Set requested to now on constructor
    this.requested = new Date();
  }

  updateStatus(status: TweetStreamStatus) {
    this.status = status;
  }

  finish() {
    // TODO Complete the stream
  }

}