export interface JwtSignature {
  issuer: string;
  subject: string;
  audience: string;
};


export interface SignedData {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  username?: string;
};

export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
};
