import { Semaphore } from './utils/Semaphore.js';

let currentPage = 1;
const pageSize = 2;
const productList = document.getElementById('product-list');
const searchName = document.getElementById('search-name');
// 获取按钮元素
const searchButton = document.getElementById('searchButton');
const sortTime = document.getElementById('sort-time');
const sortPrice = document.getElementById('sort-price');
const expectPrice = document.getElementById('expect-price');
const bargainFilter = document.getElementById('bargain-filter');
const toLogin = document.getElementById('to-login');
const accountTab = document.getElementById('account-tab');
const userInfoPopup = document.getElementById('user-info-popup');
const userNamePopup = document.getElementById('popup-username');
const userPhonePopup = document.getElementById('popup-phone');
const userEmailPopup = document.getElementById('popup-email');
const userRolePopup = document.getElementById('popup-role');
const logout = document.getElementById('logout');
const publishProduct = document.getElementById('publish-product');




// 渲染产品列表
function renderProducts(data) {
    console.log("renderProducts");
    let listData = data.list;
    let config = data.config;
    listData.forEach(product => {
        const item = document.createElement('a');
        item.href = `detail?id=${product.id}`;
        item.classList.add('product-item');
        item.innerHTML = `
            <img src="${config.imagesServer + product.product_pic_src}" alt="${product.product_name}">
            <h3>${product.product_name}</h3>
            <hh2>原价: ￥${product.origin_price}</hh2>
            <h4>出售价格: ￥${product.expect_price}</h4>
            <h2>数量：${product.product_num}</h2>
            
        `;
        productList.appendChild(item);
    });
}
async function getDataFromProducts(selectParams){
    try {
        // const tokenId = localStorage.getItem('tokenId');
        const response = await axios.get('/api/products/search', {
            params: selectParams
            // headers: {
            //     //注意headers的变量名会被强制转成小写
            //     'tokenid': tokenId
            // }
        });
        let result = response.data;
        return result;
    } catch (error) {
        console.error(error);
        return {"rspCode":"error"};
    }
}


// 过滤和排序数据
async function filterAndSortData() {
    const searchValue = searchName.value.toLowerCase();
    const selectedTimeSort = sortTime.value;
    const selectedPriceSort = sortPrice.value;
    const expectPriceSort = expectPrice.value;
    const selectedBargain = bargainFilter.value;
    let selectParams = {};
    // 按名称搜索
    if (searchValue) {
        selectParams.name = searchValue.toLowerCase();
    }

    // 按是否允许砍价筛选
    if (selectedBargain === 'yes') {
        selectParams.isBargain = true;
    } else if (selectedBargain === 'no') {
        selectParams.isBargain = false;
    }

    // 按发布时间排序
    if (selectedTimeSort === 'asc') {
        selectParams.sortByPublish = "add_time";
        selectParams.sortByPublishOrder = "asc";
    } else if (selectedTimeSort === 'desc') {
        selectParams.sortByPublish = "add_time";
        selectParams.sortByPublishOrder = "desc";
    }

    // 按原价排序
    if (selectedPriceSort === 'asc') {
        selectParams.sortByPrice = "origin_price";
        selectParams.sortByPriceOrder = "asc";
    } else if (selectedPriceSort === 'desc') {
        selectParams.sortByPrice = "origin_price";
        selectParams.sortByPriceOrder = "desc";
    }

    // 按预估排序
    if (expectPriceSort === 'asc') {
        selectParams.sortByExpectPrice = "expect_price";
        selectParams.sortByExpectPriceOrder = "asc";
    } else if (expectPriceSort === 'desc') {
        selectParams.sortByExpectPrice = "expect_price";
        selectParams.sortByExpectPriceOrder = "desc";
    }

    selectParams.page = currentPage;
    selectParams.limit = 10;
    return await getDataFromProducts(selectParams);
}

const semaphoreSafeRender = new Semaphore(1);
async function safeRender(filteredData){
    await semaphoreSafeRender.acquire();
    try {
        renderProducts(filteredData);
        currentPage++;
    } finally {
        semaphoreSafeRender.release();
    }
}
const semaphoreSafeLoadMore = new Semaphore(1);
// 加载更多产品
async function loadMoreProducts() {
    console.log("semaphoreSafeLoadMore.acquire come","current",semaphoreSafeLoadMore.current,"concurrency",semaphoreSafeLoadMore.concurrency);
    await semaphoreSafeLoadMore.acquire();
    console.log("semaphoreSafeLoadMore.acquire pass");
    try {
        const filteredData = await filterAndSortData();
        if(filteredData.list){
            if (filteredData.list.length > 0) {
                await safeRender(filteredData);
            }
        }
    } finally {
        console.log("semaphoreSafeLoadMore.release come");
        semaphoreSafeLoadMore.release();
        console.log("semaphoreSafeLoadMore.release pass","current",semaphoreSafeLoadMore.current,"concurrency",semaphoreSafeLoadMore.concurrency);
    }
}
const scrollSemaphore = new Semaphore(1);
// 滚动加载监听
window.addEventListener('scroll', async function () {
    console.log("scrollSemaphore.acquire come","current",scrollSemaphore.current,"concurrency",scrollSemaphore.concurrency);
    await scrollSemaphore.acquire();
    console.log("scrollSemaphore.acquire pass");
    try {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            console.log("i am scroll");
            await loadMoreProducts();
        }
    } finally {
        console.log("scrollSemaphore.release come");
        scrollSemaphore.release();
        console.log("scrollSemaphore.release pass","current",scrollSemaphore.current,"concurrency",scrollSemaphore.concurrency);
    }
});
const semaphoreCleanLoad = new Semaphore(1);
async function cleanLoadMoreProducts(){
    console.log("semaphoreCleanLoad.acquire come","current",semaphoreCleanLoad.current,"concurrency",semaphoreCleanLoad.concurrency);
    await semaphoreCleanLoad.acquire();
    console.log("semaphoreCleanLoad.acquire pass");
    try {
        currentPage = 1;
        productList.innerHTML = '';
        await loadMoreProducts();
    } finally {
        console.log("semaphoreCleanLoad.release come");
        semaphoreCleanLoad.release();
        console.log("semaphoreCleanLoad.release pass","current",semaphoreCleanLoad.current,"concurrency",semaphoreCleanLoad.concurrency);
    }
}
searchButton.addEventListener('click', async function() {
    console.log("i am searchButton");
    console.log("searchButton");
    await cleanLoadMoreProducts()
});

sortTime.addEventListener('change', async function () {
    console.log("i am sortTime");
    await cleanLoadMoreProducts()
});

sortPrice.addEventListener('change', async function () {
    console.log("i am sortPrice");
    await cleanLoadMoreProducts()
});

expectPrice.addEventListener('change', async function () {
    console.log("i am expectPrice");
    await cleanLoadMoreProducts()
});

bargainFilter.addEventListener('change', async function () {
    console.log("i am bargainFilter");
    await cleanLoadMoreProducts()
});

// 账户信息悬浮框显示与隐藏
accountTab.addEventListener('mouseenter', function () {
    userInfoPopup.style.display = 'block';
});

accountTab.addEventListener('mouseleave', function () {
    userInfoPopup.style.display = 'none';
});



// 定义一个 sleep 函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function getUserInfoByTokenId(tokenId){
    try {
        let selectParams = {tokenId};
        const response = await axios.get('/api/users/getUserInfoByTokenId', {
            params: selectParams,
            headers: {
                'tokenId': tokenId
            }
        });
        let result = response.data;
        return result;
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=product&errorFromFunc=getUserInfoByTokenId&errorInfo='+errorStackToEncodedString(error);
        
    }
}



async function loginHandle(){
    // 创建 URLSearchParams 对象
    const urlParams = new URLSearchParams(window.location.search);
    // 获取特定的参数
    let loginsucess = urlParams.get('loginsucess');
    let tokenId = urlParams.get('tokenId');
    if (loginsucess && tokenId) {
        // 存储 Token 到 localStorage
        localStorage.setItem('tokenId', tokenId);
        // 将登录的用户给按钮已登录用户赋值
        let response = await getUserInfoByTokenId(tokenId);
        if (response) {
            if (response.status === "success") {
                let userInfoData = response.userInfo;
                if (userInfoData) {
                    let userInfo = userInfoData.userInfo;
                    if (userInfo) {
                        console.log("根据tokenId：" + tokenId + "查出来的用户信息：",userInfo);
                        // 存储 Token 到 localStorage
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        userNamePopup.textContent = userInfo.name;
                        userPhonePopup.textContent = userInfo.phone;
                        userEmailPopup.textContent = userInfo.email;
                        userRolePopup.textContent = userInfo.roles;
                        console.log("登录成功，跳转过来了！用户名：", userInfo.name);
                        accountTab.textContent = userInfo.name;
                        toLogin.style.display = 'none';
                        return;
                    }
                }
            }
        }
    }
    // 获取 Token
    tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');
    if (tokenId && userInfoStr) {
        const userInfoFromServer = await getUserInfoByTokenId(tokenId);
        if (userInfoFromServer.status === 'error') {
            localStorage.removeItem('tokenId');
            localStorage.removeItem('userInfo');
            accountTab.style.display = 'none';
            logout.style.display = 'none';
            publishProduct.style.display = 'none';
        } else {
            const userInfo = JSON.parse(userInfoStr);
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
        publishProduct.style.display = 'none';
    }
}

function showSystemAdmin(userInfo){
    const systemAdmin = document.getElementById("system-admin");
    if (userInfo) {
        const rolesCodes = userInfo.rolesCodes;
        if (rolesCodes && ( rolesCodes.includes('sys_admin') || rolesCodes.includes('normal_admin') )) {
            systemAdmin.style.display = 'block';
        }
    }
}

async function currentPageInit(){
    //处理登录用户的数据
    await loginHandle();
    
    //处理登录的用户数据
    const tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');
    console.log("userInfoStr：",userInfoStr);
    if (tokenId && userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        showSystemAdmin(userInfo);
    }

    
    sleep(2);
    console.log("i am init");
    // 初始加载
    await loadMoreProducts();
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
                    'tokenId': tokenId
                }
            });
            let result = response.data;
            console.log(result);
        }
        window.location.href = '/product';
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=product&errorFromFunc=logoutAddEventListener&errorInfo='+errorStackToEncodedString(error);
    }
});

currentPageInit();
