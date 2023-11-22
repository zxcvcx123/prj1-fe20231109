import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 멤버 리스트 목록 가져오기
export function MemberList() {
  const [list, setList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((res) => setList(res.data))
      .catch((e) => console.log(e));
  }, []);

  if (list == null) {
    return <Spinner />;
  }

  function handleTableRowClick(id) {
    const params = new URLSearchParams();
    params.set("id", id);
    navigate("/member?" + params.toString());
    // /member?id=id
  }

  return (
    <Box>
      <Heading textIndent={"20px"}>회원목록</Heading>
      <Table mt={5}>
        <Thead>
          <Tr>
            <Th>아이디</Th>
            <Th>비밀번호</Th>
            <Th>이메일</Th>
            <Th>닉네임</Th>
            <Th>가입일자</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((member) => (
            <Tr
              _hover={{ cursor: "pointer" }}
              onClick={() => handleTableRowClick(member.id)}
              key={member.id}
            >
              <Td>{member.id}</Td>
              <Td>{member.password}</Td>
              <Td>{member.email}</Td>
              <Td>{member.nickname}</Td>
              <Td>{member.inserted}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
