export interface ApiResponse<Data> {
  status: number;
  message: Data;
}

export interface RSVPRequest {
  attending: boolean;
  form: {
    age: number;
    waiverAgreed: boolean;
  };
}

export interface RSVPResponse {
  status: number;
  message: string;
}

export async function fetchHt6<T, P = undefined>(
  path: string,
  options: { body?: P; method?: string } = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["X-Access-Token"] = token;
  }

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const baseUrl = import.meta.env.VITE_API_URL || "https://api.hackthe6ix.com";
  const response = await fetch(`${baseUrl}${path}`, fetchOptions);

  if (!response.ok) {
    throw await response.json();
  }
  return response.json();
}

export async function updateRSVP(data: {
  rsvp: RSVPRequest;
}): Promise<RSVPResponse> {
  return fetchHt6<RSVPResponse, { rsvp: RSVPRequest }>("/api/action/rsvp", {
    method: "POST",
    body: data
  });
}
