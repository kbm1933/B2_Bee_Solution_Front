const main_url = "http://127.0.0.1:8000"
const payload = localStorage.getItem('payload')
const personObj = JSON.parse(payload)

window.onload = () => {
    load_solution_collection();

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
    check_alarm();
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

async function load_solution_collection() {
    const payload = localStorage.getItem('payload')
    const personObj = JSON.parse(payload)
    const userId = personObj['user_id']
    const username = personObj['username']

    const response = await fetch(`${main_url}/article/allsolution/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'GET',
    })
    response_json = await response.json()
    console.log(response_json)

    const img_box = document.getElementById('img_box')
    response_json.forEach(element => {
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
        delete_img.src = 'imgs/delete.png'
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

        const rating_box = document.createElement('div') //
        rating_box.classList.add('rating_box');


        const rating_btn_best = document.createElement('botton') // 좋아요
        rating_btn_best.classList.add('btn');
        rating_btn_best.classList.add('btn-warning');
        rating_btn_best.classList.add('btn-outline-dark');
        const rating_btn_best_text = document.createTextNode('좋아요') // 좋아요
        rating_btn_best.onclick = function () {
            rating(element.id, 4)
            console.log(element.id)
        }

        const rating_btn_soso = document.createElement('button') // 글쎄요
        rating_btn_soso.classList.add('btn');
        rating_btn_soso.classList.add('btn-warning');
        rating_btn_soso.classList.add('btn-outline-dark');
        const rating_btn_soso_text = document.createTextNode('글쎄요')
        rating_btn_soso.onclick = function () {
            rating(element.id, 2)
            console.log(element.id)
        }

        const rating_btn_bad = document.createElement('button') // 안좋아요
        rating_btn_bad.classList.add('btn');
        rating_btn_bad.classList.add('btn-warning');
        rating_btn_bad.classList.add('btn-outline-dark');
        const rating_btn_bad_text = document.createTextNode('안좋아요')
        rating_btn_bad.onclick = function () {
            rating(element.id, 0)
            console.log(element.id)
        }

        img_box.appendChild(main_img)
        main_img.appendChild(solution_img)
        
        if (element.user == userId) {
            solution_img.style.boxShadow = '5px 5px 10px red';
            delete_img.onclick = function () {
                deleteImg(element.id)
            }
            main_img.appendChild(delete_img)
        } 


        // main_img.appendChild(img_tag)        
        // img_tag.appendChild(solution_img)

        main_img.appendChild(rating_box)
        rating_box.appendChild(rating_btn_best)
        rating_btn_best.appendChild(rating_btn_best_text)
        rating_box.appendChild(rating_btn_soso)
        rating_btn_soso.appendChild(rating_btn_soso_text)
        rating_box.appendChild(rating_btn_bad)
        rating_btn_bad.appendChild(rating_btn_bad_text)

    })
}

async function rating(solution_id, value) {

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
    alert('평가완료! AI 솔루션 추천에 반영됩니다!')
}

async function deleteImg(solution_id){
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

// 로그아웃
function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
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