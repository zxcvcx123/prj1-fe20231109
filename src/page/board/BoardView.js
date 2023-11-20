import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
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
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";
import { CommentContainer } from "../../component/CommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartFull } from "@fortawesome/free-solid-svg-icons";

function LikeContainer({ like, onClick }) {
  const { isAuthenticated } = useContext(LoginContext);

  if (like == null) {
    return <Spinner />;
  }

  return (
    <Flex gap={"2"}>
      <Tooltip isDisabled={isAuthenticated()} hasArrow label={"로그인 하세요."}>
        <Button variant={"ghost"} size={"xl"} onClick={onClick}>
          {like.like && <FontAwesomeIcon icon={faHeartFull} size={"xl"} />}
          {like.like || <FontAwesomeIcon icon={emptyHeart} size={"xl"} />}
        </Button>
      </Tooltip>
      <Heading size={"lg"}>{like.countLike}</Heading>
    </Flex>
  );
}

export function BoardView() {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();

  const toast = useToast();
  const navigate = useNavigate();

  const { hasAccess, isAdmin } = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  useEffect(() => {
    axios.get("/api/like/board/" + id).then((res) => setLike(res.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  // 삭제 함수
  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((e) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  function handleLike() {
    axios
      .post("/api/like", { boardId: board.id })
      .then((res) => setLike(res.data))
      .catch()
      .finally();
  }

  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Heading size={"xl"}>{board.id}번글 보기</Heading>
        <LikeContainer like={like} onClick={handleLike} />
      </Flex>
      <FormControl>
        <FormLabel> 제목</FormLabel>
        <Input value={board.title} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea value={board.content} readOnly />
      </FormControl>

      {/* 이미지 출력 */}
      {board.files.map((file) => (
        <Box key={file.id} my={"5px"} boader={"3px solid black"}>
          <Image width={"100%"} src={file.url} alt={file.fileName} />
        </Box>
      ))}

      <FormControl>
        <FormLabel>별명</FormLabel>
        <Input value={board.nickname} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input value={board.inserted} readOnly />
      </FormControl>

      {(hasAccess(board.writer) || isAdmin()) && (
        <>
          <Button colorScheme="purple" onClick={() => navigate("/edit/" + id)}>
            수정
          </Button>
          <Button colorScheme="red" onClick={onOpen}>
            삭제
          </Button>
        </>
      )}
      {/*  삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CommentContainer boardId={id} />
    </Box>
  );
}
