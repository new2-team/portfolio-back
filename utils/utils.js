import moment from "moment";

//현재 시간 가져오기
const getCurrentTime = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
}

export {getCurrentTime};