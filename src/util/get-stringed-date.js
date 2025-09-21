export const getStringedDate = (targetDate) => {
    //날짜 -> YYYY-MM-DD 형태로 반환
    let year = targetDate.getFullYear();
    let month = targetDate.getMonth() + 1;
    let date = targetDate.getDate();

    if (month < 10) {
        month = `0${month}`;
    }
    if (date < 10) {
        date = `${date}`;
    }

    return `${year}-${month}-${date}`;
}