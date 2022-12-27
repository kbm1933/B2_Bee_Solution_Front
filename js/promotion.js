const main_url = "http://127.0.0.1:8000"
const payload = localStorage.getItem('payload')
const personObj = JSON.parse(payload)
const userId = personObj['user_id']
const username = personObj['username']

async function create_worry() {
    const category = document.getElementById('input_category')
    const category_txt = category.options[category.selectedIndex].text
    const worry = document.getElementById('input_worry').value
    const mbti = document.getElementById('input_mbti').value
    var left_box = document.getElementById("left_box");
    var solution_box = document.getElementById("solution_box");
    var loadingbar = document.getElementById("roadingStatus");
    const img_box = document.getElementById('solution')
    const signup_btn = document.getElementById('signup_btn')
    

    const response = await fetch(`${main_url}/article/worry/promotion/`, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "mbti": mbti,
            "category": category_txt,
            "content": worry
        })
    }).then(left_box.style.display = "none", solution_box.style.display = "flex", loadingbar.style.display = "block")
    .then((response) => response.json())
    .then(
        setTimeout(function () { 
        loadingbar.style.display = "none"
        signup_btn.style.display = "flex"
        let sol_img = document.createElement('img')
        sol_img.src = `${main_url}/media/${response.data[0]['solution_image']}`
        img_box.appendChild(sol_img)
        }, 1000)
        )
}
