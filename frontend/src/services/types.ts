export type Expectation = {
  id: string;
  value: string;
};

export type Assessment = {
  id: string;
  value: string;
  prompt: string;
  expectation: Expectation;
  response: Response;
};

export type Query = {
  id: string;
  value: string;
  topic: Omit<Topic, "query_set">;
  response_set: Response[];
};

export type Response = {
  id: string;
  value: string;
  timestamp: string;
  assessment_set: Assessment[];
  query: Omit<Query, "response_set">;
};

export type Site = {
  id: string;
  title: string;
  url: string;
  topic_set: Topic[];
};

export type Topic = {
  id: string;
  title: string;
  query_set: Query[];
  site: Omit<Site, "topic_set">;
};

export type IGetQuery = Query;
export type IGetResponse = Response;
export type IGetSite = Site;
export type IGetTopic = Topic;

export interface ISitesAPI {
  getQuery(id: string): Promise<IGetQuery>;
  getResponse(id: string): Promise<IGetResponse>;
  getSite(id: string): Promise<IGetSite>;
  getSites(): Promise<IGetSite[]>;
  getTopic(id: string): Promise<IGetTopic>;
  // newConversation(prompt: string, type?: ConversationType): Promise<IGetConversation>;
}
