import { useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
  Variants,
} from "framer-motion";
import styled from "styled-components";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  user-select: none;
  position: fixed;
  top: 0;
  width: 100%;
  height: 75px;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0)
  );
  padding: 0 40px;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
  &:nth-child(1) > div {
    padding: 0 15px;
  }
  &:nth-child(2) > div {
    padding: 0 10px;
    justify-content: flex-end;
  }
`;
const Logo = styled(motion.svg)`
  // path도 motion.path로
  cursor: pointer;
  width: 140px;
  height: 40px;
  margin: 0 auto;
  margin-top: 10px;
  transform: scale(1);
  path {
    transform: scale(0.12);
  }
`;
const Tab = styled.div`
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  &.home-tab {
    margin-left: 10px;
  }
  &.nav-profile-tab {
    display: flex;
    align-items: center;
    & > i {
      margin: 0 5px;
      &:nth-child(1) {
        color: #0971e6;
        font-size: 32px;
      }
    }
  }
`;

const Dot = styled(motion.div)`
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;
  margin: 0 auto; // position: absolute인 요소를 가운데 정렬하고 싶을 때, top:0; left:0; margin: 0 auto;로 한다.
  background-color: ${({ theme }) => theme.mainColor};
  width: 5px;
  height: 5px;
  border-radius: 99%;
`;

const SearchForm = styled(motion.form)`
  cursor: unset;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    cursor: pointer;
    z-index: 99;
  }
`;

const SearchInput = styled(motion.input)`
  all: unset;
  position: absolute;
  right: 10px;
  border: 1.5px solid white;
  padding: 8px 4px 8px 32px;
`;

const logoVars: Variants = {
  initial: {
    fillOpacity: 1,
  },
  hover: {
    fillOpacity: [0, 1, 0], // 배열로도 값을 줄 수 있다.
    transition: {
      repeat: Infinity,
      duration: 1,
    },
  },
};

interface IForm {
  keyword: string;
}

function Header() {
  const homeMatch = useMatch("/");
  const seriesMatch = useMatch("/series");
  const trendingsMatch = useMatch("/trendings");
  const bookmarksMatch = useMatch("/bookmarks");
  const byLangsMatch = useMatch("/by-langs");
  const [searchClicked, setSearchClicked] = useState(false);
  const animationForSearchInput = useAnimation(); // 애니메이션을 속성 값으로 구현하지 않고, 코드로 구현하고 싶을 때 사용하는 훅이다.
  const animationForNav = useAnimation(); // 애니메이션을 속성 값으로 구현하지 않고, 코드로 구현하고 싶을 때 사용하는 훅이다.
  const onClickSearch = () => {
    setFocus("keyword");
    setSearchClicked((prev) => !prev);
    if (searchClicked) {
      animationForSearchInput.start({
        scaleX: 0,
        transformOrigin: "right",
        transition: {
          type: "linear",
        },
      });
    } else {
      animationForSearchInput.start({
        scaleX: 1,
        transformOrigin: "right",
        transition: {
          type: "linear",
        },
      });
    }
  };
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    // console.log(v); // 메소드가 있다!
    if (v > 90) {
      animationForNav.start({ backgroundColor: "rgba(16,16,16,1)" });
    } else {
      animationForNav.start({
        backgroundColor: "rgba(0,0,0,0)",
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75),rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.25),rgba(0, 0, 0, 0))",
      });
    }
  });

  // Search Form
  const navigate = useNavigate();
  const { register, handleSubmit, setFocus } = useForm<IForm>();
  const onValid = (data: IForm) => {
    console.log(data.keyword);
    navigate(`/search?keyword=${data.keyword}`);
  };
  return (
    <Nav animate={animationForNav}>
      <Col>
        <Link to="/">
          <Logo variants={logoVars} initial="initial" whileHover="hover">
            <motion.path
              xmlns="http://www.w3.org/2000/svg"
              d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
              fill="#d81f26" // 내부
              stroke="#d81f26" // 경계
            />
          </Logo>
        </Link>
        <Tab className="home-tab">
          <Link to="/">홈{homeMatch && <Dot layoutId="dot" />}</Link>
        </Tab>
        <Tab>
          <Link to="/series">
            시리즈
            {seriesMatch && <Dot layoutId="dot" />}
          </Link>
        </Tab>
        <Tab>
          <Link to="/trendings">
            대세 콘텐츠
            {trendingsMatch && <Dot layoutId="dot" />}
          </Link>
        </Tab>
        <Tab>
          <Link to="/bookmarks">
            찜한 콘텐츠
            {bookmarksMatch && <Dot layoutId="dot" />}
          </Link>
        </Tab>
        <Tab>
          <Link to="/by-langs">
            언어별로 찾아보기
            {byLangsMatch && <Dot layoutId="dot" />}
          </Link>
        </Tab>
      </Col>
      <Col>
        <SearchForm onSubmit={handleSubmit(onValid)}>
          <SearchInput
            {...register("keyword", { required: true, minLength: 2 })}
            initial={{ scaleX: 0 }}
            animate={animationForSearchInput}
            type="text"
            placeholder="titles, people, genres"
          />
          <motion.i
            animate={{
              x: searchClicked ? -240 : 0,
              transition: { type: "linear" },
            }}
            onClick={onClickSearch}
            className="fa-solid fa-magnifying-glass"
          ></motion.i>
        </SearchForm>
        <Tab>키즈</Tab>
        <Tab>
          <i className="fa-regular fa-bell"></i>
        </Tab>
        <Tab className="nav-profile-tab">
          <i className="fa-solid fa-face-grin-wide"></i>
          <i className="fa-solid fa-caret-down"></i>
        </Tab>
      </Col>
    </Nav>
  );
}

export default Header;
