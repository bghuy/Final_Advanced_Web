export type LoginResponse = {
    id: string,
    username: string,
    email: string,
    created_at?: string | Date,
    updated_at?: string | Date,
    access_token: string
  };