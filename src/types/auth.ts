export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    isAdmin?: boolean;
    profileImage?: string;
    profile?: {
      description?: string;
      profile_picture?: string;
      social_links?: {
        instagram?: string;
        youtube?: string;
        website?: string;
      }
    }
  };
  access?: string;
  refresh?: string;
}