// 로그아웃
function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
}


const main_url = "http://127.0.0.1:8000"

// 로딩 바 호출 후 0.5초 후 사라짐
window.addEventListener('DOMContentLoaded', function () {
    var loadingbar = document.getElementById("roadingStatus");
    if (loadingbar.style.display == "none") {
        loadingbar.style.display = "block";
    }
    setTimeout(function () { loadingbar.style.display = "none" }, 1000);
})

// fetch 에 타임아웃을 잠깐 줌
window.onload = () => { //solution_id 얻기 위해 두번 fetch
    setTimeout(() =>
        fetch(`${main_url}/article/worry/`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then((response) => response.json())
            .then((data) => {
                let solution_id = data.solution[0]
                fetch(`${main_url}/article/worry/${solution_id}/`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access'),
                        'content-type': 'application/json',
                    },
                    method: 'GET',
                }).then((response) => response.json())
                    .then((data) => {
                        const img_box = document.getElementById('solution')
                        const sol_img = document.createElement('img')
                        sol_img.src = `${main_url}${data.solution_image}`


                        const best = document.getElementById('best_btn') //좋아요 버튼 = 4
                        best.onclick = function () {
                            rating(data.id, 4)
                        }

                        const soso = document.getElementById('soso_btn') // 글쎄요 버튼 = 2
                        soso.onclick = function () {
                            rating(data.id, 2)
                        }

                        const bad = document.getElementById('bad_btn') //안좋아요 버튼 = 0
                        bad.onclick = function () {
                            rating(data.id, 0)
                        }
                        img_box.appendChild(sol_img)
                    })
            }), 1000
    );
}


//평가 버튼
async function rating(solution_id, value) {

    const response = await fetch(`${main_url}/article/worry/${solution_id}/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "rating": value
        })

    })
    window.location.replace('main.html')
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