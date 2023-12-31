import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFiles, setUploadFiles] = useState(null);
  const navigate = useNavigate();

  const toast = useToast();

  function handleSubmit() {
    setIsSubmitting(true);
    axios
      .postForm("/api/board/add", {
        title,
        content,
        uploadFiles,
      })
      .then(() => {
        toast({
          description: "새 글이 저장되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 400) {
          toast({
            description: "작성한 내용을 확인해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box w={"80%"} m={"auto"}>
      <Card>
        <CardHeader>
          <Heading>게시글 작성</Heading>
        </CardHeader>
        <Box mt={5}>
          <CardBody>
            <FormControl mb={4}>
              <FormLabel fontSize={"xl"} fontWeight={"bold"}>
                제목
              </FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontSize={"xl"} fontWeight={"bold"}>
                본문
              </FormLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></Textarea>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontSize={"xl"} fontWeight={"bold"}>
                이미지
              </FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setUploadFiles(e.target.files)}
              />
              <FormHelperText>
                한 개 파일은 1MB이내, 총 용량은 10MB 이내로 첨부하세요.
              </FormHelperText>
            </FormControl>
          </CardBody>
          <CardFooter>
            <Button
              mt={"15px"}
              isDisabled={isSubmitting}
              onClick={handleSubmit}
              colorScheme="blue"
            >
              저장
            </Button>
          </CardFooter>
        </Box>
      </Card>
    </Box>
  );
}
