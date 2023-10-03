import API from "./api";
import {
  IGetQuery,
  IGetResponse,
  IGetSite,
  IGetTopic,
  ISitesAPI,
} from "./types";

export default class SitesAPI extends API implements ISitesAPI {
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
    const { data } = await this.instance.get<IGetSite[]>(`/sites/`);

    return data;
  }

  async getTopic(id: string): Promise<IGetTopic> {
    const { data } = await this.instance.get<IGetTopic>(`/topic/${id}`);
    return data;
  }
}
