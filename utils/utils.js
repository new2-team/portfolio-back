// JWT(토큰) 관련 유틸리티 함수들을 정의하는 파일입니다.

import moment from "moment";
// 현재 시간 가지고 오기
export const getCurrentTime = () => {
  const now = moment().format("YYYY-MM-DD HH:mm:ss")
  return now
}