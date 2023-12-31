import { UserFilmType } from "@/types/userFilmType";

export type UserType = {
  email: string;
  passwordHash: string;
  id: number;
  name: string | null;
  description: string | null;
  avatarUrl: string | null;
  films: UserFilmType[];
  genres: [];
};
