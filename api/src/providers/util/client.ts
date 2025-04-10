import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
  Method,
} from 'axios';

export abstract class Client {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger(Client.name);

  constructor(
    private readonly baseUrl: string,
    private readonly apiName?: string,
    private readonly axiosConfig?: CreateAxiosDefaults,
  ) {
    this.axiosInstance = axios.create({ ...axiosConfig, baseURL: baseUrl });

    this.axiosInstance.interceptors.request.use((req) => {
      this.logger.debug(
        `${this.getApiName()} [${req.method}]{${req.url}} request: ${JSON.stringify(req.data) ?? 'empty'}${req.params ? `, params: ${JSON.stringify(req.params)}` : ''}`,
      );
      return req;
    });
    this.axiosInstance.interceptors.response.use((resp) => {
      this.logger.debug(
        `${this.getApiName()} {${resp.config.url}} response: ${resp.status}`,
      );
      return resp;
    });
  }

  public async get<T, D>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return await this.makeRequest('GET', url, null, config);
  }

  public async post<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return await this.makeRequest('POST', url, data, config);
  }

  public async put<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return await this.makeRequest('PUT', url, data, config);
  }

  public async delete<T, D>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return await this.makeRequest('DELETE', url, null, config);
  }

  public async makeRequest<T, D>(
    method: Method,
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url: `${this.baseUrl}${url}`,
        data,
        ...config,
      });

      return response.data;
    } catch (error: unknown) {
      console.log({ error });
      if (error instanceof AxiosError) {
        throw new HttpException(
          `Failed ${method} request to '${this.getApiName()}': ${this.getErrorMessage(error)}`,
          error.response?.status ?? HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        `Failed ${method} request to '${this.getApiName()}': ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getApiName(): string {
    return this.apiName ?? this.baseUrl;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error';
  }
}
