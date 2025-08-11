import User from "../../models/userSchema.js";
import bcrypt from "bcrypt";



//회원가입
export const registerUser = async (req, res) => {
    //1. 회원이 있는지 없는지
   const foundUser = await User.findOne({email : req.body.email}).lean()

    //2. 만약 회원이 있다면 회원가입을 할 수 없다.
   if(foundUser){
    return res.status(409).json({
        registerStatus : false,
        message : `이미 존재하는 이메일입니다. (${foundUser.provider})`
    })
   }else{
    //3. 만약 회원이 없다면 회원가입이 가능하다.
    console.log(req.body)

    const {email, password, name} = req.body

    //3. 비밀번호 암호화(해시화)
    const saltRounds = 10 //해시 강도(설정값이 높으면 더 안전하다. 그 대신 느려진다.)
    bcrypt.hash(password, saltRounds , async (err, hashedPassword) => {
        if(err){
            console.log(err)
        }else{
           //유저 등록
            await User.create({
                email : email,
                password : hashedPassword,
                name : name,
            })

            res.status(201).json({
                registerSuccess : true,
                message : "회원가입이 완료되었습니다!! 로그인 후 이용해주세요."  
            })
        }
    })
   }
};



//로그인
export const loginUser = async (req, res) => {      
    //1. 이메일과 비밀번호 받기
   const {email, password} = req.body  

    //2. 이메일 존재 여부 확인
   const foundUser = await User.findOne({email : email}).lean()

   if(!foundUser){
    return res.status(404).json({
        loginSuccess : false,
        message : "존재하지 않는 이메일입니다."
    })
   }else{
    //3. 비밀번호 일치 여부 확인
    const hashedPassword = foundUser.password

    bcrypt.compare(password, hashedPassword, (err, result) => {
        if(err){
            console.log(err)
        }else if(result){
            //4. 현재 유저 정보 반환
            const {password , ...currentUser} = foundUser

            return res.status(200).json({
                currentUser : currentUser,
                isLogin : true,
                message : "로그인 완료!",
            })
        }else{
            return res.status(401).json({
                isLogin : false,
                message : "비밀번호가 일치하지 않습니다."
            })
        }
    })
   }

};
    
//회원정보 수정
export const modifyUser = (req, res) => {
    res.status(200).json({message : "회원정보 수정 완료!"});
};

//회원 탈퇴
export const removeUser = (req, res) => {
    res.status(200).json({message : "회원 탈퇴 완료!"});
};

//썸네일 이미지 변경    
export const modifyPicture = (req, res) => {
    res.status(200).json({message : "썸네일 이미지 변경 완료!"});
};