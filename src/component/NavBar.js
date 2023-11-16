import { Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "../component/LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleUser,
  faHouse,
  faList,
  faRightFromBracket,
  faUpRightFromSquare,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

  function handleLogout() {
    axios
      .post("/api/member/logout")
      .then(() => console.log("로그아웃 성공"))
      .then(() => {
        toast({
          description: "로그아웃 되었습니다.",
          status: "info",
        });
        navigate("/");
      });
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHouse} />
        메인
      </Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>글 쓰기</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>
          <FontAwesomeIcon icon={faUserPlus} />
          가입하기
        </Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>
          <FontAwesomeIcon icon={faList} />
          회원목록
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member?" + urlParams.toString())}>
          <FontAwesomeIcon icon={faCircleUser} />
          회원 정보
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>
          <FontAwesomeIcon icon={faUpRightFromSquare} />
          로그인
        </Button>
      )}

      {isAuthenticated() && (
        <Button onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          로그아웃
        </Button>
      )}
    </Flex>
  );
}
