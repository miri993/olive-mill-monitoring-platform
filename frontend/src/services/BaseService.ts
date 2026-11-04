import axios from 'axios'

// Classe base per tutti i service: gestisco le chiamate HTTP al back end con axios.
// In sviluppo il proxy di Vite gira /api al back end su localhost:8080.
export abstract class BaseService {
  protected readonly http = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
  })

  protected async get<TResult>(url: string): Promise<TResult> {
    const response = await this.http.get<TResult>(url)
    return response.data
  }

  protected async post<TBody, TResult>(url: string, body?: TBody): Promise<TResult> {
    const response = await this.http.post<TResult>(url, body)
    return response.data
  }

  protected async put<TBody, TResult>(url: string, body: TBody): Promise<TResult> {
    const response = await this.http.put<TResult>(url, body)
    return response.data
  }
}
