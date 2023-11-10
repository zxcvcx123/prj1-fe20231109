import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";

export function MemberList() {
  const [list, setList] = useState(null);
  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((res) => setList(res.data))
      .catch((e) => console.log(e));
  }, []);

  if (list == null) {
    return <Spinner />;
  }
  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>아이디</Th>
            <Th>비밀번호</Th>
            <Th>이메일</Th>
            <Th>가입일자</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((member) => (
            <Tr key={member.id}>
              <Td>{member.id}</Td>
              <Td>{member.password}</Td>
              <Td>{member.email}</Td>
              <Td>{member.inserted}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
