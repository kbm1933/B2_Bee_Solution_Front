// 로그아웃
function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
}


const main_url = "http://127.0.0.1:8000"
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
const username = personObj['username']

window.onload = async function check_userchr() {
    const response = await fetch(`${main_url}/users/signup/${userId}/userchr/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'GET'
    })
    if (response.status == 204) {
        window.location.replace('signup_userchr.html')
    } else if(response.status == 200) {
        response_json = await response.json()
        const user_mbti = document.getElementById('input_mbti')
        user_mbti.setAttribute("value",response_json.mbti)
    }
}

async function create_worry() {
    const category = document.getElementById('input_category')
    const category_txt = category.options[category.selectedIndex].text
    const worry = document.getElementById('input_worry').value
    const mbti = document.getElementById('input_mbti').value

    console.log(mbti, category_txt, worry)

    const response = await fetch(`${main_url}/article/worry/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "mbti": mbti,
            "category": category_txt,
            "content": worry
        })
    })
    window.location.replace('solution.html')
}

function save_category_id(category_id) {
    localStorage.setItem('category_id', category_id)
    window.location.replace('articles.html')
}

function go_profile(){
    localStorage.setItem('category_id', 0)
    window.location.replace('profile.html')
}

// sns로 beesolution 공유하기
function sns_share(sns) {
    var thisUrl = document.URL;
    var snsTitle = "Beesolution 공유하기";
    if( sns == 'facebook' ) {
        var url = "http://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(thisUrl);
        window.open(url, "", "width=486, height=286");
    }
    else if( sns == 'twitter' ) {
        var url = "http://twitter.com/share?url="+encodeURIComponent(thisUrl)+"&text="+encodeURIComponent(snsTitle);
        window.open(url, "tweetPop", "width=486, height=286,scrollbars=yes");
    }
    else if( sns == 'band' ) {
        var url = "http://www.band.us/plugin/share?body="+encodeURIComponent(snsTitle)+"&route="+encodeURIComponent(thisUrl);
        window.open(url, "shareBand", "width=400, height=500, resizable=yes");
    } 
}

fetch("./navbar.html").then(response => {
    return response.text()
})
    .then(data => {
        document.querySelector("header").innerHTML = data
    })