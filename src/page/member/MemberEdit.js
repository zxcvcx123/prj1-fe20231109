import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";

export function MemberEdit() {
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  const toast = useToast();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((res) => {
      setMember(res.data);
      setEmail(res.data.email);
    });
  }, []);

  const id = params.get("id");

  if (member === null) {
    return <Spinner />;
  }

  // 기존 이메일과 같은지?
  let sameOriginEmail = false;

  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  // 기존 이메일과 같거나, 중복확인을 했거나
  let emailChecked = sameOriginEmail || emailAvailable;

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
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" />
      </FormControl>

      {/* 이메일을 변경하면 중복확인 다시 하도록 */}
      {/* 기존 email과 같으면 중복확인 안해도됨 */}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
          />
          <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>
    </Box>
  );
}
