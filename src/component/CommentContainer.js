import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

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

// 댓글 목록
function CommentList({ commentList }) {
  if (commentList == null) {
    return <Spinner />;
  }

  // 댓글 삭제
  function handleDelete(id) {
    console.log(id + "번 댓글삭제");
    axios
      .delete("/api/comment/" + id)
      .then()
      .catch()
      .finally();
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
              <Box key={comment.id}>
                <Flex justifyContent={"space-between"}>
                  <Heading size={"xs"}>{comment.memberId}</Heading>
                  <Text fontSize={"xs"}>{comment.inserted}</Text>
                </Flex>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text
                    pt={"2"}
                    fontSize={"sm"}
                    sx={{ whiteSpace: "pre-wrap" }}
                  >
                    {comment.comment}
                  </Text>
                  <Button
                    colorScheme="red"
                    size={"xs"}
                    onClick={() => handleDelete(comment.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </Flex>
              </Box>
            ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("boardId", boardId);
      axios
        .get("/api/comment/list?" + params)
        .then((res) => setCommentList(res.data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList commentList={commentList} />
    </Box>
  );
}
