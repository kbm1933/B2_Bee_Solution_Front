// 로그아웃
function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
}

const main_url = "http://127.0.0.1:8000"
const category_id = localStorage.getItem('category_id')
window.onload = async function signincheck(){
    const payload = localStorage.getItem('payload')

    if (payload){
    const response = await fetch (`${main_url}/users/signin/`, {
        headers : {
            Authorization : localStorage.getItem('access')
        },
        method:"GET"
    })
    }
    else{
    alert('로그인 후 진행해주세요')
    window.location.replace("api.html")
    }
}
window.onload = () => {
    check_alarm();
    load_articles();
}

async function check_alarm() {
    const response = await fetch(`${main_url}/article/alarm/1/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'GET'
    })
    console.log(response.status)
    if (response.status == 200) {
        const alarm_img = document.getElementById('alarm_img')
        alarm_img.src = 'imgs/alarmon.png'
    } else if(response.status == 204) {
        const alarm_img = document.getElementById('alarm_img')
        alarm_img.src = 'imgs/alarmoff.png'
    }
}

async function load_articles() {
    const response = await fetch(`${main_url}/article/alarm/0/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access'),
            "content-type": "application/json"
        },
        method: 'GET',
    })

    response_json = await response.json()
    console.log(response_json)

    let articles_box = document.getElementById('articles')
    let output = ''

    if (response_json == 0) {
        output += `
        <div class="card text-center" >
            <div class="card-body">
                <h4 class="card-title">새로운 댓글이 없습니다!
                    <img src="imgs/sadbee.jpg" style="width:100px; height:100px; margin-left:15px">
                </h4>
            </div>
        </div>
        `
    } else {
        response_json.forEach(element => {
            output += `
            <div class="card text-center" >
                <div class="card-body">
                    <p class="card-text" align="right">내 게시글에 새로운 댓글이 달렸습니다!
                    <a href="javascript:ignore(${element.id});" class="btn btn-warning btn-outline-dark">닫기</a></p>
                    <h5 class="card-title">${element.category} / ${element.mbti}</h5>
                    <p class="card-text">${element.content}</p>
                    <a href="javascript:save_article_id(${element.id});" class="btn btn-warning btn-outline-dark">댓글 보러 가기</a>
                </div>
            </div>
            `
        })
    }
    articles_box.innerHTML = output
}

function save_article_id(article_id) {
    localStorage.setItem('article_id', article_id)
    window.location.replace('article_detail.html')
}

function ignore(article_id) {
    const response = fetch(`${main_url}/article/${article_id}/detail/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access'),
            "content-type": "application/json"
        },
        method: 'GET',
    })
    window.location.reload()
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