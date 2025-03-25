// 处理登录页和注册页的切换
const goToRegister = document.getElementById('go-to-register');
const goToLogin = document.getElementById('go-to-login');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

goToRegister.addEventListener('click', function (e) {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

goToLogin.addEventListener('click', function (e) {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// 注册表单提交事件处理
const registerFormElement = document.getElementById('register-form');
const registerError = document.getElementById('register-error');
const passwordInput = document.getElementById('register-password');
const confirmPasswordInput = document.getElementById('register-confirm-password');
const passwordStrengthBar = document.getElementById('password-strength-bar');
const passwordStrengthText = document.getElementById('password-strength-text');
const regSucMsgElement = document.getElementById('reg-suc-msg');
const regSucMsgTextElement = document.getElementById('reg-suc-msg-text');

// 计算密码强度
function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
}

// 更新密码强度条和文本
function updatePasswordStrength() {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    let width, color, text;
    switch (strength) {
        case 0:
        case 1:
            width = '20%';
            color = 'red';
            text = '弱';
            break;
        case 2:
        case 3:
            width = '50%';
            color = 'orange';
            text = '中';
            break;
        case 4:
        case 5:
            width = '100%';
            color = 'green';
            text = '强';
            break;
    }
    passwordStrengthBar.innerHTML = `<div style="width: ${width}; background-color: ${color};"></div>`;
    passwordStrengthText.textContent = `密码强度: ${text}`;
}

// 监听密码输入框的输入事件
passwordInput.addEventListener('input', updatePasswordStrength);

registerFormElement.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // 手机号和邮箱格式校验正则表达式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^1[3-9]\d{9}$/;

    if (!email &&!phone) {
        registerError.textContent = '手机号和邮箱二者必须选其一';
        return;
    }

    if (email &&!emailRegex.test(email)) {
        registerError.textContent = '请输入有效的邮箱地址';
        return;
    }

    if (phone &&!phoneRegex.test(phone)) {
        registerError.textContent = '请输入有效的手机号';
        return;
    }

    if (password!== confirmPassword) {
        registerError.textContent = '两次输入的密码不一致';
        return;
    }

    let selectParams = {name, email, phone, password };
    let result = await regValidate(selectParams);
    if (result) {
        if (result.status == "error") {
            registerError.textContent = result.msg;
            alert(result.msg);
            return;
        }
    }
    registerFormElement.submit();
    // 这里可以添加实际的注册逻辑，比如发送请求到后端
    registerError.textContent = '注册成功！';
    registerFormElement.reset();
    passwordStrengthBar.innerHTML = '';
    passwordStrengthText.textContent = '';

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

async function regValidate(selectParams){
    try {
        const response = await axios.get('/api/users/registerValidate', {
            params: selectParams
        });
        let result = response.data;
        return result;
    } catch (error) {
        console.error(error);
        window.location.href = '/clienterror?errorFromPage=login&errorFromFunc=regValidate&errorInfo='+errorStackToEncodedString(error);
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

function showSystemAdmin(userInfo){
    const systemAdmin = document.getElementById("system-admin");
    if (userInfo) {
        const rolesCodes = userInfo.rolesCodes;
        if (rolesCodes && ( rolesCodes.includes('sys_admin') || rolesCodes.includes('normal_admin') )) {
            systemAdmin.style.display = 'block';
        }
    }
}



// 创建 URLSearchParams 对象
const urlParams = new URLSearchParams(window.location.search);
// 获取特定的参数
let name = urlParams.get('name');
let account = urlParams.get('account');
let loginsucess = urlParams.get('loginsucess');
let loginFail = urlParams.get('loginFail');
async function loginPageInit() {
    //处理登录的用户数据
    const tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');
    console.log("userInfoStr：",userInfoStr);
    if (tokenId && userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        showSystemAdmin(userInfo);
    }


    if(loginsucess === "yes"){
        console.log("注册跳转至登录页：",{account,name,loginsucess});
        regSucMsgTextElement.textContent = "恭喜注册成功，你的账户名为：" + account + "，昵称为：" + name + "，可使用账户或者手机登录！";
        regSucMsgElement.style.display = 'block';
        alert("恭喜" +username+ "注册成功，可以登录了！");
    } else if (loginFail === "yes"){
        regSucMsgTextElement.textContent = "登录失败，账号密码或错误！";
        regSucMsgTextElement.style.color = 'red';
        regSucMsgElement.style.display = 'block';
    } else {
        //到登录页如果发现tokenId存在，则说明曾经登录过，这时需要校验登录状态是否已经过期
        tokenId = localStorage.getItem('tokenId');
        console.log("tokenId",tokenId);
        if (tokenId) {
            let userData = await getUserInfoByTokenId(tokenId);
            if (userData.status === 'error') {
                localStorage.removeItem('tokenId');
                localStorage.removeItem('userInfo');
                alert("你的登录已经过期请重新登录！");
            }
        }
    }
}

loginPageInit();