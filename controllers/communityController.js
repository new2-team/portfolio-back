// 커뮤니티 관련 컨트롤러 (게시글, 댓글 등)
import Post from "../models/postSchema.js"
import Reply from "../models/replySchema.js"


// 게시글
export const getPosts = async (req, res) => {
  // 게시글 목록 조회 로직
  try {
    const getPosts = await Post.find()
    res.status(200).json({
      message: '게시글 목록 조회'
    });
  } catch (error) {
    console.error(`communityController getPosts ${error}`)
    res.status(500).json({message: "게시글 목록 조회 오류 발생"})
  }
}; 

export const removePost = async(req,res) => {
  // 게시글 삭제
}

export const registerPost = async(req, res) => {
  // 게시글 등록
}




// 댓글 ---------------------------------------------

export const registerReply = async(req, res) => {
  // 댓글 등록
  const {post_id, user_id, reply_content} = req.body;

  const reply = {
    post_id: post_id,
    user_id: user_id,
    reply_content: reply_content
  }

  try{
    await Reply.create(reply)

    // 댓글 수 
    await Post.updateOne(
      {post_id},
      {$inc: {comment_count: 1}}
    )

    res.status(200).json({
      message: "댓글 추가 완료"
    })
  } catch (error) {
    console.error(`communityController registerReply ${error}`)
    res.status(500).json({
      message: "댓글 추가 중 오류 발생"
    })
  }

}




export const removeReply = async(req, res) => {
  // 댓글 삭제


  // 댓글 수 
  await Post.updateOne(
    {post_id},
    {$inc: {comment_count: -1}}
  )
}



export const toggleLike = async(req, res) => {
  // 좋아요 수
}
