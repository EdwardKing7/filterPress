// 获取左侧导航栏的链接
const sidebarLinks = document.querySelectorAll('.sidebar ul li a');

// 为每个链接添加点击事件监听器
sidebarLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // 移除所有链接的 active 类
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });

        // 移除所有页面的 active 类
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // 获取点击链接对应的目标页面 ID
        const targetId = this.getAttribute('data-target');
        const targetPage = document.getElementById(targetId);

        // 为目标链接和目标页面添加 active 类
        this.classList.add('active');
        targetPage.classList.add('active');
    });
});


// 查看已登录账户详情和退出登录功能
const viewUserInfo = document.getElementById('account-tab');
const logout = document.getElementById('logout');
const userInfoPopup = document.getElementById('user-info-popup');
const updateItemsCache = document.getElementById('update-items-cache');
const updateCacheStatus = document.getElementById('update-Cache-status');
const pageBaseDataForm = document.getElementById('page-base-data-form');

pageBaseDataForm.addEventListener('submit', function(e){
    e.preventDefault();
    const isConfirmed = confirm(`确认要提交吗？`);
    if (!isConfirmed) {
        e.preventDefault(); // 阻止表单提交
    } else {
        const tokenId = localStorage.getItem('tokenId');
        console.log("tokenId",tokenId);
        pageBaseDataForm.action = "/api/items/save?tokenId=" + tokenId;
        pageBaseDataForm.submit();
    }
});
//更新items缓存
updateItemsCache.addEventListener('click', async function () {
    try {
        updateCacheStatus.innerHTML = "<h1 style='color: rgb(60, 79, 141);'>&emsp;更新中......</h1>";
        //处理登录的用户数据
        const tokenId = localStorage.getItem('tokenId');
        const response = await axios.get('/api/items/updateCache', {
            headers: {
                'tokenId': tokenId
            }
        });
        let result = response.data;
        console.log(result);
        updateCacheStatus.innerHTML = "<h1 style='color: green;'>缓存更新成功！</h1>";
    } catch (error) {
        console.error(error);
        updateCacheStatus.innerHTML = "<h1 style='color: red;'>缓存更新失败！</h1>";
    }
});

viewUserInfo.addEventListener('click', function () {
    userInfoPopup.style.display = 'block';
});

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

// 点击页面其他地方关闭用户信息悬浮框
document.addEventListener('click', function (e) {
    if (!userInfoPopup.contains(e.target) && e.target!== viewUserInfo) {
        userInfoPopup.style.display = 'none';
    }
});

// 登录管理 - 查看详情和删除功能
const viewDetailButtons = document.querySelectorAll('.view-detail');
const deleteRecordButtons = document.querySelectorAll('.delete-record');
const loginDetailPopup = document.getElementById('login-detail-popup');
const closeLoginDetail = document.getElementById('close-login-detail');

viewDetailButtons.forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const loginId = row.cells[0].textContent;
        const username = row.cells[1].textContent;
        const loginTime = row.cells[2].textContent;
        const loginIp = row.cells[3].textContent;

        document.getElementById('detail-login-id').textContent = loginId;
        document.getElementById('detail-username').textContent = username;
        document.getElementById('detail-login-time').textContent = loginTime;
        document.getElementById('detail-login-ip').textContent = loginIp;

        loginDetailPopup.style.display = 'block';
    });
});

deleteRecordButtons.forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        if (confirm('确定要删除这条登录记录吗？')) {
            row.remove();
        }
    });
});

closeLoginDetail.addEventListener('click', function () {
    loginDetailPopup.style.display = 'none';
});

// 账户管理 - 编辑功能
const editAccountButtons = document.querySelectorAll('.edit-account');
const accountEditPopup = document.getElementById('account-edit-popup');
const accountEditForm = document.getElementById('account-edit-form');
const closeAccountEdit = document.getElementById('close-account-edit');

editAccountButtons.forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const username = row.cells[1].textContent;
        const email = row.cells[2].textContent;

        document.getElementById('edit-account-username').value = username;
        document.getElementById('edit-account-email').value = email;

        accountEditPopup.style.display = 'block';
    });
});

accountEditForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // 这里可以添加实际的保存编辑后账户信息的逻辑
    alert('账户信息已保存');
    accountEditPopup.style.display = 'none';
});

closeAccountEdit.addEventListener('click', function () {
    accountEditPopup.style.display = 'none';
});

// 角色管理 - 编辑功能
const editRoleButtons = document.querySelectorAll('.edit-role');
const roleEditPopup = document.getElementById('role-edit-popup');
const roleEditForm = document.getElementById('role-edit-form');
const closeRoleEdit = document.getElementById('close-role-edit');

editRoleButtons.forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const roleCode = row.cells[1].textContent;
        const roleName = row.cells[2].textContent;
        const permission = row.cells[3].textContent;

        document.getElementById('edit-role-code').value = roleCode;
        document.getElementById('edit-role-name').value = roleName;
        document.getElementById('edit-role-permission').value = permission;

        roleEditPopup.style.display = 'block';
    });
});

roleEditForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // 这里可以添加实际的保存编辑后角色信息的逻辑
    alert('角色信息已保存');
    roleEditPopup.style.display = 'none';
});

closeRoleEdit.addEventListener('click', function () {
    roleEditPopup.style.display = 'none';
});

// 页面数据管理 - 文本编辑功能
const editTextButtons = document.querySelectorAll('.edit-text');
const textEditPopup = document.getElementById('text-edit-popup');
const editTextarea = document.getElementById('edit-textarea');
const saveEditedText = document.getElementById('save-edited-text');
const closeTextEdit = document.getElementById('close-text-edit');
const savePageData = document.getElementById('save-page-data');
const toLogin = document.getElementById('to-login');
const accountTab = document.getElementById('account-tab');
const userNamePopup = document.getElementById('popup-username');
const userPhonePopup = document.getElementById('popup-phone');
const userEmailPopup = document.getElementById('popup-email');
const userRolePopup = document.getElementById('popup-role');

let currentEditableField;

editTextButtons.forEach(button => {
    button.addEventListener('click', function () {
        currentEditableField = this.previousElementSibling;
        const text = currentEditableField.textContent;
        editTextarea.value = text;
        textEditPopup.style.display = 'block';
    });
});

saveEditedText.addEventListener('click', function () {
    const newText = editTextarea.value;
    currentEditableField.textContent = newText;
    textEditPopup.style.display = 'none';
});

closeTextEdit.addEventListener('click', function () {
    textEditPopup.style.display = 'none';
});

// 账户信息悬浮框显示与隐藏
accountTab.addEventListener('mouseenter', function () {
    userInfoPopup.style.display = 'block';
});

accountTab.addEventListener('mouseleave', function () {
    userInfoPopup.style.display = 'none';
});


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

async function getItems(){
    try {
        const response = await axios.get('/api/items');
        let result = response.data;
        return result;
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=admin&errorFromFunc=getItems&errorInfo='+errorStackToEncodedString(error);
    }
}

const companySimpleName = document.getElementById("company-simple-name");
const companyFullName = document.getElementById("company-full-name");
const companySlogan = document.getElementById("company-slogan");
const companyProfile = document.getElementById("company-profile");
const companyAdvantage = document.getElementById("company-advantage");
const copyrightYear = document.getElementById("copyright-year");

const companyAddress = document.getElementById("company-address");
const companyContact = document.getElementById("company-contact");
const companyEmail = document.getElementById("company-email");
const companyWorkTime = document.getElementById("company-work-time");

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
    //处理登录的用户数据
    const tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');
    console.log("userInfoStr：",userInfoStr);
    if (tokenId && userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        userNamePopup.textContent = userInfo.name;
        userPhonePopup.textContent = userInfo.phone;
        userEmailPopup.textContent = userInfo.email;
        userRolePopup.textContent = userInfo.roles;
        accountTab.textContent = userInfo.name;
        toLogin.style.display = 'none';
        showSystemAdmin(userInfo);
    } else {
        accountTab.style.display = 'none';
        logout.style.display = 'none';
    }

    //页面数据回显
    const items = await getItems();
    console.log("items：",items);
    companySimpleName.value = items.cor_name.item_value;
    companyFullName.value = items.cor_full_name.item_value;
    companySlogan.value = items.cor_slogan.item_value;
    companyProfile.textContent = items.cor_profile.item_value;
    companyAdvantage.textContent = items.cor_merit.item_value;
    copyrightYear.value = items.copyright_year.item_value;
    companyAddress.value = items.cor_address.item_value;
    companyContact.value = items.cor_phone.item_value;
    companyEmail.value = items.cor_email.item_value;
    companyWorkTime.value = items.work_time.item_value;
}



currentPageInit();