const payload = localStorage.getItem('payload')

window.onload = async function load_solutions(){

    const main_url = "http://127.0.0.1:8000"
    const article_id = localStorage.getItem('article_id')

    if (payload){
    const response = fetch (`${main_url}/users/signin/`, {
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

    const response = await fetch(`${main_url}/article/${article_id}/solution/`, {
        header: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: "GET"
    })

    response_json = await response.json()
    console.log(response_json)

    const payload = localStorage.getItem('payload')
    const personObj = JSON.parse(payload)
    const userId = personObj['user_id']

    const img_box = document.getElementById('img_box')

    response_json.solution.forEach(element => {

        const main_img = document.createElement('div')
        main_img.className = 'main_img'
        main_img.style.display = 'flex'
        main_img.style.flexDirection = 'column'

        const solution_img = document.createElement('img')
        solution_img.src = `${main_url}${element.solution_image}`
        solution_img.style.width = '250px';
        solution_img.style.height = '250px';
        solution_img.style.margin = '10px 15px';
        solution_img.style.borderRadius = '15%';

        const delete_img = document.createElement('img')
        delete_img.src = 'delete.png'
        delete_img.className = 'delete'
        delete_img.style.width = '250px';
        delete_img.style.height = '250px';
        delete_img.style.margin = '10px 15px';
        delete_img.style.borderRadius = '15%';

        solution_img.onmouseover = function () {
            solution_img.style.transform = 'scale(1.1)'
        }
        solution_img.onmouseout = function () {
            solution_img.style.transform = 'scale(1)'
        }

        const btn_box = document.createElement('div')
        btn_box.style.display = 'flex'
        btn_box.style.flexDirection = 'row'
        btn_box.style.justifyContent = 'center'

        const best = document.createElement('button')
        best.textContent = '좋아요'
        best.style.border = '0'
        best.style.borderRadius = '20%'
        best.style.backgroundColor = '#F5D10D'
        best.onclick = function () {
            rating(element.id, 4)
        }
        const soso = document.createElement('button')
        soso.textContent = '글쎄요'
        soso.style.border = '0'
        soso.style.borderRadius = '20%'
        soso.style.backgroundColor = '#F5D10D'
        soso.onclick = function () {
            rating(element.id, 2)
        }
        const bad = document.createElement('button')
        bad.textContent = '안좋아요'
        bad.style.border = '0'
        bad.style.borderRadius = '20%'
        bad.style.backgroundColor = '#F5D10D'
        bad.onclick = function () {
            rating(element.id, 0)
        }

        if (element.user == userId) {
            solution_img.style.boxShadow = '5px 5px 10px red';
            delete_img.onclick = function () {
                deleteImg(element.id)
            }
            main_img.appendChild(delete_img)
        }


        btn_box.appendChild(best)
        btn_box.appendChild(soso)
        btn_box.appendChild(bad)

        main_img.appendChild(solution_img)
        main_img.appendChild(btn_box)
        img_box.appendChild(main_img)
    })
}


async function rating(solution_id, value) {

    const main_url = "http://127.0.0.1:8000"
    
    const response = await fetch(`${main_url}/article/solution/${solution_id}/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "rating": value
        })
    })

    alert('평가완료')
}

async function deleteImg(solution_id){
    const main_url = "http://127.0.0.1:8000"
    if (confirm("직접 만든 솔루션을 삭제하시겠습니까?") == true){
        const response = await fetch(`${main_url}/article/solution/${solution_id}/`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
                'content-type': 'application/json'
            },
            method: 'delete',

        }).then(window.location.reload())
    }else{
        return;
    }
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

function save_category_id(category_id) {
    localStorage.setItem('category_id', category_id)
    window.location.replace("articles.html")
}

// 로그아웃
function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
}