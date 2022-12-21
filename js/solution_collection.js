const main_url = "http://127.0.0.1:8000"
const payload = localStorage.getItem('payload')
const personObj = JSON.parse(payload)

window.onload = () => {
    load_solution_collection();
}

async function load_solution_collection(){
    const payload = localStorage.getItem('payload')
    const personObj = JSON.parse(payload)
    const userId = personObj['user_id']
    const username = personObj['username']

    const response = await fetch (`${main_url}/article/allsolution/`,{
        headers : {
            'Authorization' : 'Bearer ' + localStorage.getItem('access'),
            'content-type' : 'application/json',
        },
        method : 'GET',
    })
    response_json = await response.json()
    console.log(response_json)
   
    const img_box = document.getElementById('img_box')
    
    response_json.forEach(element => {
        const main_img = document.createElement('div')
        main_img.style.display = 'flex'
        main_img.style.flexDirection = 'column'

        const img_tag = document.createElement('a')

        img_tag.href = '/solution_detail.html'
        img_tag.onclick = function() {
            localStorage.setItem("solution_id", element.id)
        }

        const solution_img = document.createElement('img')
        solution_img.src = `${main_url}${element.solution_image}`
        solution_img.style.width = '250px';
        solution_img.style.height = '250px';
        solution_img.style.margin = '10px 15px';
        solution_img.style.borderRadius = '15%'

        
        const rating_box = document.createElement('div') //
        rating_box.classList.add('rating_box');


        const rating_btn_best = document.createElement('botton') // 좋아요
        rating_btn_best.classList.add('btn');
        rating_btn_best.classList.add('btn-warning');
        rating_btn_best.classList.add('btn-outline-dark');
        const rating_btn_best_text = document.createTextNode('좋아요') // 좋아요
        rating_btn_best.onclick = function(){
            rating(element.id, 4)
            console.log(element.id)
        }

        const rating_btn_soso = document.createElement('button') // 글쎄요
        rating_btn_soso.classList.add('btn');
        rating_btn_soso.classList.add('btn-warning');
        rating_btn_soso.classList.add('btn-outline-dark');
        const rating_btn_soso_text = document.createTextNode('글쎄요')
        rating_btn_soso.onclick = function(){
            rating(element.id, 2)
            console.log(element.id)
        }        

        const rating_btn_bad = document.createElement('button') // 안좋아요
        rating_btn_bad.classList.add('btn');
        rating_btn_bad.classList.add('btn-warning');
        rating_btn_bad.classList.add('btn-outline-dark');
        const rating_btn_bad_text = document.createTextNode('안좋아요')
        rating_btn_bad.onclick = function(){
            rating(element.id, 0)
            console.log(element.id)
        }        


        img_box.appendChild(main_img)
        main_img.appendChild(solution_img)        
        

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

async function rating(solution_id, value){
    
    const response = await fetch(`${main_url}/article/worry/${solution_id}/`,{
        headers : {
            'Authorization' : 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({
            "rating" : value
        })

    })
    alert('평가완료')
}



// 로그아웃
function handleLogout(){
    localStorage.clear()
    window.location.replace("api.html")
}

fetch("./navbar.html").then(response=>{
    return response.text()
})
.then(data =>{
    document.querySelector("header").innerHTML = data
})

function save_category_id(category_id){
    localStorage.setItem('category_id',category_id)
    window.location.replace("articles.html")
}