export type UserType = {
  id: number;
  name: string | null;
  description: string | null;
  avatarUrl: string | null;
  films: [];
  genres: [];
  passwordHash: string;
};
