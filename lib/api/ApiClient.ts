import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { apiConfig } from "./config";

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create(apiConfig);
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  async get<Response>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response>> {
    return this.axiosInstance.get<Response>(url, config);
  }

  async post<Request, Response>(
    url: string,
    data: Request,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response>> {
    return this.axiosInstance.post<Response>(url, data, config);
  }
}

export default ApiClient.getInstance();
