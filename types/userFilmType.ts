export type UserFilmType = {
  film: {
    year: string;
    id: number;
    name: string;
    description: string;
    posterUrl: string;
    genres: string[];
    reviews?: number[];
  };
  watched: boolean;
  review: number | null;
};
