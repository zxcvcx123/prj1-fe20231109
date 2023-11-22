import { Button, Flex, Spacer, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "../component/LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
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
    <Flex justifyContent={"center"}>
      <Button
        variant={"ghost"}
        size={"lg"}
        leftIcon={<FontAwesomeIcon icon={faHouse} />}
        onClick={() => navigate("/")}
      >
        메인
      </Button>

      {isAuthenticated() && (
        <Button
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
          onClick={() => navigate("/write")}
        >
          글 쓰기
        </Button>
      )}
      {isAuthenticated() || (
        <Button
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
          onClick={() => navigate("/signup")}
        >
          가입하기
        </Button>
      )}
      {isAdmin() && (
        <Button
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faList} />}
          onClick={() => navigate("/member/list")}
        >
          회원목록
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faCircleUser} />}
          onClick={() => navigate("/member?" + urlParams.toString())}
        >
          내 정보
        </Button>
      )}
      <Spacer />
      {isAuthenticated() || (
        <Button
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faUpRightFromSquare} />}
          onClick={() => navigate("/login")}
        >
          로그인
        </Button>
      )}

      {isAuthenticated() && (
        <Button
          variant={"ghost"}
          size={"lg"}
          leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      )}
    </Flex>
  );
}
