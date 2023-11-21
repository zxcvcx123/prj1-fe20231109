import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Input,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import {
  faAngleLeft,
  faAngleRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as PropTypes from "prop-types";
import { faImage } from "@fortawesome/free-regular-svg-icons";

function PageButton({ variant, pageNumber, children }) {
  const params = useSearchParams();
  const navigate = useNavigate();
  function handleClick() {
    params.set("p", pageNumber);
    navigate("/?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo }) {
  const pageNumbers = [];
  const navigate = useNavigate();

  const [params] = useSearchParams();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber && (
        <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </PageButton>
      )}

      {pageNumbers.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          variant={parseInt(params.get("p")) === pageNumber ? "solid" : "ghost"}
          pageNumber={pageNumber}
        >
          {pageNumber}
        </PageButton>
      ))}

      {pageInfo.nextPageNumber && (
        <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
          <FontAwesomeIcon icon={faAngleRight} />
        </PageButton>
      )}
    </Box>
  );
}

function SearchComponet() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  function handleSearch() {
    // /?k=keyword&c=category
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);
    navigate("/?" + params);
  }

  return (
    <Center>
      <Flex width={"50%"} mt={"15px"}>
        <Select width={"25%"} onChange={(e) => setCategory(e.target.value)}>
          <option selected value="all">
            전체
          </option>
          <option value="title">제목</option>
          <option value="content">본문</option>
        </Select>
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Button onClick={handleSearch}>검색</Button>
      </Flex>
    </Center>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  // 통신
  useEffect(() => {
    axios.get("/api/board/list?" + params).then((response) => {
      setBoardList(response.data.boardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  if (boardList === null) {
    return <Spinner />;
  }
  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList &&
              boardList.map((board) => (
                <Tr
                  _hover={{
                    cursor: "pointer",
                  }}
                  key={board.id}
                  onClick={() => navigate("/board/" + board.id)}
                >
                  <Td>{board.id}</Td>
                  <Td>
                    {board.title}
                    {board.countComment > 0 && (
                      <Badge ml={"5px"} mr={"5px"}>
                        <ChatIcon />
                        {board.countComment}
                      </Badge>
                    )}
                    {board.countLike > 0 && (
                      <Badge ml={"5px"} mr={"5px"}>
                        <Text>
                          좋아요
                          {board.countLike}
                        </Text>
                      </Badge>
                    )}
                    {board.countFile > 0 && (
                      <Badge ml={"5px"} mr={"5px"}>
                        <Flex alignItems={"center"}>
                          <FontAwesomeIcon icon={faImage} />
                          <Text>{board.countFile}</Text>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.nickname}</Td>
                  <Td>{board.ago}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <SearchComponet />
      <Center mt={"15px"}>
        <Pagination pageInfo={pageInfo} />
      </Center>
    </Box>
  );
}
