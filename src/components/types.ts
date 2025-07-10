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
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: {
    hacker: boolean;
    admin: boolean;
    organizer: boolean;
    volunteer: boolean;
  }
  status: {
    accepted: boolean;
    textStatus: string;
    rejected: boolean;
    declined: boolean;
    confirmed: boolean;
    applied: boolean;
    applicationExpired: boolean;
    canRSVP: boolean;
    waitlisted: boolean;
    checkedIn: boolean;
  };
}

export interface PassUserInformation {
  userId: string;
  userType: string;
  userName: string;
}
