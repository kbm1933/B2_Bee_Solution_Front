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

// async function get_articles(page_param) {
//     if (page_param == '') {
//         const response = await fetch(`${main_url}/article/${category_id}/`, {
//             headers: {
//                 "Authorization": "Bearer " + localStorage.getItem("access"),
//                 "content-type": "application/json"
//             },
//             method: 'GET',
//         })
//         response_json = await response.json()
//         return response_json

//     } else {
//         page = page_param.split('=')[1]
//         const response = await fetch(`${main_url}/article/${category_id}/?page=${page}`, {
//             headers: {
//                 "Authorization": "Bearer " + localStorage.getItem("access"),
//                 "content-type": "application/json"
//             },
//             method: 'GET',
//         })
//         response_json = await response.json()
//         console.log(response_json)
//     }
//     return response_json
// }

window.onload = async function load_articles() {

    const response = await fetch(`${main_url}/article/alarm/`, {
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
    response_json.forEach(element => {

        output += `
        <div class="card text-center" >
            <div class="card-body">
                <p class="card-text" align="right">게시글에 새로운 댓글이 있습니다!
                <a href="javascript:ignore(${element.id});" class="btn btn-warning btn-outline-dark">닫기</a></p>
                <h5 class="card-title">${element.category} / ${element.mbti}</h5>
                <p class="card-text">${element.content}</p>
                <a href="javascript:save_article_id(${element.id});" class="btn btn-warning btn-outline-dark">댓글 보러 가기</a>
            </div>
        </div>
        `
    })
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