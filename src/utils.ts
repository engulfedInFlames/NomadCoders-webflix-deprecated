/*
1. TheMovieDB Image 가지고 오기
이미지 파일명 앞에 https://image.tmdb.org/t/p/original/ 붙이기
*/
export const getMovieImg = (id: string, format?: string) => {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
};
