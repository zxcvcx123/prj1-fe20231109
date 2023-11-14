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
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect } from "react";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const navigate = useNavigate();
  // /edit/:id id 쪽에 들어가는 값을 id이름으로 받을 수 있음
  const { id } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios.get("/api/board/id/" + id).then((res) => updateBoard(res.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleSubmit() {
    // 저장 버튼 클릭 시
    // PUT /api/board/edit
    axios
      .put("/api/board/edit", board)
      .then((res) => {
        toast({
          description: "수정 완료!",
          status: "success",
        });
        navigate(-1);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          toast({
            description: "수정 실패!!! 수정할 게시글을 확인해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "수정 실패!!! 관리자에게 문의하세요",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
      <FormControl>
        <FormLabel> 제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.content = e.target.value;
            })
          }
        />
      </FormControl>

      <Button colorScheme="blue" onClick={onOpen}>
        저장
      </Button>
      <Button onClick={() => navigate(-1)}>취소</Button>
      <>
        <>
          {/* 수정 모달 */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>수정하기</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>수정하시겠습니까?</Text>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  수정
                </Button>
                <Button colorScheme="red" onClick={onClose}>
                  취소
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      </>
    </Box>
  );
}
