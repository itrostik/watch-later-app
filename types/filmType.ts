export type FilmType = {
  id: number;
  name: string;
  description: string;
  posterUrl: string;
  genres: string[];
  reviews?: number[];
};
