import Inquiry from "../../models/inquirySchema.js";

// 문의글 등록
export const postInquiry = async (req, res) => {
 console.log("문의글 저장 요청😱");
 const { type, title, content, file } = req.body;

 const inquiry = {
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

}