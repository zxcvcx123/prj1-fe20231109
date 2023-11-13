import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export function MemberView() {
  // /member?id=userid 쿼리스트링으로 넘어온 값을 받을 수 있음
  // 배열 구조분해 할당으로 받기
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((res) => setMember(res.data))
      .catch((e) => console.log(e));
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  // 회원 정보 탈퇴(삭제)
  function handleDelete() {
    axios
      .delete("/api/member?" + params.toString())
      .then(() => {
        toast({
          description: "회원 탈퇴하였습니다.",
          status: "success",
        });

        navigate("/");

        // TODO: 로그아웃 기능 추가하기
        // FIXME : 이 기능 고치기
      })
      .catch((e) => {
        if (e.response.status === 401 || e.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "탈퇴 처리 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose);
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
        <Input value={member.email} readOnly />
      </FormControl>
      <Button
        colorScheme="purple"
        onClick={() => navigate("/member/edit?" + params.toString())}
      >
        수정
      </Button>
      <Button colorScheme="red" onClick={onOpen}>
        탈퇴
      </Button>
      {/*  삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>탈퇴</ModalHeader>
          <ModalCloseButton />
          <ModalBody>탈퇴 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              탈퇴
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
