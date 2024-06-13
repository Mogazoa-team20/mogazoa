export default class HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async sendRequest<T, U>(path: string, method: string, body?: U, options: RequestInit = {}): Promise<T> {
    const hasContentType = options?.headers && "Content-Type" in options.headers;
    const headers = hasContentType ? options.headers : { "Content-Type": "application/json", ...options.headers };
    try {
      const requestOptions: RequestInit = {
        method,
        headers,
        ...options,
      };
      if (body) {
        requestOptions.body = JSON.stringify(body);
      }
      const response = await fetch(`${this.baseUrl}/${path}`, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(`fetch data error, ${error}`);
      throw error;
    }
  }

  async get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.sendRequest<T, never>(path, "GET", undefined, options);
  }

  async post<T, U>(path: string, options: RequestInit = {}, body?: U): Promise<T> {
    return this.sendRequest<T, U>(path, "POST", body, options);
  }

  async put<T, U>(path: string, options: RequestInit = {}, body?: U): Promise<T> {
    return this.sendRequest<T, U>(path, "PUT", body, options);
  }

  async delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.sendRequest<T, never>(path, "DELETE", undefined, options);
  }
}
