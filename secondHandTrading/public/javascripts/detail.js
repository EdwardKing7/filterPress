// 账户信息悬浮框显示与隐藏
const accountTab = document.getElementById('account-tab');
const userInfoPopup = document.getElementById('user-info-popup');

accountTab.addEventListener('mouseenter', () => {
    userInfoPopup.style.display = 'block';
});

accountTab.addEventListener('mouseleave', () => {
    userInfoPopup.style.display = 'none';
});

// 图片切换功能
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const productImage = document.getElementById('product-image');
const productName = document.getElementById('productName');
const originPrice = document.getElementById('originPrice');
const expectPrice = document.getElementById('expectPrice');
const productNum = document.getElementById('productNum');
const barginAllowed = document.getElementById('barginAllowed');
const productLocation = document.getElementById('productLocation');
const contactPhone = document.getElementById('contactPhone');
const productDescription = document.getElementById('productDescription');
const addTime = document.getElementById('addTime');
const userNamePopup = document.getElementById('popup-username');
const userPhonePopup = document.getElementById('popup-phone');
const userEmailPopup = document.getElementById('popup-email');
const userRolePopup = document.getElementById('popup-role');
const logout = document.getElementById('logout');
const editProduct = document.getElementById('edit-product');
const deleteProduct = document.getElementById('delete-product');
const toLogin = document.getElementById('to-login');
const publishProduct = document.getElementById('publish-product');
const publishProductHref = document.getElementById('publish-product-href');

// 模拟图片数组，实际应用中可从接口获取
const images = [];

// 将error对象转成可以在url传递的字符串
function errorStackToEncodedString(error){
    const errorObj = {
        name: error.name,
        message: error.message,
        stack: error.stack
    };
    const errorJsonString = JSON.stringify(errorObj);
    // 对 JSON 字符串进行 URL 编码
    return encodeURIComponent(errorJsonString);
}

async function getProductDetails(productId){
    try {
        // const tokenId = localStorage.getItem('tokenId');
        const response = await axios.get('/api/products/getProductById', {
            params: {productId: productId}
            // headers: {
            //     //注意headers的变量名会被强制转成小写
            //     'tokenid': tokenId
            // }
        });
        let result = response.data;
        return result;
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=detail&errorFromFunc=getProductDetails&errorInfo='+errorStackToEncodedString(error);
    }
}

async function getUserInfoByTokenId(tokenId){
    try {
        let selectParams = {tokenId};
        const response = await axios.get('/api/users/getUserInfoByTokenId', {
            params: selectParams
        });
        let result = response.data;
        return result;
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=login&errorFromFunc=getUserInfoByTokenId&errorInfo='+errorStackToEncodedString(error);
    }
}

let productInfo = {};
const urlParams = new URLSearchParams(window.location.search);
// 获取产品id
const productId = urlParams.get('id');
console.log("productId:", productId);

function showSystemAdmin(userInfo){
    const systemAdmin = document.getElementById("system-admin");
    if (userInfo) {
        const rolesCodes = userInfo.rolesCodes;
        if (rolesCodes && ( rolesCodes.includes('sys_admin') || rolesCodes.includes('normal_admin') )) {
            systemAdmin.style.display = 'block';
        }
    }
}

async function init(){

    publishProductHref.href = '/publish?from=detail&id='+productId;

    let result = await getProductDetails(productId);
    console.log(result);
    if(result.data){
        productInfo = result.data;

        if (result.data.product_pic_src) {
            productImage.src = result.data.product_pic_src;
            images.push(result.data.product_pic_src);
        }
        if (result.data.detail_pics) {
            images.push(...result.data.detail_pics);
        }

        productName.textContent = result.data.product_name;
        originPrice.innerHTML = "<span style='color:rgb(18, 9, 7); font-weight: bold;'>原&emsp;&emsp;价：</span>&emsp;<span style='text-decoration: line-through;color: red;'>" + result.data.origin_price+ "</span>";
        expectPrice.innerHTML = "<span style='color: rgb(18, 9, 7); font-weight: bold;'>出售价格：</span>&emsp;<span style='color: rgb(41, 225, 8);'>" + result.data.expect_price+ "</span>";
        productNum.innerHTML = "<span style='color: rgb(18, 9, 7); font-weight: bold;'>数&emsp;&emsp;量：</span>&emsp;<span style='color: rgb(141, 42, 3);'>" +result.data.product_num + "</span>";
        barginAllowed.innerHTML = result.data.bargain_allowed === 1 ? "<span style='color: rgb(18, 9, 7); font-weight: bold;'>可否砍价：</span>&emsp;<span style='color: rgb(41, 225, 8);'>允许</span>":"<span style='color: rgb(18, 9, 7); font-weight: bold;'>可否砍价：</span>&emsp;<span style='color: red;'>不允许</span>";
        productLocation.innerHTML = "<span style='color: rgb(18, 9, 7); font-weight: bold;'>所在地址：</span>&emsp;<span class='address-title'>" + result.data.product_addr + "</span>";
        contactPhone.innerHTML = "<span style='color: rgb(18, 9, 7); font-weight: bold;'>联系方式：</span>&emsp;" + result.data.product_owner_phone + `&emsp;<i class="fa-solid fa-phone phone-icon"></i>`;
        addTime.innerHTML = "<span style='color: rgb(18, 9, 7); font-weight: bold;'>发布时间：</span>&emsp;<span class='time-container'>" + result.data.add_time + "</span>";
        productDescription.innerHTML = "<span style='color: rgb(18, 9, 7); font-weight: bold;'>描&emsp;&emsp;述：</span>&emsp;<span class='product-description'>" + result.data.product_desc + "</span>";
    }

    //处理登录的用户数据
    const tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');

    if (tokenId && userInfoStr) {
        const userInfoFromServer = await getUserInfoByTokenId(tokenId);
        if (userInfoFromServer.status === 'error') {
            localStorage.removeItem('tokenId');
            localStorage.removeItem('userInfo');
            accountTab.style.display = 'none';
            logout.style.display = 'none';
            editProduct.style.display = 'none';
            deleteProduct.style.display = 'none';
            publishProduct.style.display = 'none';
        } else {
            const userInfo = JSON.parse(userInfoStr);
            showSystemAdmin(userInfo);
            userNamePopup.textContent = userInfo.name;
            userPhonePopup.textContent = userInfo.phone;
            userEmailPopup.textContent = userInfo.email;
            userRolePopup.textContent = userInfo.roles;

            accountTab.textContent = userInfo.name;
            toLogin.style.display = 'none';
        }
    } else {
        accountTab.style.display = 'none';
        logout.style.display = 'none';
        editProduct.style.display = 'none';
        deleteProduct.style.display = 'none';
        publishProduct.style.display = 'none';
    }

    // 产品评价相关的逻辑
    const comments = await getCommentsByProductCode(productInfo.product_code, tokenId);
    //重新刷新评论数据
    pageDisplayShow(comments);
}

init();



let currentImageIndex = 0;

prevButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    productImage.src = images[currentImageIndex];
});

nextButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    productImage.src = images[currentImageIndex];
});

// 提交评论功能
const commitHintInput = document.getElementById('commit-hint');
const commentInput = document.getElementById('comment-input');
const submitCommentButton = document.getElementById('submit-comment');
const commentList = document.querySelector('.comment-list');

commentInput.addEventListener('input', () => {
    commitHintInput.style.display = 'none';
});

submitCommentButton.addEventListener('click', async () => {
    // 获取 Token
    const tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');
    if (tokenId && userInfoStr) {
        console.log(userInfoStr);
        const userInfo = JSON.parse(userInfoStr);
        
    
        const commentText = commentInput.value;
        let commentJson = {};
        if (commentText.trim() == '') {
            commitHintInput.style.display = 'block';
        } else {
            
            commentJson.commentText = commentText;
            commentJson.userInfo = userInfo;
            commentJson.productInfo = productInfo;
            // 将新增评论入库
            const result = await saveCommentToDb(commentJson, tokenId);
            if (result.status === "error") {
                commitHintInput.textContent = result.msg;
                commitHintInput.style.display = 'block';
            } else {
                const comments = await getCommentsByProductCode(productInfo.product_code, tokenId);
                //重新刷新评论数据
                pageDisplayShow(comments);
            }
        }
    } else {
        window.location.href = "/login";
    }
});

function pageDisplayShow(comments) {
    if (comments) {
        commentList.innerHTML = '';
        comments.forEach(comment => {
            const newComment = document.createElement('div');
            newComment.classList.add('comment');
            newComment.innerHTML = `
                <p><strong>评论用户:</strong> ${comment.user_name}</p>
                <p><strong>评论内容:</strong> ${comment.comment}</p>
                <p><strong>评论时间:</strong> ${comment.add_time.toLocaleString()}</p>
            `;
            console.log("正在遍历中！");
            commentList.appendChild(newComment);
        });
    }
    commentInput.value = '';
}

// 根据产品编码获取评论
async function getCommentsByProductCode(productCode, tokenId){
    try {
        const response = await axios.get('/api/comments/getCommentsByProductCode', {
            params: {productCode},
            headers: {
                'tokenId': tokenId
            }
        });
        let result = response.data;
        return result;
    } catch (error) {
        console.error(req.logId, error);
        window.location.href = '/clienterror?errorFromPage=detail&errorFromFunc=getCommentsByProductCode&errorInfo='+errorStackToEncodedString(error);
    }
    
}

async function saveCommentToDb(commentJson, tokenId){
    try {
        const response = await axios.post('/api/comments/save', commentJson, { headers: { 'tokenid': tokenId } });
        const result = response.data;
        return result;
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=detail&errorFromFunc=saveCommentToDb&errorInfo='+errorStackToEncodedString(error);
    }
}

// 点击图片弹出大图
productImage.addEventListener('click', () => {
    openModal(productImage);
});

//以下代码是用来控制图片弹出的逻辑
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let scale = 1;
let container = document.getElementById('img-container');

function openModal(img) {
    const modal = document.getElementById('modal');
    const modalImg = modal.querySelector('.modal-img');
    
    modal.style.display = 'flex';
    modalImg.src = img.src;
    
    // 重置状态
    scale = 1;
    translateX = 0;
    translateY = 0;
    container = modal.querySelector('.img-container');
    updateTransform();
    // 新增滚轮事件监听
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // 添加事件监听
    container.addEventListener('mousedown', startDrag);
    container.addEventListener('touchstart', startDrag);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    
    // 移除滚轮监听
    container.removeEventListener('wheel', handleWheel);
    
    // 移除事件监听
    container.removeEventListener('mousemove', drag);
    container.removeEventListener('mouseup', endDrag);
    container.removeEventListener('touchmove', drag);
    container.removeEventListener('touchend', endDrag);
}

// 新增滚轮处理函数
function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale *= delta;
    scale = Math.min(Math.max(1, scale), 5);
    updateTransform();
}

// 拖拽相关函数
function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    startX = clientX - translateX;
    startY = clientY - translateY;

    container.addEventListener('mousemove', drag);
    container.addEventListener('mouseup', endDrag);
    container.addEventListener('touchmove', drag);
    container.addEventListener('touchend', endDrag);
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    translateX = clientX - startX;
    translateY = clientY - startY;
    
    updateTransform();
}

function endDrag() {
    isDragging = false;
    container.removeEventListener('mousemove', drag);
    container.removeEventListener('touchmove', drag);
}


// 缩放处理
container.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(1, scale), 5);
    updateTransform();
});

// 触摸缩放处理
let initialDistance = null;
container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
    }
});

container.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        const newDistance = getDistance(e.touches[0], e.touches[1]);
        scale = newDistance / initialDistance * scale;
        scale = Math.min(Math.max(1, scale), 5);
        initialDistance = newDistance;
        updateTransform();
    }
});

function getDistance(t1, t2) {
    return Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
    );
}

// 退出登录
logout.addEventListener('click', async function () {
    try {
        // 获取 Token
        const tokenId = localStorage.getItem('tokenId');
        localStorage.removeItem('tokenId');
        localStorage.removeItem('userInfo');

        if (tokenId) {
            let selectParams = {tokenId};
            const response = await axios.get('/api/users/logout', {
                params: selectParams,
                headers: {
                    //注意headers的变量名会被强制转成小写
                    'tokenid': tokenId
                }
            });
            let result = response.data;
            console.log(result);
        }
        location.reload();
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=detail&errorFromFunc=logoutAddEventListener&errorInfo='+errorStackToEncodedString(error);
    }
});

//获取当前登录用户信息
function getCurrentUserInfo(){
    const tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');
    let userInfo = {};
    if (tokenId && userInfoStr) {
        console.log(userInfoStr);
        userInfo = JSON.parse(userInfoStr);
    }
    return userInfo;
}

editProduct.addEventListener('click', async function () {
    try {
        const currentUserInfo = getCurrentUserInfo();
        if (currentUserInfo.account != productInfo.user_account) {
            alert("你不是此产品的创建者，没有权限编辑！");
        } else {
            // 将productInfo传递到编辑页面去
            console.log("待传对象：",productInfo);
            const productInfoJsonString = JSON.stringify(productInfo);
            // 对 JSON 字符串进行 URL 编码
            const productInfoStr = encodeURIComponent(productInfoJsonString);
            // 创建 URLSearchParams 对象
            window.location.href = '/editproduct?from=detail&id=' + productId + '&productInfoStr=' + productInfoStr;
        }
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=detail&errorFromFunc=deleteProductAddEventListener&errorInfo='+errorStackToEncodedString(error);
    }
});

// 删除产品
deleteProduct.addEventListener('click', async function () {
    try {
        const currentUserInfo = getCurrentUserInfo();
        if (currentUserInfo.account != productInfo.user_account && currentUserInfo.account != 'admin') {
            alert("你不是此产品的创建者，没有权限下架此产品！");
        } else {
            const isConfirmed = confirm(`你确认要下架产品：“${productInfo.product_name}”吗？`);
            if (isConfirmed) {
                // 获取 Token
                const tokenId = localStorage.getItem('tokenId');
                const productCode = productInfo.product_code;
                if (tokenId && productCode) {
                    let selectParams = {productCode};
                    const response = await axios.get('/api/products/deleteProductByCode', {
                        params: selectParams,
                        headers: {
                            //注意headers的变量名会被强制转成小写
                            'tokenid': tokenId
                        }
                    });
                    let result = response.data;
                    console.log(result);
                }
                window.location.href = '/product';
            }
        }
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=detail&errorFromFunc=deleteProductAddEventListener&errorInfo='+errorStackToEncodedString(error);
    }
});


// 更新变换
function updateTransform() {
    container.style.transform = `
        translate(${translateX}px, ${translateY}px)
        scale(${scale})
    `;
}
