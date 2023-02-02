const SERVER_URL = "http://127.0.0.1:8000"

let curdetailid = 0;

// 글 작성할 때 쿠키를 가져와야 하므로 getCookie 작성됨
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

async function postcategory (name) {
    let token = getCookie('access_token');
    let response = await fetch(`${SERVER_URL}/blog/category`, {
        method: 'POST',
        body: JSON.stringify(name),
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    let data = await response.json();
    console.log(data);
}

async function postArticle (article) {
    let token = getCookie('access_token');
    let response = await fetch(`${SERVER_URL}/blog/article`, {
        method: 'POST',
        body: article,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    let data = await response.json();
    return data;
}

async function submitCategory () {
    let category = {
        name: document.getElementById('Category').value,
    }
    let result = postcategory(category);
    console.log(result, result.status);    
}

async function submitArticle () {
    let form = document.getElementById('form');
    let formData = new FormData(form);
    let result = await postArticle(formData);
    console.log(result);
}

//------------------------------

// 카테고리 닫기
const closeCategory = (categoryid) => {
    let modal = document.getElementById(categoryid);
    setTimeout(() => modal.style.display = 'none', 1000);
}

// 작성한 글 세부내용 보게 하는 모달
const detailArticle = (id) => {
    let modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.style.animation = 'fadein 2s';
    insertdetailArticle(id);
    curdetailid = id;
}
//        <button onclick="deleteArticle(${id})">삭제하기</button>

// 모달 닫기
const closeArticle = () => {
    let modal = document.getElementById('modal');
    modal.style.animation = 'fadeout 2s';
    setTimeout(() => modal.style.display = 'none', 2000);
}

//------------------------------

// 글 목록 모두 가져옴
async function getArticle() {
    let response = await fetch(`${SERVER_URL}/blog/article`);
    let data = await response.json();
    return data;
}

async function insertArticle (categoryid) {
    let data = await getArticle();
    let categorybutton = document.getElementById(categoryid);
    data.forEach((element) => {
        if (element.category.id === categoryid) {
            categorybutton.insertAdjacentHTML('beforeEnd', `
                <div id="article${element.id}">
                    <span>작성자 : ${element.author}</span>                
                    <span onclick="detailArticle(${element.id})">${element.title}</span>
                </div>
            `);
        }
    });   
    categorybutton.insertAdjacentHTML('beforeend', `
        <button onclick="closeCategory(${categoryid})">닫기</button>
    `);
}

// 카테고리 조회
async function getCategory() {
    let response = await fetch(`${SERVER_URL}/blog/category`);
    let data = await response.json();
    return data;
}

getCategory().then(data => {
    let categorylist = document.getElementById('categorylist');
    data.forEach(element => {
        categorylist.insertAdjacentHTML('beforeEnd', `
            <button onclick="insertArticle(${element.id})">${element.name}</button>
            <div id="${element.id}">
            </div>
        `);
    })
});

//-------------------------------------------------
// 상세 내용 조회

async function getdetailArticle(id) {
    let response = await fetch(`${SERVER_URL}/blog/article/${id}`);
    let data = await response.json();
    return data;
}

async function insertdetailArticle (categoryid) {
    let data = await getdetailArticle(categoryid);
    let content = document.getElementById('detailcontent');
    let title = document.getElementById('detailtitle');
    content.value = data.content;
    title.innerHTML = data.title;
}

//-------------------------------------------------
// 상세 내용 수정
async function updateArticle(id, post) {
    let response = await fetch(`${SERVER_URL}/blog/article/${id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
        headers: {
            'Content-type': 'application/json'
        }
    });
    let data = await response.json();
    console.log(data);
}

async function updatePost () {
    let post = document.getElementById('detailcontent').value;

    let result = updateArticle(curdetailid, post);
    console.log(result.status);
}

//-------------------------------------------------
// 상세 내용 삭제
async function deletePost() {
    let response = await fetch(`${SERVER_URL}/blog/article/${curdetailid}`, {
        method: 'DELETE',
    });
    let data = await response.json();
    console.log(data);
}
