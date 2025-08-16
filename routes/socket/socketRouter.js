const users = {};

const socketRouter = (io) => {
    io.on("connection", (socket) => {
        console.log(`새로운 연결: ${socket.id}`)

        // 사용자 등록
        socket.on("register", (userEmail) => {
            console.log(`사용자 등록: ${userEmail} (${socket.id})`)
            users[userEmail] = socket.id;
        })

        // 전체 메세지 수신
        socket.on("sendMessage", ({email, message}) => {
            console.log("email", email)
            console.log("message", message)

            // 메세지 스키마
            // 메시지 MongoDB에 저장


            // 모든 사용자에게 메세지 보내기
            io.emit("receiveMessage", {email, message})
        })

        // 1:1 메세지 수신
        socket.on("sendPrivateMessage", ({toUserId, email, message}) => {
            console.log("toUserId", toUserId)
            console.log("email", email)
            console.log("message", message)

            const targetSocketId = users[toUserId];
            if(targetSocketId){
                
                // 유저의 이메일로 검색하고
                // 채팅 스키마에 등록
                io.to(targetSocketId).emit("receivePrivateMessage", {toUserId, email, message})

            }else{
                console.log("타겟 정보가 없음")
            }
        })
    
        // 연결이 종료되면 사용자 제거
        socket.on("disconnect", () => {
            for(let userId in users){
                if(users[userId] === socket.id){
                    delete users[userId]; // 소켓제거
                    break;
                }
            }            
        })

    })
}

export default socketRouter;