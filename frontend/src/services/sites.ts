import API from "./api";
import {
  ICreateExpectation,
  ICreateQuery,
  ICreateSite,
  ICreateTopic,
  IGetExpectation,
  IGetJob,
  IGetQuery,
  IGetResponse,
  IGetSite,
  IGetTopic,
  ISitesAPI,
} from "./types";

export default class SitesAPI extends API implements ISitesAPI {
  async getJob(id: string): Promise<IGetJob> {
    const { data } = await this.instance.get<IGetJob>(`/job/${id}`);
    return data;
  }

  async getQuery(id: string): Promise<IGetQuery> {
    const { data } = await this.instance.get<IGetQuery>(`/query/${id}`);
    return data;
  }

  async getResponse(id: string): Promise<IGetResponse> {
    const { data } = await this.instance.get<IGetResponse>(`/response/${id}`);
    return data;
  }

  async getSite(id: string): Promise<IGetSite> {
    const { data } = await this.instance.get<IGetSite>(`/site/${id}`);
    return data;
  }

  async getSites(): Promise<IGetSite[]> {
    const { data } = await this.instance.get<IGetSite[]>(`/site/`);

    return data;
  }

  async getTopic(id: string): Promise<IGetTopic> {
    const { data } = await this.instance.get<IGetTopic>(`/topic/${id}`);
    return data;
  }

  async newSite(data: ICreateSite): Promise<IGetSite> {
    const { data: site } = await this.instance.post<IGetSite>("/site/", data);

    return site;
  }

  async newTopic(data: ICreateTopic): Promise<IGetTopic> {
    const { data: topic } = await this.instance.post<IGetTopic>(
      "/topic/",
      data
    );

    return topic;
  }

  async newQuery(data: ICreateQuery): Promise<IGetQuery> {
    const { data: query } = await this.instance.post<IGetQuery>(
      "/query/",
      data
    );

    return query;
  }

  async newExpectation(data: ICreateExpectation): Promise<IGetExpectation> {
    const { data: query } = await this.instance.post<IGetExpectation>(
      "/expectation/",
      data
    );

    return query;
  }

  async evaluateSite(id: string): Promise<IGetJob> {
    const { data } = await this.instance.get<IGetJob>(`/evaluate-site/${id}`);
    return data;
  }
}
