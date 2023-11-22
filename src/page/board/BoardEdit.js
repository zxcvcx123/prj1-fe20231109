import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormHelperText,
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
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const [removeFileIds, setRemoveFileIds] = useState([]);
  const [uploadFiles, setUploadFiles] = useState(null);
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
      .putForm("/api/board/edit", {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFileIds,
        uploadFiles,
      })
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

  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
    }
  }

  return (
    <Box>
      <Card>
        <CardHeader>
          <Heading>{id}번 글 수정</Heading>
        </CardHeader>
        <CardBody>
          <FormControl mb={4}>
            <FormLabel fontSize={"xl"} fontWeight={"bold"}>
              {" "}
              제목
            </FormLabel>
            <Input
              value={board.title}
              onChange={(e) =>
                updateBoard((draft) => {
                  draft.title = e.target.value;
                })
              }
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontSize={"xl"} fontWeight={"bold"}>
              본문
            </FormLabel>
            <Textarea
              value={board.content}
              onChange={(e) =>
                updateBoard((draft) => {
                  draft.content = e.target.value;
                })
              }
            />
          </FormControl>

          {/* 이미지 */}
          {/* 이미지 출력 */}
          {board.files.map((file) => (
            <Box
              key={file.id}
              width={"60%"}
              my={"5px"}
              borderTop={"3px solid black"}
              mb={4}
            >
              <FormControl display={"flex"} alignItems={"center"}>
                <FormLabel colorScheme="red">
                  <FontAwesomeIcon icon={faTrashCan} color="red" />
                </FormLabel>
                <Switch
                  colorScheme="red"
                  onChange={handleRemoveFileSwitch}
                  value={file.id}
                />
              </FormControl>
              <Box>
                <Image width={"100%"} src={file.url} alt={file.fileName} />
              </Box>
            </Box>
          ))}

          {/* 추가할 파일 */}
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
          <Button mr={4} colorScheme="blue" onClick={onOpen}>
            저장
          </Button>
          <Button onClick={() => navigate(-1)}>취소</Button>
        </CardFooter>
      </Card>
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
