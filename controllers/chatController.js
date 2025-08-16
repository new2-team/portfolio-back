import User from '../models/user.js';
import { createChatWithInitialMessage } from '../services/chatting/chatMessageService.js';
// 채팅 관련 컨트롤러 (채팅방, 메시지 등)
// 0. matching 스키마 status값이 매칭완료
// 1. postChattingRoom api호출 -> 프론트에서 해당 matching(matching 이름으로 보내기, 스키마에 있는 값 다 넣어서)객체 전부 백으로 넘겨주기
// 2. postChattingRoom -> 초기 채팅방, 메시지 생성
// 3. getChattingRoom -> 전체 채팅방 리스트 가지고 오기
// 4. 채팅방 클릭시 -> 채팅방 unreadCounts 변경: putChattingRoom
//               -> 해당 채팅방의 message 객체 가지고 오기: getChatMessage(useEffect)
//               -> message 객체의 read 읽음 변경: putChatMessage
// 5. 채팅 보낼시 ->  message 객체 생성: postChatMessage, message 조회 업데이트: getChatMessage(useEffect)
//             -> 채팅방 lastMessage 변경: putChattingRoom, 채팅방 조회(lastMessageAt 최신순으로 배열): getChattingRoom(useEffect)
// 6. 채팅보관함 -> 이미지 보아보기: getChatPictures, 일정 리스트 모아보기: getComingSchedules

export const getFriendsList = async (req, res) => {
  // 친구 목록 조회 로직 
  // -> 채팅방 목록에서 target_id의 프로필 이름과, 프로필사진 가지고 오기
  res.send('채팅 목록');
}; 

// chat - ChatList
// 1. 채팅방 생성, 초기 메시지 생성
export const postChattingRoom = async (req, res) => {
  try {
    // 프론트에서 matching 객체 전체 받기
    const { matching } = req.body;

    if (!matching) {
      return res.status(400).json({ error: 'matching 객체가 없습니다.' });
    }

    const { user_id, target_id, match_id } = matching;

    // 1. target 유저 정보 조회 -> 상대유저 이름, 프로필url 가지고오기
    const targetUser = await User.findById(target_id);
    if (!targetUser) {
      return res.status(404).json({ error: '상대 유저 정보를 찾을 수 없습니다.' });
    }

    const target_name = targetUser.name;
    const target_profile_img = targetUser.profile_img;
    const messageContent = "매칭되었습니다! 대화를 나눠보세요";
    const senderId = 0;

    // 2. 채팅방 + 첫 메시지 생성
    // chatMessageService에 저값들을 넘긴다
    const { chat, message } = await createChatWithInitialMessage({
      user_id,
      target_id,
      match_id,
      target_name,
      target_profile_img,
      messageContent, // 채팅방 생성 초기 메시지
      senderId // 채팅방 생성 관리자 id: 0
    });

    return res.status(201).json({ chat, message });
  } catch (error) {
    console.error('postChattingRoom 오류:', error);
    res.status(500).json({ error: '채팅방 생성 실패' });
  }
};


export const putChattingRoom = async (req, res) => {
  // 채팅방 수정 로직 -> lastMessage, lastMessageAt, unreadCounts 업데이트용
};

export const getChattingRoom = async (req, res) => {
  // 채팅방 조회 로직 -> 전체 채팅방 리스트 가지고 오기
  res.send('채팅 목록');
}; 


// message - ChatApp
export const postChatMessage = async (req, res) => {
  // 채팅메시지 message스키마 생성
  // 메시지 전송
  res.send('채팅 목록');
}; 

export const putChatMessage = async (req, res) => {
  // 채팅메시지 읽음 표시 - message 객체 read 수정
  // 메시지 전송
  res.send('채팅 목록');
};

export const getChatMessage = async (req, res) => {
  // 채팅메시지 내용 리스트 조회 로직
  res.send('채팅 목록');
}; 

export const postChatPic = async (req, res) => {
  // 메시지 사진 업로드 로직
  res.send('채팅 목록');
}; 

// ScheduleAlert
export const getChatPictures = async (req, res) => {
  // 메시지 사진 모아보기 로직
  res.send('채팅 목록');
}; 

export const getComingSchedules = async (req, res) => {
  // 채팅 상대와의 일정 목록 조회 로직
  res.send('채팅 목록');
}; 