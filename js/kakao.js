const main_url = "http://127.0.0.1:8000"

window.onload = async function check_userchr() {

    let getLink = window.location.search;
    console.log(getLink)
    let getCode = getLink.split('=');
    console.log(getCode)
    let getOnlyCode = getCode[1];
    console.log(getOnlyCode)
    const redirect_uri = 'http://127.0.0.1:5500/kakao.html'
    Kakao.init('9e77b99c35e07f371b256bbff7b3ee2a');
    async function request() {
        const response = await fetch(`${main_url}/users/signin/kakao/callback/`, {
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                "code": getOnlyCode
            })
        })
        const response_json = await response.json()
        console.log(response_json)

        localStorage.setItem('access', response_json.access);
        localStorage.setItem('refresh', response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem('payload', jsonPayload);
    }
    request()
    setTimeout(function () {
        window.location.replace('main.html');
    }, 1000);
}