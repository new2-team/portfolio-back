import Inquiry from "../../models/inquirySchema.js";
import InquiryReply from "../../models/inquiryReplySchema.js"

// 문의글 등록
export const postInquiry = async (req, res) => {
  console.log("문의글 저장 요청😱");
  // console.log(req.users.user_id)
 const { inquiry_id, user_id, type, title, content, file } = req.body;
 console.log(type, title)
 const inquiry = {
  inquiry_id : inquiry_id,
  user_id : user_id,
  type : type,
  title : title,
  content : content,
  file : file
 }

 try {
    await Inquiry.create(inquiry)
  } catch (error) {
    console.error(`inquiryController postInquiry ${error}`)
    res.status(500).json({
      message : "데이터를 추가하는 중 오류 발생"
    })
  }

  res.status(200).json({
    message: "문의글 등록이 완료되었습니다.😊"
  })
}

// 문의글 조회
export const getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.find().sort({created_at: -1})
    res.status(200).json({
      message: '문의글 조회',
      data : inquiry,
    });
  } catch(error) {
    console.error(`inquiryController getinquirys ${error}`)
    res.status(500).json({message : "문의글 조회 오류"})
  }
}

// 문의 답글 등록
export const postInquiryReply = async (req, res) => {
 console.log("문의글 답글 저장 요청😱");
 const { reply_id, inquiry_id, user_id, reply_content } = req.body;

 const inquiryReply = {
  reply_id : reply_id,
  inquiry_id : inquiry_id,
  user_id : user_id,
  reply_content : reply_content
 }

 try {
    await InquiryReply.create(inquiryReply)
  } catch (error) {
    console.error(`inquiryController postInquiry ${error}`)
    res.status(500).json({
      message : "데이터를 추가하는 중 오류 발생"
    })
  }

  res.status(200).json({
    message: "댓글 등록이 완료되었습니다.😊"
  })
}

// 문의 답글 조회
export const getInquiryReply = async (req, res) => {
  try {
    const inquiry = await InquiryReply.find().sort({created_at: 1})
    res.status(200).json({
      message: '문의글 답글 조회',
      data : inquiry,
    });
  } catch(error) {
    console.error(`inquiryController getinquirys ${error}`)
    res.status(500).json({message : "문의글 답글 조회 오류"})
  }
}