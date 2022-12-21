// 로그아웃
function handleLogout() {
    localStorage.clear()
    window.location.replace("api.html")
}


const main_url = "http://127.0.0.1:8000"

// 사진 미리보기
const fileInput = document.getElementById("file")
const handleFiles = (e) => {
    const fileReader = new FileReader()
    const selectedFile = fileInput.files;
    fileReader.readAsDataURL(selectedFile[0])
    fileReader.onload = function () {
        document.getElementById("previewImg").src = fileReader.result
    }
}
fileInput.addEventListener("change", handleFiles)

function printwise() {
    var wise = document.getElementById('wise').value
    console.log(typeof (wise))
    var slicing_wise = wise.split('/')
    console.log(slicing_wise)

    document.getElementById("result").innerText = slicing_wise[0]
    if (slicing_wise[1]) {
        document.getElementById("result2").innerText = slicing_wise[1]
    }
    if (slicing_wise[2]) {
        document.getElementById("result3").innerText = slicing_wise[2]
    }
    if (slicing_wise[3]) {
        document.getElementById("result4").innerText = slicing_wise[3]
    }
    if (slicing_wise[4]) {
        document.getElementById("result5").innerText = slicing_wise[4]
    }
}

function printnickname() {
    var nickname = document.getElementById("nickname").value
    document.getElementById("result_nickname").innerText = '- ' + nickname
}

async function handleUploadimg() {
    const img = document.querySelector('#file')
    const wise = document.getElementById('wise').value
    const nickname = document.getElementById('nickname').value

    const checks = document.getElementsByName('sol_category').length
    var cate_str = ''

    for (var i = 0; i < checks; i++) {
        if (document.getElementsByName('sol_category')[i].checked == true) {
            category_num = document.getElementsByName('sol_category')[i].value
            cate_str = cate_str + String(category_num)
        }
    }

    const formdata = new FormData()
    formdata.append('solution_image', img.files[0])
    formdata.append('wise', wise)
    formdata.append('nickname', nickname)
    formdata.append('category', cate_str)

    const response = await fetch(`${main_url}/article/0/solution/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access')
        },
        method: 'POST',
        body: formdata
    }).then(setTimeout(function () {
        console.log('5')
        window.location.replace('solution_collection.html');
    }, 1000))

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