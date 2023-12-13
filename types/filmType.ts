export type FilmType = {
  film: {
    id: number;
    name: string;
    description: string;
    posterUrl: string;
    genres: string[];
    reviews?: number[];
  };
};
