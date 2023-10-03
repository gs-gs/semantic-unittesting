import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export default abstract class API {
  protected readonly instance: AxiosInstance;

  constructor(baseURL?: string, config: AxiosRequestConfig = {}) {
    this.instance = axios.create({
      ...config,
      baseURL,
      headers: {
        Accept: "application/json",
        ...config.headers,
      },
    });

    this.instance.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[API]: ${response.config.method} ${response.config.url}`,
            response.data
          );
        }
        return response;
      },
      (error) => Promise.reject(error)
    );
  }
}
