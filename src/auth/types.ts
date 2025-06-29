export interface LoginPayload {
  redirectTo: string;
  callbackURL: string;
}

export interface CallbackPayload {
  code: string;
  state: string;
}

export interface AuthResponse {
  status: number;
  message: {
    url?: string;
    token?: string;
    refreshToken?: string;
    redirectTo?: string;
  };
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  status: {
    accepted: boolean;
    rejected: boolean;
    declined: boolean;
    confirmed: boolean;
    applied: boolean;
    applicationExpired: boolean;
    canRSVP: boolean;
    waitlisted: boolean;
  };
}
