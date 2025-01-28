type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequesterOptions = {
  baseUrl?: string; // Base URL for all requests
  defaultHeaders?: Record<string, string>; // Default headers for all requests
};

type RequestOptions = {
  method?: HttpMethod; // HTTP method (default: 'GET')
  headers?: Record<string, string>; // Custom headers for this request
  body?: unknown; // Request body (for POST, PUT, PATCH)
  query?: Record<string, string | number>; // Query parameters
};

export type Requester = <T>(url: string, params: RequestOptions) => Promise<T>;

/**
 * Creates a requester function with default options.
 * @param options - Configuration options for the requester.
 * @returns A function to make HTTP requests.
 */
export function makeRequester(options: RequesterOptions = {}) {
  const { baseUrl = "", defaultHeaders = {} } = options;

  /**
   * Makes an HTTP request.
   * @param endpoint - The API endpoint (e.g., '/users').
   * @param requestOptions - Options for this specific request.
   * @returns The response data.
   */
  return async function requester<T>(
    endpoint: string,
    requestOptions: RequestOptions = {}
  ): Promise<T> {
    const { method = "GET", headers = {}, body, query = {} } = requestOptions;

    // Construct the full URL with query parameters
    const url = new URL(endpoint, baseUrl);

    // Add query parameters to the URL
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    // Merge default headers with request-specific headers
    const combinedHeaders = {
      ...defaultHeaders,
      ...headers,
    };

    // Make the request using Bun's fetch API
    const response = await fetch(url.toString(), {
      method,
      headers: combinedHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Request failed with status ${response.status}: ${
          errorData?.message || "Unknown error"
        }`
      );
    }

    // Parse and return the response data
    return response.json() as T;
  };
}
