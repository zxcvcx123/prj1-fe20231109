import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

export function AlertComp() {
  return (
    <Alert status="success">
      <AlertIcon />
      <AlertDescription>사용 가능한 ID 입니다.</AlertDescription>
    </Alert>
  );
}
