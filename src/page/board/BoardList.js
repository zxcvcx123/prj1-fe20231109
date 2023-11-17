import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
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
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <Button
          variant={"ghost"}
          onClick={() => navigate("/?p=" + pageInfo.prevPageNumber)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
      )}

      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={parseInt(params.get("p")) === pageNumber ? "solid" : "ghost"}
          onClick={(e) => {
            navigate("/?p=" + pageNumber);
          }}
        >
          {pageNumber}
        </Button>
      ))}

      {pageInfo.nextPageNumber && (
        <Button
          variant={"ghost"}
          onClick={() => navigate("/?p=" + pageInfo.nextPageNumber)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      )}
    </Box>
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
                      <Badge mr={"5px"}>
                        <ChatIcon />
                        {board.countComment}
                      </Badge>
                    )}
                    {board.countLike > 0 && (
                      <Badge>
                        <Text>
                          좋아요
                          {board.countLike}
                        </Text>
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
      <Center mt={"15px"}>
        <Pagination pageInfo={pageInfo} />
      </Center>
    </Box>
  );
}
