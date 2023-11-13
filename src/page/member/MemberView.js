import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";

export function MemberView() {
  // /member?id=userid 쿼리스트링으로 넘어온 값을 받을 수 있음
  // 배열 구조분해 할당으로 받기
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((res) => setMember(res.data))
      .catch((e) => console.log(e));
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>{member.id}님 정보</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" value={member.password} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input value={member.password} readOnly />
      </FormControl>
      <Button colorScheme="purple">수정</Button>
      <Button colorScheme="red">삭제</Button>
    </Box>
  );
}
