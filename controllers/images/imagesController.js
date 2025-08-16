import jwt from 'jsonwebtoken';
import User from '../../models/userSchema.js';

// {
//   fieldname: 'thumbnail',
//   originalname: 'profile1.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads\\thumbnail\\2025\\06\\24',
//   filename: 'f8f140bc-4664-4bed-b457-d834db55a592-profile1.jpg',
//   path: 'uploads\\thumbnail\\2025\\06\\24\\f8f140bc-4664-4bed-b457-d834db55a592-profile1.jpg',
//   size: 45582
// }

export const thumbnail = async (req, res) => {
    if(!req.file){
        return res.status(400).json({
            message : "No file uploaded."
        })
    }
    
    // 1. 토큰이 있는지 없는지 검사한다.
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message : "Authorization token is missing"
        })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 2. 요청을 받아서 이미지를 업데이트 시켜준다.
    const currentUserEmail = decoded.email;
    const picturePath = req.file.destination;
    const pictureName = req.file.filename;

    const foundUser = await User.findOne({ email : currentUserEmail }).lean();

    await User.updateOne(
        foundUser,
        {
            picture : pictureName,
            picturePath : picturePath
        }
    )

    res.status(200).json({
        message : '파일이 성공적으로 업데이트 되었습니다.😁',
        picturePath : picturePath,
        pictureName : pictureName
    })

}