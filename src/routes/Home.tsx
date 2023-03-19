import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getNowPlaying, INowPlayingMovies } from "../api";
import { getMovieImg } from "../utils";

const Wrapper = styled.div`
  background-color: "rgba(0,0,0,1)";
`;

const Loader = styled.div`
  font-size: 32px;
  font-weight: black;
  display: grid;
  place-content: center;
`;

const Banner = styled.div<{ bgImg: string }>`
  user-select: none;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 300;
  background-image: linear-gradient(rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1)),
    url(${({ bgImg }) => bgImg});
  background-color: ${({ bgImg }) => (bgImg ? undefined : "black")};
  background-size: cover;
  padding-left: 40px;
`;

const Title = styled.h3`
  white-space: nowrap;
  font-size: 40px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  width: 50%;
  min-width: 525px;
  font-size: 18px;
  letter-spacing: 0.5px;
  line-height: 1.2;
`;

const SliderContainer = styled(motion.div)`
  position: relative; // position 값을 지정해줘야 자연스러운 슬라이더가 되는 것에 주목
  display: grid;
  grid-auto-flow: row;
`;

const Slider = styled(motion.div)`
  position: absolute; // position 값을 지정해줘야 자연스러운 슬라이더가 되는 것에 주목
  top: -100px;
  left: 0;
  right: 0;
  width: 95%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  background-color: rgba(0, 0, 0, 0);
  margin: 0 auto;
`;

const SliderBtns = styled(motion.div)`
  position: absolute;
  top: -100px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// MovieItem의 Height에 따라 동적으로 움직이게 할 수 있을까?
const SliderBtn = styled(motion.div)`
  width: 32px;
  height: 132px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 32px;
  background-color: rgba(0, 0, 0, 0);
  padding: 8px;
  &:last-child {
    justify-content: flex-end;
  }
`;

const Movie = styled(motion.div)`
  user-select: none;
  cursor: pointer;
  min-width: 200px;
  border-radius: 1%;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const MovieThumb = styled(motion.img)`
  width: 100%;
  object-fit: cover;
`;

const MovieInfo = styled(motion.div)`
  width: 100%;
  background-color: #181818;
  padding: 8px 4px;
  opacity: 1;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
`;

const MovieDetail = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 70vw;
  height: 90vh;
  background-color: ${({ theme }) => theme.darkColor.lighter};
  border-radius: 1%;
  margin: 0 auto;
  margin-top: 32px;
  opacity: 0;
`;

const MovieDetailImg = styled(motion.div)<{ image: string }>`
  width: 100%;
  height: 80%;
  background-image: linear-gradient(
      rgba(24, 24, 24, 0),
      rgba(24, 24, 24, 0.3),
      rgba(24, 24, 24, 0.6),
      rgba(24, 24, 24, 1)
    ),
    url(${({ image }) => image});
  background-size: cover;
  background-position: center;
`;

const MovieDetailTitle = styled(motion.h3)`
  position: absolute;
  bottom: 240px;
  left: 20px;
  width: 60%;
  font-size: 48px;
  font-weight: 300;
`;

const MovieDetailOverview = styled(motion.p)`
  width: 60%;
  letter-spacing: 0.5px;
  line-height: 1.1;
  margin: 32px 0 0 20px;
`;

const sliderVars: Variants = {
  invisible: (isRightBtn: boolean) => ({
    x: isRightBtn ? -window.innerWidth + 8 : window.innerWidth - 8,
  }),
  appear: { x: 0 },
  disappear: (isRightBtn: boolean) => ({
    x: isRightBtn ? window.innerWidth - 8 : -window.innerWidth + 8,
  }),
};

const sliderBtnVars: Variants = {
  mouseHover: {
    scale: 1.25,
    backgroundColor: "rgba(0,0,0,0.2)",
    transition: {
      type: "linear",
      duration: 0.05,
    },
  },
  mouseLeave: {
    scale: 1,
    backgroundColor: "rgba(0,0,0,0)",
    transition: {
      type: "linear",
      duration: 0.05,
    },
  },
};

const movieVars: Variants = {
  mouseHover: {
    y: -100,
    scale: 1.5,
    transition: {
      type: "linear",
      duration: 0.175,
      delay: 0.4,
    },
  },
  mouseLeave: {
    y: 0,
    scale: 1,
    transition: {
      type: "linear",
    },
  },
};

const movieInfoVars: Variants = {
  mouseHover: {
    y: -1,
    opacity: 1,
    transition: {
      type: "linear",
      duration: 0.175,
      delay: 0.4,
    },
  }, // 부모의 animation을 상속, key 값만 같게 해주면 자동으로 extends.
  mouseLeave: {
    opacity: 0,
  },
};

// 1. 슬라이더를 연속으로 넘길 때 생기는 에러 고치기 ✅
// 2. 처음 컴포넌트가 mount 됐을 때는, 슬라이더의 initial animation이 실행되지 않게 하기 ✅
// 3. 영화 개수에 맞춰서 슬라이더 올바르게 작동하게 하기 ✅
// 4. Item에 hover 이벤트시 확대되도록 하기 ✅
// 5. MovieDetail 고치기

function Home() {
  const { isLoading, data: movies } = useQuery<INowPlayingMovies>(
    ["movies", "nowPlaying"],
    getNowPlaying
  );

  // Slider Item 애니메이션
  const PAGE_OFFSET = 5;
  const [page, setPage] = useState(1);
  const [sliderAnimationExit, setSliderAnimationExit] = useState(true);
  const toggleSliderAnimationExit = () => {
    setSliderAnimationExit((prev) => !prev);
  };

  // Slider 애니메이션
  const [isRightBtn, setIsRightBtn] = useState(true);
  const moveSliderLeft = () => {
    if (movies) {
      if (!sliderAnimationExit) return;
      console.log("Clicked!");
      setIsRightBtn(true);
      setSliderAnimationExit(false);
      const pageLength = Math.floor((movies.results.length - 1) / 5);
      setPage((_page) => (_page > 0 && _page < pageLength ? _page + 1 : 1));
    }
  };
  const moveSliderRight = () => {
    if (movies) {
      if (!sliderAnimationExit) return;
      console.log("Clicked!");
      setIsRightBtn(false);
      setSliderAnimationExit(false);
      const pageLength = Math.floor((movies.results.length - 1) / 5); // 첫 번째 영화는 배너로 사용하므로
      setPage((_page) =>
        _page > 1 && _page <= pageLength ? _page - 1 : pageLength
      );
    }
  };

  // Overlay
  const navigate = useNavigate();
  const movieIdMatch = useMatch("/movies/:movieId");
  const clickedMovie =
    movieIdMatch &&
    movies?.results.find(
      (movie) => String(movie.id) === movieIdMatch.params.movieId
    );
  const onMovieClick = (_movieId: string) => {
    navigate(`/movies/${_movieId}`);
  };
  const onOverlayClick = () => {
    navigate("/");
  };

  // ❌
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setSliderLoaded(true);
  //   }, 50);
  //   return () => clearTimeout(timer);
  // }, []);
  // ✅
  // 처음 컴포넌트가 mount 됐을 때, 슬라이더의 initial animation이 실행되지 않게 하고 싶다면,  AnimatePresence의 initial prop을 이용하자.
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgImg={getMovieImg(movies?.results[0].backdrop_path || "")}>
            <Title>{movies?.results[0].title}</Title>
            <Overview>{movies?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <SliderBtns>
              <SliderBtn
                variants={sliderBtnVars}
                whileHover="mouseHover"
                animate="mouseLeave"
                onClick={moveSliderLeft}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </SliderBtn>
              <SliderBtn
                variants={sliderBtnVars}
                whileHover="mouseHover"
                animate="mouseLeave"
                onClick={moveSliderRight}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </SliderBtn>
            </SliderBtns>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleSliderAnimationExit}
              custom={isRightBtn}
            >
              <Slider
                custom={isRightBtn}
                key={page}
                variants={sliderVars}
                initial="invisible"
                animate="appear"
                exit="disappear"
                transition={{ type: "tween", duration: 1 }}
              >
                {movies?.results
                  .slice(1)
                  .slice(
                    PAGE_OFFSET * (page - 1),
                    PAGE_OFFSET * (page - 1) + PAGE_OFFSET
                  )
                  .map((movie) => (
                    <Movie
                      key={movie.id}
                      layoutId={String(movie.id)}
                      onClick={() => onMovieClick(String(movie.id))}
                      variants={movieVars}
                      whileHover="mouseHover"
                      animate="mouseLeave"
                    >
                      <MovieThumb
                        src={`${getMovieImg(
                          movie.backdrop_path || movie.poster_path,
                          "w500"
                        )}`}
                      />
                      <MovieInfo variants={movieInfoVars}>
                        {movie.title}
                      </MovieInfo>
                    </Movie>
                  ))}
              </Slider>
              {movieIdMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <MovieDetail
                    layoutId={movieIdMatch.params.movieId}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MovieDetailImg
                      image={`${getMovieImg(
                        clickedMovie?.backdrop_path! ||
                          clickedMovie?.poster_path!
                      )}`}
                    ></MovieDetailImg>
                    <MovieDetailTitle>{clickedMovie?.title}</MovieDetailTitle>
                    <MovieDetailOverview>
                      {clickedMovie?.overview}
                    </MovieDetailOverview>
                  </MovieDetail>
                </>
              ) : null}
            </AnimatePresence>
          </SliderContainer>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
