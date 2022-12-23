const payload = localStorage.getItem('payload')
const personObj = JSON.parse(payload)
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
const userId = personObj['user_id']
const article_id = localStorage.getItem('article_id')
const main_url = "http://127.0.0.1:8000"

const current_article_page = localStorage.getItem('current_article_page')

window.onload = async function load_detail() {

    const response = await fetch(`${main_url}/article/${article_id}/detail/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access'),
            "content-type": "application/json"
        },
        method: 'GET',
    })

    response_json = await response.json()
    console.log(response_json)

    
    const back_button = document.getElementById('back_button')
    back_button.onclick = function(){
        window.location.replace(`articles.html?page=${current_article_page}`)
    }
    const category = document.getElementById('article_category')
    category.setAttribute('value', response_json.mbti + '/' + response_json.category)
    const content = document.getElementById('article_content')
    content.textContent = response_json.content

    //작성자 아니면 수정, 삭제 버튼 안보임
    if (response_json.user != userId) {
        const article_edit = document.getElementById('article_edit_btn')
        article_edit.style.visibility = 'hidden'
        const article_del = document.getElementById('article_del_btn')
        article_del.style.visibility = 'hidden'
    }
    load_comments();
}

async function get_comment(page_param) {
    if (page_param == '') {
        const response = await fetch(`${main_url}/article/${article_id}/comment/`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("access"),
                "content-type": "application/json"
            },
            method: 'GET',
        })
        response_json = await response.json()
        return response_json
    }
    else {
        page = page_param.split('=')[1]
        const response = await fetch(`${main_url}/article/${article_id}/comment/?page=${page}`, {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("access"),
                "content-type": "application/json"
            },
            method: 'GET',
        })
        response_json = await response.json()
        return response_json
    }
}

async function load_comments() {
    page_param = location.search
    var page = parseInt(page_param.split('=')[1])

    myComment_list = await get_comment(page_param)

    let total_comments = myComment_list.results.count
    var page_count = Math.ceil(total_comments / 6)

    if (page_param == "") {
        current_page = 1
    }
    else {
        current_page = page
    }

    let page_group = Math.ceil(current_page / 5)
    let last_number = page_group * 5

    if (last_number > page_count) {
        last_number = page_count
    }
    let first_number = last_number - (5 - 1)

    const next = current_page + 1
    const prev = current_page - 1
    let pagination_box = document.getElementById('pagination_box')
    let page_btn = '<ul class="pagination">'

    if (myComment_list.previous != null) {
        page_btn += `<li class="page-item" ><a class="page-link" href="article_detail.html?page=${prev}">Prev</a></li>`
    }

    if (myComment_list.next != null) {
        page_btn += `
        <li class="page-item" ><a class="page-link" href="article_detail.html?page=${next}">Next</a></li>
        `
    }
    page_btn += '</ul>'

    pagination_box.innerHTML = page_btn


    const comment_list = document.getElementById('comment_list')

    let output = ''

    let like = 'https://cdn-icons-png.flaticon.com/512/1067/1067447.png'
    let dislike = 'https://cdn-icons-png.flaticon.com/512/1067/1067346.png'

    myComment_list.results.forEach(element => {
        if (userId != element.user) {
            if (element.likes.includes(userId)) {

                output += `
                <div class = 'comment_like'>
                <input class="form-control" id="commentid${element.id}" type="text" value="${element.content}">
                <button type = 'button' class='like_btn' onclick=comment_like(${element.id})>
                <img style = 'width:25px;' src='${like}'>${element.like_count}</button>
                </div>
                <br>`
            }
            else {
                output += `
                <div class = 'comment_like'>
                <input class="form-control" id="commentid${element.id}" type="text" value="${element.content}">
                <button type = 'button' class='like_btn' onclick=comment_like(${element.id})>
                <img style = 'width:25px;' src='${dislike}'>${element.like_count}</button>
                </div>
                <br>`
            }
        } else {
            if (element.likes.includes(userId)) {
                output += `
            <div class = 'comment_like'>
            <input class="form-control" id="commentid${element.id}" type="text" value="${element.content}" readonly>
            <button type = 'button' class='like_btn' onclick=comment_like(${element.id})>
            <img style = 'width:25px;' src='${like}'>${element.like_count}</button>
            </div>
            <div class='btn_box'>
            <button type="button" class="btn btn-outline-dark" id="edit_comment_btn" onclick="save_comment_id(${element.id}), ready_edit_comment(${element.id})" data-bs-toggle="modal" data-bs-target="#comment_edit_modal">
            <img style = 'width:20px;' src='https://cdn-icons-png.flaticon.com/512/1250/1250615.png'></button>
            <button type="button" class="btn btn-outline-dark" id="edit_delete" onclick=comment_delete(${element.id})>
            <img style = 'width:20px'; src='https://cdn-icons-png.flaticon.com/512/2907/2907762.png'></button>
            </div>
            `
            }
            else {
                output += `
            <div class = 'comment_like'>
            <input class="form-control" id="commentid${element.id}" type="text" value="${element.content}" readonly>
            <button type = 'button' class='like_btn' onclick=comment_like(${element.id})>
            <img style = 'width:25px;' src='${dislike}'>${element.like_count}</button>
            </div>
            <div class='btn_box'>
            <button type="button" class="btn btn-outline-dark" id="edit_comment_btn" onclick="save_comment_id(${element.id}), ready_edit_comment(${element.id})" data-bs-toggle="modal" data-bs-target="#comment_edit_modal">
            <img style = 'width:20px;' src='https://cdn-icons-png.flaticon.com/512/1250/1250615.png'></button>
            <button type="button" class="btn btn-outline-dark" id="edit_delete" onclick=comment_delete(${element.id})>
            <img style = 'width:20px'; src='https://cdn-icons-png.flaticon.com/512/2907/2907762.png'></button>
            </div>
            `
            }
        }
    })
    comment_list.innerHTML = output

}
function article_delete() {
    const response = fetch(`${main_url}/article/${article_id}/detail/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access'),
            "content-type": "application/json"
        },
        method: "DELETE"
    })
    window.location.replace('articles.html')
}

function ready_edit() {
    var content = document.getElementById('article_content').value
    var inputcontent = document.getElementById('input_worry')
    inputcontent.value = content
}

function ready_edit_comment(comment_id) {
    var comment = document.getElementById(`commentid${comment_id}`).value
    var inputcomment = document.getElementById('comment_edit_input')
    inputcomment.value = comment
}

function article_edit() {
    const category = document.getElementById('input_category')
    const category_txt = category.options[category.selectedIndex].text
    const worry = document.getElementById('input_worry').value

    const response = fetch(`${main_url}/article/${article_id}/detail/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access'),
            "content-type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({
            "category": category_txt,
            "content": worry
        })
    })
    window.location.reload()
}

function comment_create() {

    const inputItem = document.getElementById('comment_input').value
    const response = fetch(`${main_url}/article/${article_id}/comment/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access'),
            "content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            "content": inputItem
        })
    })

    window.location.reload()
}

function comment_delete(comment_id) {

    const response = fetch(`${main_url}/article/${article_id}/comment/${comment_id}/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'DELETE',
        body: {}
    })
    window.location.replace('article_detail.html')
    window.console.log('delete')
}

function comment_edit() {
    const comment_edit_input = document.getElementById('comment_edit_input').value
    const get_comment_id = localStorage.getItem("comment_id")
    const response = fetch(`${main_url}/article/${article_id}/comment/${get_comment_id}/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
            "content": comment_edit_input
        })
    })
    window.location.replace('article_detail.html')
}

async function comment_like(comment_id) {
    const response = await fetch(`${main_url}/article/${article_id}/comment/${comment_id}/likes/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: "POST"
    })
    window.location.reload()
}

function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
}

function save_comment_id(comment_id) {
    localStorage.setItem('comment_id', comment_id)
}

function save_category_id(category_id) {
    localStorage.setItem('category_id', category_id)
    window.location.replace("articles.html")
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