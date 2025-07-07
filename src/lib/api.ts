class FetchError extends Error {
  info: unknown;
  status: number;

  constructor(message: string, status: number, info: unknown) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    let info;
    try {
      info = await res.json();
    } catch {
      info = { message: res.statusText };
    }
    throw new FetchError(
      'An error occurred while fetching the data.',
      res.status,
      info
    );
  }

  // For 204 No Content responses, return an empty object as the response
  // This handles DELETE operations that don't return any content
  if (res.status === 204) {
    return {} as T;
  }

  // For all other successful responses, parse JSON
  return res.json();
}
