// 로그아웃
function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
}

const payload = localStorage.getItem('payload')
const personObj = JSON.parse(payload)
const userId = personObj['user_id']
const username = personObj['username']


const main_url = "http://127.0.0.1:8000"

async function create_UserChr() {
    const mbti = document.getElementById('input_mbti')
    const mbti_txt = mbti.options[mbti.selectedIndex].text
    const gender = document.getElementById('input_gender')
    var gender_txt = gender.options[gender.selectedIndex].text

    if (gender_txt === "남자") {
        var gender_txt = "M"

    } else if (gender_txt === "여자") {
        var gender_txt = "W"
    }
    console.log(gender_txt)
    const age = document.getElementById('input_age').value

    console.log(mbti_txt, gender_txt, age)

    if (mbti_txt == "-- mbti를 골라주세요 --"|| gender_txt == "-- 성별을 골라주세요 --" || age == ""){
        alert('아래 항목을 모두 골라주세요')
        window.location.reload()
    }else{
        const response1 = await fetch(`${main_url}/users/signup/${userId}/userchr/`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                "mbti": mbti_txt,
                "gender": gender_txt,
                "age": age
            })
        })
    
        const response2 = await fetch(`${main_url}/users/signup/${userId}/userchr/`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
                'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify({
                "user_chr_check": "True",
            })
        })
    
        window.location.replace('main.html')
    }
}
