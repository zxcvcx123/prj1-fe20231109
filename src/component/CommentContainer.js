import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export function CommentContainer({ boardId }) {
  // 댓글 작성
  function CommentForm({ boardId }) {
    const [comment, setComment] = useState("");
    function handleSubmit() {
      axios.post("/api/comment/add", {
        boardId,
        comment,
      });
    }

    return (
      <Box>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handleSubmit}>쓰기</Button>
      </Box>
    );
  }

  // 댓글 목록
  function CommentList({ boardId }) {
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
      const params = new URLSearchParams();
      params.set("boardId", boardId);
      axios
        .get("/api/comment/list?" + params)
        .then((res) => setCommentList(res.data));
    }, [commentList]);

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
                <Box key={comment.id}>
                  <Flex justifyContent={"space-between"}>
                    <Heading size={"xs"}>{comment.memberId}</Heading>
                    <Text fontSize={"xs"}>{comment.inserted}</Text>
                  </Flex>
                  <Text pt={"2"} fontSize={"sm"}>
                    {comment.comment}
                  </Text>
                </Box>
              ))}
          </Stack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
