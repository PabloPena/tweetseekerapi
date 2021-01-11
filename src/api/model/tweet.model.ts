// Tweet Model Class Definition
export class Tweet {
  
  constructor (
      public date: string,
      public username: string,
      public text: string,
      public likes: number,
      public replies: number,
      public quotes: number,
      public retweets: number,
      public isReply: boolean,
      public isRetweet: boolean
    ) {
  }

  static adaptApiEntity(apiEntity: any, username?: string, inclusions?: any): Tweet {
    if (!apiEntity) return null;
    return {
      date: apiEntity.created_at,
      username: username || (inclusions?.users?.find((user: any) => user?.id === apiEntity.author_id))?.username,
      text: apiEntity.text,
      likes: apiEntity.public_metrics?.like_count,
      replies: apiEntity.public_metrics?.reply_count,
      quotes: apiEntity.public_metrics?.quote_count,
      retweets: apiEntity.public_metrics?.retweet_count,
      isReply: apiEntity.referenced_tweets?.length ? apiEntity.referenced_tweets[0].type === 'replied_to' : false,
      isRetweet: apiEntity.referenced_tweets?.length ? apiEntity.referenced_tweets[0].type === 'retweeted' : false
    }
  }

  static adaptAllApiEntities(apiEntities: any[], username?: string, inclusions?: any): Tweet[]{
    if (apiEntities && apiEntities.length > 0) {
      return apiEntities.map(entity => this.adaptApiEntity(entity, username, inclusions));
    } 
    return [];
  }

}
