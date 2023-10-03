import SitesAPI from "./sites";
import { ISitesAPI } from "./types";

export const sitesAPI: ISitesAPI = new SitesAPI(
  process.env.NEXT_PUBLIC_API_ENDPOINT
);
