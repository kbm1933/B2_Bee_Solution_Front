// 로그아웃
function handleLogout(){
    localStorage.clear()
    window.location.replace("api.html")
}

const main_url = "http://127.0.0.1:8000"
const payload = localStorage.getItem('payload')
const personObj = JSON.parse(payload)
const userId = personObj['user_id']
const username = personObj['username']
const category_id = localStorage.getItem('category_id')


window.onload = () => {
    loaduseruploadimg();
    load_articles();
}



// 로딩 될때 user 이름과 프로필 사진을 불러옴
async function loaduseruploadimg(){
    const response = await fetch (`${main_url}/users/${userId}/profile/`, {method:"GET"})

    response_json = await response.json()

    // 로딩시 user 이름 가져오기
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)

    const user_name = document.getElementById('user_name')
    user_name.innerText = payload_parse.username

    const user_profile_img = response_json['profile_img']

    const img = document.getElementById('user_profile_img')
    img.setAttribute('src', `${main_url}${user_profile_img}`)

    // 사진 미리보기
    const fileInput = document.getElementById("file")
    const handleFiles = (e) => {
        const fileReader = new FileReader()
        const selectedFile = fileInput.files;
        fileReader.readAsDataURL(selectedFile[0])
        fileReader.onload = function(){
            document.getElementById("user_profile_img").src = fileReader.result
        }
    }
    fileInput.addEventListener("change", handleFiles)
}


// 프로필 사진 업로드 및 수정 하기
async function userProfileUpload(){
    const img = document.querySelector('#file')
    
    const formdata = new FormData()
    formdata.append('profile_img',img.files[0])

    alert('프로필 이미지 저장완료')

    const response = await fetch(`${main_url}/users/${userId}/profile/`, {
        headers: { 
            'Authorization': 'Bearer '+ localStorage.getItem('access')
        },
        method: 'PUT',
        body: formdata
    }
    )
}

async function get_articles(page_param){
    if (page_param == ''){
    const response = await fetch(`${main_url}/article/${category_id}/profile/`,{
        headers : {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            "content-type": "application/json"
        },
        method : 'GET',
    })
    response_json = await response.json()
    return response_json

} else {
    page = page_param.split('=')[1]
    const response = await fetch(`${main_url}/article/${category_id}/profile/?page=${page}`,{
        headers : {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            "content-type": "application/json"
        },
        method : 'GET',
    })
    response_json = await response.json()
    console.log(response_json)}
    return response_json
}

async function load_articles(){
    page_param = location.search
    var page = parseInt(page_param.split('=')[1])

    response_json = await get_articles(page_param)
    console.log(response_json)

    // ************ pagination ********************
    let total_articles = response_json.count //총 게시글 수
    let page_count = Math.ceil(total_articles / 3) //  let
    
    if(page_param == ""){
        current_page = 1
    } else {
        current_page = page
    }
    console.log(page_count, current_page)

    let page_group = Math.ceil(current_page / 5) //보여줄 페이지 수
    let last_number = page_group * 5
    
    if(last_number > page_count) {
        last_number = page_count
    }
    let first_number = last_number - (5-1)
    console.log(first_number, last_number)

    const next = current_page + 1
    const prev = current_page - 1


    let pagination_box = document.getElementById('pagination_box')

    let page_btn = '<ul class="pagination">'

    if (response_json.previous != null){
        page_btn += `<li class="page-item" ><a class="page-link" href="profile.html?page=${prev}">Prev</a></li>`
    }
    
    if (page_count >= 5) {
        for(let i=first_number; i<= last_number; i++ ){
           if(i == current_page){
               page_btn += `<li class="page-item active my-active" aria-current="page"><a class="page-link"href="profile.html?page=${i}">${i}</a></li>`
           } else {
       
           page_btn += `<li class="page-item" ><a class="page-link" href="profile.html?page=${i}">${i}</a></li>`}
       
       }} else {
           for (let i = 1; i <= page_count; i++){
               if(i == current_page){
                   page_btn += `<li class="page-item active" aria-current="page"><a class="page-link"href="profile.html?page=${i}">${i}</a></li>`
               } else {
           
               page_btn += `<li class="page-item" ><a class="page-link" href="profile.html?page=${i}">${i}</a></li>`
           }
       }}
    
    if (response_json.next != null){
        page_btn += `
        <li class="page-item" ><a class="page-link" href="profile.html?page=${next}">Next</a></li>
      `

    }
    page_btn += '</ul>'
    
    pagination_box.innerHTML = page_btn

    let articles_box = document.getElementById('articles')
    let output = ''
    response_json.results.forEach(element=>{
        
        output += `
        <div class="card text-center" >
            <div class="card-body">
                <h5 class="card-title">${element.category} / ${element.mbti}</h5>
                <p class="card-text">${element.content}</p>
                <a href="javascript:save_article_id(${element.id});" class="btn btn-warning btn-outline-dark">게시글 보기</a>
            </div>
        </div>
        `    
    })
    articles_box.innerHTML = output
}


function save_article_id(article_id){
    localStorage.setItem('article_id',article_id)
    window.location.replace("article_detail.html")
}

function save_category_id(category_id){
    localStorage.setItem('category_id',category_id)
    window.location.replace("articles.html")
}

function save_category_id_profile(category_id){
    localStorage.setItem('category_id',category_id)
    window.location.reload()
}

// user 삭제
async function deleteuser(){
    var result = confirm("확인 버튼을 누르는 즉시 회원 탈퇴되며, 되돌릴 수 없습니다");
        if(result){
            alert("회원 탈퇴 완료! 이용해주셔서 감사합니다.");
            const response = await fetch(`${main_url}/users/${userId}/profile/`, {
                headers: { 
                    'Authorization': 'Bearer '+ localStorage.getItem('access'),
                    "content-type": "application/json"
                },
                method: "DELETE",
            }
            )
            localStorage.clear()
            window.location.replace("api.html")
        }else{
            alert("회원 탈퇴 취소");
        }
}

// 비밀번호 변경
async function changepassword(){
    var new_password1 = document.getElementById("new_password1").value
    var new_password2 = document.getElementById("new_password2").value

    if (new_password1 == new_password2){
        var result = confirm("확인 버튼을 누르는 즉시 비밀번호가 변경됩니다.");
        if(result){
            alert("비밀번호 변경 완료! 바뀐 비밀번호로 다시 로그인 해주세요!");
            const response = await fetch(`${main_url}/users/${userId}/profile/changepassword/`, {
                headers: { 
                    'Authorization': 'Bearer '+ localStorage.getItem('access'),
                    "content-type": "application/json"
                },
                method: "PUT",
                body: JSON.stringify({
                    "password":new_password1,
                })
            }
            )
            localStorage.clear()
            window.location.replace("api.html")
        }else{
            alert("비밀번호 변경 취소");
        }

    }else{
        alert("입력하신 비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
    }
}


fetch("./navbar.html").then(response=>{
    return response.text()
})
.then(data =>{
    document.querySelector("header").innerHTML = data
})
