// 로그아웃
function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
}


const main_url = "http://127.0.0.1:8000"
const payload = localStorage.getItem('payload')
const personObj = JSON.parse(payload)
const userId = personObj['user_id']
const username = personObj['username']

window.onload = async function check_userchr() {
    const response = await fetch(`${main_url}/users/signup/${userId}/userchr/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'GET'
    })
    if (response.status == 204) {
        window.location.replace('signup_userchr.html')
    } else if(response.status == 200) {
        response_json = await response.json()
        const user_mbti = document.getElementById('input_mbti')
        user_mbti.setAttribute("value",response_json.mbti)
    }
}

async function create_worry() {
    const category = document.getElementById('input_category')
    const category_txt = category.options[category.selectedIndex].text
    const worry = document.getElementById('input_worry').value
    const mbti = document.getElementById('input_mbti').value

    console.log(mbti, category_txt, worry)

    const response = await fetch(`${main_url}/article/worry/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "mbti": mbti,
            "category": category_txt,
            "content": worry
        })
    })
    window.location.replace('solution.html')
}

function save_category_id(category_id) {
    localStorage.setItem('category_id', category_id)
    window.location.replace('articles.html')
}

function go_profile(){
    localStorage.setItem('category_id', 0)
    window.location.replace('profile.html')
}

fetch("./navbar.html").then(response => {
    return response.text()
})
    .then(data => {
        document.querySelector("header").innerHTML = data
    })