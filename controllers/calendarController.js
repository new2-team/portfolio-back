// import { getCurrentTime } from "../../utils/utils.js";
import Schedule from "../models/scheduleSchema.js";


// 월별 캘린더
export const getComingSchedules = async (req, res) => {
  // 다가오는 일정 조회 로직
  Schedule
  res.send('일정 목록');
}; 
export const getCompletedSchedules = async (req, res) => {
  // 완료된 일정 조회 로직
  res.send('일정 목록');
}; 
export const getSchedulesNames = async (req, res) => {
  // 월별 캘린더 조회
  res.send('일정 목록');
}; 


// 일정
export const postSchedules = async (req, res) => {
  // 일별 캘린더 일정 등록 로직
  console.log("postSchedules 요청~!")
  const { title, date, time, place } = req.body;

  const schedule = {
    title: title,
    date: date,
    time: time,
    place: place
  }

  try {
    await Schedule.create(schedule)
  } catch (error) {
    console.error(`calendarController postSchedules ${error}`)
    res.status(500).json({
      message: "데이터를 추가하는 중 오류 발생"
    })
  }
  
  res.status(200).json({
    message: "일정이 추가 완료되었습니다"
  })
}; 

export const getSchedules = async (req, res) => {
  // 일별 캘린더 일정 조회 로직
  res.send('일정 목록');
}; 
export const putSchedules = async (req, res) => {
  // 일별 캘린더 일정 수정 로직
  res.send('일정 목록');
}; 
export const deleteSchedules = async (req, res) => {
  // 일별 캘린더 일정 삭제 로직
  res.send('일정 목록');
};

// 일기
export const postDiary = async (req, res) => {
  // 일별 캘린더 일기 등록 로직
  res.send('일정 목록');
}; 
export const getDiary = async (req, res) => {
  // 일별 캘린더 일기 조회 로직
  res.send('일정 목록');
}; 
export const putDiary = async (req, res) => {
  // 일별 캘린더 일기 수정 로직
  res.send('일정 목록');
}; 
export const deleteDiary = async (req, res) => {
  // 일별 캘린더 일기 삭제 로직
  res.send('일정 목록');
}; 

