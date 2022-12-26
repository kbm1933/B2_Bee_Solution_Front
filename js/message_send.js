const main_url = "http://127.0.0.1:8000"
const payload = localStorage.getItem('payload')
const personObj = JSON.parse(payload)
const userId = personObj['user_id']

window.onload=()=>{
    load_message(1);
}

//check = 0 이면 받은 메세지 호출, 1이면 보낸 메세지 호출
async function load_message(check){

    const response = await fetch(`${main_url}/message/${check}/`, {
        headers :{
            "Authorization" : "Bearer " + localStorage.getItem("access"),
        },
        method: "GET"
})
    
    response_json = await response.json()
    console.log(response_json)

    response_json.forEach(element => {
        if (!element.delete_sender){
        const table = document.querySelector('table');
        const add_row = table.insertRow();
    
        const msg_title = add_row.insertCell(0);
        msg_title.innerHTML = `<a data-bs-toggle="modal" data-bs-target="#messageModal">${element.title}</a>`
        msg_title.onclick=function(){ //title 누르면 content 모달 창 띄움

            const modal_title = document.getElementById('messageModalLabel')
            modal_title.textContent = `${element.title}   [받는 사람 : ${element.receiver}] `

            const modal_content = document.getElementById('messageModalbody')
            modal_content.textContent = `${element.content}`

            const del_messge = document.getElementById('del_message_btn')
                del_messge.onclick= async function(){
                    const response = await fetch(`${main_url}/message/detail/${element.id}`,{
                        headers: {
                            "Authorization" : 'Bearer ' + localStorage.getItem("access")
                        },
                        method : "DELETE"
                    })
                    table.deleteRow(add_row.rowIndex)
                }

        }
        const msg_receiver = add_row.insertCell(1);
        msg_receiver.textContent = element.receiver
        const msg_date = add_row.insertCell(2);
        msg_date.textContent = moment(element.created_at).format('LLL')
    }
    });
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

