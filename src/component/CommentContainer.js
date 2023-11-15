import { Box, Button, Input, Textarea } from "@chakra-ui/react";
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
    const [commentList, setCommentList] = useState(null);

    useEffect(() => {
      const params = new URLSearchParams();
      params.set("id", boardId);
      axios
        .get("/api/comment/list?" + params)
        .then((res) => setCommentList(res.data));
    }, []);

    return <Box>댓글 리스트</Box>;
  }

  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
