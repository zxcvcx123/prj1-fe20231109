import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
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
      .catch((e) => {
        navigate("/login");
        toast({
          description: "권한이 없습니다.",
          status: "warning",
        });
      });
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
    <Box width={"50%"} m={"auto"}>
      <Card>
        <CardHeader>
          <Heading>{member.id}님 정보</Heading>
        </CardHeader>
        <CardBody>
          <FormControl mb={4}>
            <FormLabel fontSize={"xl"} fontWeight={"bold"}>
              비밀번호
            </FormLabel>
            <Input type="text" value={member.password} readOnly />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontSize={"xl"} fontWeight={"bold"}>
              이메일
            </FormLabel>
            <Input value={member.email} readOnly />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontSize={"xl"} fontWeight={"bold"}>
              닉네임
            </FormLabel>
            <Input value={member.nickname} readOnly />
          </FormControl>
        </CardBody>
        <CardFooter>
          <Button
            mr={4}
            colorScheme="purple"
            onClick={() => navigate("/member/edit?" + params.toString())}
          >
            수정
          </Button>
          <Button colorScheme="red" onClick={onOpen}>
            탈퇴
          </Button>
        </CardFooter>
      </Card>
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
