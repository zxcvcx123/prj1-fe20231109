import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  let navigate = useNavigate();

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>메인</Button>
      <Button onClick={() => navigate("/write")}>글 쓰기</Button>
      <Button onClick={() => navigate("/signup")}>가입하기</Button>
      <Button onClick={() => navigate("/member/list")}>회원목록</Button>
    </Flex>
  );
}
