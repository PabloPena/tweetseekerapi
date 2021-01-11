// Tweet Filter Model Class Definition
export class TweetFilter {
  
  constructor (
      public username: string,
      public keywords: string[] = [],
      public hashtag: string,
      public excludeRetweets: boolean = false,
      public excludeReplies: boolean = false,
      public startDate?: string,
      public endDate?: string
    ) {
  }

}