export type Expectation = {
  id: string;
  value: string;
};

export type Job = {
  id: string;
  started_on: string;
  finished_on: string;
  site: Omit<Site, "topics">;
  responses: Response[];
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
  topic: Omit<Topic, "queries">;
  job: Job;
  responses: Response[];
  expectations: Expectation[];
};

export type Response = {
  id: string;
  value: string;
  timestamp: string;
  assessments: Assessment[];
  query: Omit<Query, "responses">;
};

export type Site = {
  id: string;
  title: string;
  url: string;
  topics: Topic[];
};

export type Topic = {
  id: string;
  title: string;
  queries: Query[];
  site: Omit<Site, "topics">;
};

export type IGetExpectation = Expectation;
export type IGetQuery = Query;
export type IGetResponse = Response;
export type IGetSite = Site;
export type IGetTopic = Topic;

export type ICreateExpectation = Omit<Expectation, "id"> & {
  query_id: string;
};
export type ICreateSite = Omit<Site, "id" | "topics">;
export type ICreateTopic = Omit<Topic, "id" | "queries" | "site"> & {
  site_id: string;
};
export type ICreateQuery = Omit<
  Query,
  "id" | "responses" | "expectations" | "topic"
> & {
  topic_id: string;
};

export interface ISitesAPI {
  getQuery(id: string): Promise<IGetQuery>;
  getResponse(id: string): Promise<IGetResponse>;
  getSite(id: string): Promise<IGetSite>;
  getSites(): Promise<IGetSite[]>;
  getTopic(id: string): Promise<IGetTopic>;
  newSite(data: ICreateSite): Promise<IGetSite>;
  newTopic(data: ICreateTopic): Promise<IGetTopic>;
  newQuery(data: ICreateQuery): Promise<IGetQuery>;
  newExpectation(data: ICreateExpectation): Promise<IGetExpectation>;
}
