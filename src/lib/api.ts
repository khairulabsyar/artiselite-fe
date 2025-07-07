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

  return res.json();
}
