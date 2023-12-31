import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
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
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  // 유효성 검사
  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  const toast = useToast();

  let submitAvailable = true;

  if (!nickNameAvailable) {
    submitAvailable = false;
  }

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
      .post("/api/member/signup", { id, password, email, nickname })
      .then(() => {
        toast({
          description: "회원가입이 완료되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((e) => {
        if (e.response.status === 400) {
          toast({
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

  // 닉네임 체크
  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickname", nickname);

    axios
      .get("/api/member/check?" + params.toString())
      .then((res) => {
        setNickNameAvailable(false);
        toast({
          position: "top",
          description: "중복된 nickName 입니다.",
          status: "error",
        });
      })
      .catch((e) => {
        if (e.response.status == 404) {
          setNickNameAvailable(true);
          toast({
            position: "top",
            description: "사용가능한 nickname 입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box width={"60%"} m={"auto"}>
      <Card>
        <CardHeader>
          <Heading>회원 가입</Heading>
        </CardHeader>
        <CardBody>
          <FormControl mb={4} isInvalid={!idAvailable}>
            <FormLabel fontSize={"2xl"} fontWeight={"bold"}>
              아이디
            </FormLabel>
            <Flex>
              <Input
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setIdAvailable(false);
                }}
              />
              <Button ml={2} onClick={handleIdCheck}>
                중복확인
              </Button>
            </Flex>
            <FormErrorMessage>ID 중복체크를 해주세요.</FormErrorMessage>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontSize={"2xl"} fontWeight={"bold"}>
              비밀번호
            </FormLabel>
            <Input
              w={"86%"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={password != passwordCheck}>
            <FormLabel fontSize={"2xl"} fontWeight={"bold"}>
              비밀번호 확인
            </FormLabel>
            <Input
              w={"86%"}
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              type="password"
            />
            <FormErrorMessage>암호가 다릅니다!!!</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={!emailAvailable}>
            <FormLabel fontSize={"2xl"} fontWeight={"bold"}>
              이메일
            </FormLabel>
            <Flex>
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailAvailable(false);
                }}
                type="email"
              />
              <Button ml={2} onClick={handleEmailCheck}>
                중복확인
              </Button>
            </Flex>
            <FormErrorMessage>이메일 중복 체크를 해주세요.</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!nickNameAvailable}>
            <FormLabel fontSize={"2xl"} fontWeight={"bold"}>
              닉네임
            </FormLabel>
            <Flex>
              <Input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNickNameAvailable(false);
                }}
              />
              <Button ml={2} onClick={handleNickNameCheck}>
                중복확인
              </Button>
            </Flex>
            <FormErrorMessage>닉네임 중복 체크를 해주세요.</FormErrorMessage>
          </FormControl>
        </CardBody>
        <CardFooter>
          <Button
            isDisabled={!submitAvailable}
            onClick={handleSubmit}
            colorScheme="blue"
          >
            가입
          </Button>
        </CardFooter>
      </Card>
    </Box>
  );
}
