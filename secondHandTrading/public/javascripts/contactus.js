// 页面加载完成后显示内容
window.onload = function () {
    document.body.style.visibility = 'visible';
};
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const phoneRegex = /^1[3-9]\d{9}$/;

    if (!phone &&!email) {
        alert('手机号码和邮箱至少需要填写一个');
        return;
    }

    if (phone &&!phoneRegex.test(phone)) {
        alert('请输入正确的11位手机号码');
        return;
    }

    // 这里可以添加实际的表单提交逻辑，例如使用 AJAX 发送数据到服务器
    contactForm.submit();
});

function showSystemAdmin(userInfo){
    const systemAdmin = document.getElementById("system-admin");
    if (userInfo) {
        const rolesCodes = userInfo.rolesCodes;
        if (rolesCodes && ( rolesCodes.includes('sys_admin') || rolesCodes.includes('normal_admin') )) {
            systemAdmin.style.display = 'block';
        }
    }
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

const companyAddress = document.getElementById("company-address");
const companyPhone = document.getElementById("company-phone");
const companyEmail = document.getElementById("company-email");
const companyWorkTime = document.getElementById("company-work-time");

async function initContactus(){
    // 创建 URLSearchParams 对象
    const urlParams = new URLSearchParams(window.location.search);
    // 获取特定的参数
    let addmassages = urlParams.get('addmassages');
    if (addmassages && addmassages === "success") {
        alert('你的留言已提交，我们会尽快与你联系！');
    }

    //处理登录的用户数据
    const tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');
    console.log("userInfoStr：",userInfoStr);
    if (tokenId && userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        showSystemAdmin(userInfo);
    }

    //页面数据回显
    const items = await getItems();
    console.log("items：",items);
    companyAddress.textContent = items.cor_address.item_value;
    companyPhone.textContent = items.cor_phone.item_value;
    companyEmail.textContent = items.cor_email.item_value;
    companyWorkTime.textContent = items.work_time.item_value;
    
}

initContactus();