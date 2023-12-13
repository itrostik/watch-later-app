export type FilmType = {
  id: number;
  name: string;
  description: string;
  year: string;
  posterUrl: string;
  genres: string[];
  reviews?: number[];
};
