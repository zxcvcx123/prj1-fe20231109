import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  position,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // 유효성 검사
  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  const toast = useToast();

  let submitAvailable = true;

  if (!emailAvailable) {
    submitAvailable = false;
  }

  if (!idAvailable) {
    submitAvailable = false;
  }

  if (password != passwordCheck) {
    submitAvailable = false;
  }

  if (password.length === 0) {
    submitAvailable = false;
  }

  // 가입하기
  function handleSubmit() {
    axios
      .post("/api/member/signup", { id, password, email })
      .then(() => {
        toast({
          position: "top",
          description: "회원가입이 완료되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((e) => {
        if (e.response.status === 400) {
          toast({
            position: "top",
            description: "입력 값을 확인해주세요.",
            status: "warning",
          });
        } else {
          toast({
            position: "top",
            description: "가입 중 오류 발생!!!",
            status: "error",
          });
        }
      })
      .finally(() => console.log("끝남"));
  }

  // ID 체크
  function handleIdCheck() {
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    axios
      .get("/api/member/check?" + searchParam.toString())
      .then(() => {
        setIdAvailable(false);
        toast({
          position: "top",
          description: "중복된 ID입니다.",
          status: "warning",
        });
      })
      .catch((e) => {
        if (e.response.status === 404) {
          setIdAvailable(true);
          toast({
            position: "top",
            description: "사용가능한 ID입니다.",
            status: "success",
          });
        }
      })
      .finally(() => console.log("끝"));
  }

  // 이메일 체크
  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params.toString())
      .then(() => {
        setEmailAvailable(false);
        toast({
          position: "top",
          description: "이미 사용 중인 email 입니다.",
          status: "warning",
        });
      })
      .catch((e) => {
        if (e.response.status === 404) {
          setEmailAvailable(true);
          toast({
            position: "top",
            description: "사용 가능한 email 입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <h1>회원 가입</h1>

      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          <Button onClick={handleIdCheck}>중복확인</Button>
        </Flex>
        <FormErrorMessage>ID 중복체크를 해주세요.</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password != passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          type="password"
        />
        <FormErrorMessage>암호가 다릅니다!!!</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!emailAvailable}>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
            type="email"
          />
          <Button onClick={handleEmailCheck}>중복확인</Button>
        </Flex>
        <FormErrorMessage>email 중복 체크를 해주세요.</FormErrorMessage>
      </FormControl>

      <Button
        isDisabled={!submitAvailable}
        onClick={handleSubmit}
        colorScheme="blue"
      >
        가입
      </Button>
    </Box>
  );
}
