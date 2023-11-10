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

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [idAvailable, setIdAvailable] = useState(false);
  const toast = useToast();

  let submitAvailable = true;

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
      .then(() => console.log("잘됨"))
      .catch(() => console.log("안됨"))
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
          status: "error",
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
      <FormControl isInvalid={password.length === 0}>
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
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
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
