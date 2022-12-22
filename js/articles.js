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

async function get_articles(page_param) {
    if (page_param == '') {
        const response = await fetch(`${main_url}/article/${category_id}/`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                "content-type": "application/json"
            },
            method: 'GET',
        })
        response_json = await response.json()
        return response_json

    } else {
        page = page_param.split('=')[1]
        const response = await fetch(`${main_url}/article/${category_id}/?page=${page}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                "content-type": "application/json"
            },
            method: 'GET',
        })
        response_json = await response.json()
        console.log(response_json)
    }
    return response_json
}

window.onload = async function load_articles() {
    page_param = location.search
    var page = parseInt(page_param.split('=')[1])

    response_json = await get_articles(page_param)
    console.log(response_json)

    // ************ pagination ********************
    let total_articles = response_json.count //총 게시글 수
    let page_count = Math.ceil(total_articles / 3) //  let

    if (page_param == "") {
        current_page = 1
    } else {
        current_page = page
    }
    console.log(page_count, current_page)

    let page_group = Math.ceil(current_page / 5) //보여줄 페이지 수
    let last_number = page_group * 5

    if (last_number > page_count) {
        last_number = page_count
    }
    let first_number = last_number - (5 - 1)
    console.log(first_number, last_number)

    const next = current_page + 1
    const prev = current_page - 1


    let pagination_box = document.getElementById('pagination_box')

    let page_btn = '<ul class="pagination">'

    if (response_json.previous != null) {
        page_btn += `<li class="page-item" ><a class="page-link" href="articles.html?page=${prev}">Prev</a></li>`
    }

    if (page_count >= 5) {
        for (let i = first_number; i <= last_number; i++) {
            if (i == current_page) {
                page_btn += `<li class="page-item active my-active" aria-current="page"><a class="page-link"href="articles.html?page=${i}">${i}</a></li>`
            } else {

                page_btn += `<li class="page-item" ><a class="page-link" href="articles.html?page=${i}">${i}</a></li>`
            }

        }
    } else {
        for (let i = 1; i <= page_count; i++) {
            if (i == current_page) {
                page_btn += `<li class="page-item active" aria-current="page"><a class="page-link"href="articles.html?page=${i}">${i}</a></li>`
            } else {

                page_btn += `<li class="page-item" ><a class="page-link" href="articles.html?page=${i}">${i}</a></li>`
            }
        }
    }

    if (response_json.next != null) {
        page_btn += `
        <li class="page-item" ><a class="page-link" href="articles.html?page=${next}">Next</a></li>
      `

    }
    page_btn += '</ul>'

    pagination_box.innerHTML = page_btn

    let articles_box = document.getElementById('articles')
    let output = ''
    response_json.results.forEach(element => {

        output += `
        <div class="card text-center" >
            <div class="card-body">
                <h5 class="card-title">${element.category} / ${element.mbti}</h5>
                <p class="card-text">${element.content}</p>
                <a href="javascript:save_article_id(${element.id},${current_page});" class="btn btn-warning btn-outline-dark">게시글 보기</a>
            </div>
        </div>
        `
    })
    articles_box.innerHTML = output
}

function save_article_id(article_id, current_page) {
    localStorage.setItem('article_id', article_id)
    localStorage.setItem('current_article_page', current_page)
    window.location.replace('article_detail.html')
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