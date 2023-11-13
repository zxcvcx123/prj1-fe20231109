import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
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

export function MemberEdit() {
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameAvailable, setNicknameAvailable] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((res) => {
      setMember(res.data);
      setEmail(res.data.email);
      setNickname(res.data.nickname);
    });
  }, []);

  const id = params.get("id");

  if (member === null) {
    return <Spinner />;
  }

  // 암호가 없으면 기존 암호
  // 암호 작성하면 새 암호, 암호 확인도 체크
  let passwordChecked = false;

  if (passwordCheck === password) {
    passwordChecked = true;
  }

  if (password.length === 0) {
    passwordChecked = true;
  }

  // 기존 이메일과 같은지?
  let sameOriginEmail = false;

  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  // 기존 이메일과 같거나, 중복확인을 했거나
  let emailChecked = sameOriginEmail || emailAvailable;

  // 기존 닉네임과 같은지?
  let sameOriginNickname = false;

  if (nickname !== null) {
    sameOriginNickname = member.nickname === nickname;
  }

  // 닉네임
  let nicknameChecked = sameOriginNickname || nicknameAvailable;

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

  // 닉네임 중복확인
  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickname", nickname);
    axios
      .get("/api/member/check?" + params.toString())
      .then(() => {
        setNicknameAvailable(false);
        toast({
          position: "top",
          description: "중복된 nickname 입니다.",
          status: "error",
        });
      })
      .catch((e) => {
        if (e.response.status === 404) {
          setNicknameAvailable(true);
          toast({
            position: "top",
            description: "사용 가능한 nickname 입니다.",
            status: "success",
          });
        }
      });
  }

  // 수정하기 동작 버튼
  function handleSubmit() {
    axios
      .put("/api/member/edit", { id, password, email, nickname })
      .then(() => {
        toast({
          description: "수정이 완료 되었습니다.",
          status: "success",
        });
        navigate("/member?id=" + id);
      })
      .catch((e) => {
        if (e.response.status === 401 || e.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose);
  }

  return (
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormHelperText textColor={"red"}>
          미입력시 기존 패스워드를 유지합니다.
        </FormHelperText>
      </FormControl>

      {password.length > 0 && (
        <FormControl>
          <FormLabel>password 확인</FormLabel>
          <Input
            type="text"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FormControl>
      )}

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

      {/* nickname */}
      <FormControl>
        <FormLabel>nickname</FormLabel>
        <Flex>
          <Input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameAvailable(false);
            }}
          />
          <Button isDisabled={nicknameChecked} onClick={handleNickNameCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>
      <Button
        onClick={onOpen}
        isDisabled={!emailChecked || !passwordChecked || !nicknameChecked}
        colorScheme="purple"
      >
        수정
      </Button>
      {/*  수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="purple">
              수정하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
