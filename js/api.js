// 페이지 이동 함수 (signin-signup)
const signUpBtn = document.getElementById("signUp");
const signInBtn = document.getElementById("signIn");
const container = document.querySelector(".container");

signUpBtn.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});
signInBtn.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});



// 로딩시 로그인 확인
const main_url = "http://127.0.0.1:8000"

window.onload = async function signincheck(){
    const payload = localStorage.getItem('payload')

    if (payload){
    const response = await fetch (`${main_url}/users/signin/`, {
        headers : {
            Authorization : localStorage.getItem('access')
        },
        method:"GET"
    })
    window.location.replace("main.html")
    }
} 


// 회원가입 valid 함수
function password_valid(password, password2) {
    if (password != password2) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
    }
    else {
        return true;
    }
}

// 회원가입
async function handleSignup(){    
    
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var password2 = document.getElementById("password1").value

    if (password_valid(password, password2)) {
        const response = await fetch(`${main_url}/users/signup/`, {
            headers:{
                'content-type' : 'application/json',
            },
            method:'POST',
            body: JSON.stringify({
                "username":username,
                "password":password,
                "password2":password2,
            })
        })

        if (response.status == 400){
            response_json = await response.json()
            if (response_json.username){
                alert(response_json.username)
            }
            else {
                alert(response_json.non_field_errors)
            }

            var username = document.getElementById("username")
            var password = document.getElementById("password")
            var password2 = document.getElementById("password1")
        
            username.value = null;
            password.value = null;
            password2.value = null;
        }
        else{
            window.location.replace("api.html")
        }
        
    }
    else {
        window.location.reload()
    }
}


// 로그인
async function handleSignin(){
    var username = document.getElementById("in_username").value
    var password = document.getElementById("in_password").value

    const response = await fetch(`${main_url}/users/signin/`, {
        headers: {
            'content-type' : 'application/json',
        },
        method : 'POST',
        body : JSON.stringify({
            "username" : username,
            "password": password
        })
    })
    if (response.status == 400){
        alert('입력한 정보가 정확하지 않습니다. 다시 시도해주세요.')
        window.location.reload()

        response_json = await response.json()
        let addHtml = response_json.message;
        document.getElementById('signin_message').innerHTML = addHtml;
        setTimeout(() => {
            document.getElementById('signin_message').remove()
        }, 2000)
        var username = document.getElementById("username")
        var password = document.getElementById("password")
    
        username.value = null;
        password.value = null;
    }
    else{
        const response_json = await response.json()

        localStorage.setItem('access',response_json.access);
        localStorage.setItem('refresh', response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g,'/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
            return '%' + ('00'+ c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        localStorage.setItem('payload', jsonPayload);

        window.location.replace("main.html")
    }
}

// 로그아웃
function handleLogout(){
    localStorage.clear()
    window.location.replace("api.html")
}

async function handleKakaoSignin(){
    Kakao.init('40ff260d348d97f586de1e3a150a7bcb');
    
    Kakao.Auth.authorize({
        redirectUri: 'http://127.0.0.1:5500/kakao.html',
        prompts: 'login',
        });

}