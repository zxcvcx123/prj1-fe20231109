import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";
import { NavBar } from "../component/NavBar";

export function HomeLayout() {
  return (
    <Box>
      <Box width={"80%"} m={"auto"} mb={10} mt={2}>
        <NavBar />
      </Box>
      <Box width={"80%"} m={"auto"}>
        <Outlet />
      </Box>
    </Box>
  );
}
