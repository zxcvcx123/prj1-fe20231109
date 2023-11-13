import { useSearchParams } from "react-router-dom";

export function MemberView() {
  // /member?id=userid 쿼리스트링으로 넘어온 값을 받을 수 있음
  // 배열 구조분해 할당으로 받기
  const [params] = useSearchParams();

  return <div>{params.get("id")}님 회원 정보 보기</div>;
}
