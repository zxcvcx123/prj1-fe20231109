import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  CloseIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";

// 댓글 작성
function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisable={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentItem({
  comment,
  isSubmitting,
  onDeleteModalOpen,
  setIsSubmitting,
}) {
  const { hasAccess } = useContext(LoginContext);
  const [isEditing, setIsEditing] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment);
  const toast = useToast();

  function handleSubmit() {
    // TODO : textarea 닫기
    // TODO : 응답 코드에 따른 기능들
    setIsSubmitting(true);
    axios
      .put("/api/comment/edit", { id: comment.id, comment: commentEdited })
      .then(() => {
        toast({
          description: "댓글이 수정되었습니다.",
          status: "info",
        });
      })
      .catch((e) => {
        if (e.response.status === 401 || e.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "error",
          });
        }

        if (e.response.status === 400) {
          toast({
            description: "입력 값을 확인해주세요.",
            status: "warning",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEditing(false);
      });
  }

  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Heading size={"xs"}>{comment.memberId}</Heading>
        <Text fontSize={"xs"}>{comment.inserted}</Text>
      </Flex>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Box flex={"1"}>
          <Text pt={"2"} fontSize={"sm"} sx={{ whiteSpace: "pre-wrap" }}>
            {comment.comment}
          </Text>
          {isEditing && (
            <Box>
              <Textarea
                value={commentEdited}
                onChange={(e) => setCommentEdited(e.target.value)}
              />

              <Button
                isDisabled={isSubmitting}
                colorScheme="purple"
                onClick={handleSubmit}
              >
                저장
              </Button>
            </Box>
          )}
        </Box>
        {hasAccess(comment.memberId) && (
          <Box>
            {isEditing || (
              <Button
                size={"xs"}
                colorScheme="purple"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
              </Button>
            )}
            {isEditing && (
              <Button
                size={"xs"}
                colorScheme="gray"
                onClick={() => setIsEditing(false)}
              >
                <NotAllowedIcon />
              </Button>
            )}

            <Button
              colorScheme="red"
              size={"xs"}
              onClick={() => onDeleteModalOpen(comment.id)}
            >
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

// 댓글 목록
function CommentList({
  commentList,
  isSubmitting,
  onDeleteModalOpen,
  setIsSubmitting,
}) {
  if (commentList == null) {
    return <Spinner />;
  }

  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={"4"}>
          {commentList &&
            commentList.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDeleteModalOpen={onDeleteModalOpen}
                setIsSubmitting={setIsSubmitting}
              />
            ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useContext(LoginContext);
  const toast = useToast();
  // const [id, setId] = useState(0);
  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용 (render X)
  const commentIdRef = useRef(0);

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("boardId", boardId);
      axios
        .get("/api/comment/list?" + params)
        .then((res) => setCommentList(res.data));
    }
  }, [isSubmitting]);

  // 댓글 작성
  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글이 등록 되었습니다.",
          status: "success",
        });
      })
      .catch((e) => {
        toast({
          description: "댓글 등록 중 문제가 발생하였습니다.",
          status: "warning",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  // 댓글 삭제
  function handleDelete() {
    // TODO: then, catch
    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 삭제 됐습니다.",
          status: "success",
        });
      })
      .catch((e) => {
        if (e.response.status === 401 || e.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제 중 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        onClose();
      });
  }

  function handleDeleteModalOpen(id) {
    // id를 어딘가 저장 (기존 useState => useRef)
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }

  return (
    <Box>
      {isAuthenticated() && (
        <>
          <Box mt={"3%"}>
            <p>댓글 작성</p>
          </Box>
          <CommentForm
            boardId={boardId}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </>
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
        setIsSubmitting={setIsSubmitting}
      />

      {/*  삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
