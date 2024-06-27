export interface JwtSignature {
  issuer: string;
  subject: string;
  audience: string;
};

export interface UserProfiles {
  id: string;
  user_id?: string;
  avatar?: string;
  profile_type?: string;
  profile_interests?: Array<string>;
  promoter_type?: string;
  profile_country_code?: string;
  profile_phone_number?: string;
  status?: string;
};

export interface SignedData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  profile_types_created?: Array<string>,
  user_profiles?: Array<UserProfiles>;
  is_activated?: boolean;
  user_type?: string;
};

export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  avatar?: string;
  profile_types_created?: Array<string>;
  is_activated?: boolean;
  user_type?: string;
};

export interface File {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  buffer?: Buffer;
  size?: number;
};
