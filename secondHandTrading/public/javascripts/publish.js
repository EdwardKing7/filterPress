const publishForm = document.getElementById('publish-form');
const imagePreview = document.getElementById('image-preview');
const toDetail = document.getElementById('to-detail');
const toDetailHref = document.getElementById('to-detail-href');

const showImageListElement = document.getElementById('show-image-list');
const showUploadInput = document.getElementById('show-upload-input');
const showUploadButton = document.getElementById('show-upload-button');

const detailImageListElement = document.getElementById('detail-image-list');
const detailUploadInput = document.getElementById('detail-upload-input');
const detailUploadButton = document.getElementById('detail-upload-button');

// 账户信息悬浮框显示与隐藏
const accountTab = document.getElementById('account-tab');
const userInfoPopup = document.getElementById('user-info-popup');

accountTab.addEventListener('mouseenter', () => {
    userInfoPopup.style.display = 'block';
});

accountTab.addEventListener('mouseleave', () => {
    userInfoPopup.style.display = 'none';
});



const fileInput = document.getElementById('files');
const fileError = document.getElementById('fileError');

// 实际封面图
let initialShowImage = [];
// 实际详情图
let initialDetailImages = [];

// 展示封面图图片
function displayImages(images, imageType) {
    if (imageType === 'showImage') {
        showImageListElement.innerHTML = '';
        images.forEach(imageUrl => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('show-image-item');

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = '封面图';

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'X';
            deleteButton.onclick = () => removeImage(imageUrl, 'showImage');

            imageItem.appendChild(img);
            imageItem.appendChild(deleteButton);
            showImageListElement.appendChild(imageItem);
        });
    } else {
        detailImageListElement.innerHTML = '';
        console.log("详情图列表执行图片："+images.length+"张");
        images.forEach(imageUrl => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('detail-image-item');

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = '详情图';

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'X';
            deleteButton.onclick = () => removeImage(imageUrl, 'detailImage');

            imageItem.appendChild(img);
            imageItem.appendChild(deleteButton);
            detailImageListElement.appendChild(imageItem);
        });
    }
}

// 打开文件上传框
function openFileUpload(imageType) {
    if ( imageType === 'showImage' ) {
        showUploadInput.click();
    } else {
        detailUploadInput.click();
    }
}

// 处理封面图片上传
showUploadInput.addEventListener('change', function (e) {
    const files = e.target.files;
    const showImages = getCurrentImages('showImage');
    if ( showImages.length>0 ) {
        e.preventDefault();
        alert("封面图最多只能传1张！");
        return;
    } else {
        let newImages = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onloadend = function () {
                newImages.push(reader.result);
                displayImages([...showImages, ...newImages], 'showImage');
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }
    
});

//检查上传的详情文件是否符合标准
function checkFilesIfHasError() {
    const fileInput = document.getElementById('detail-upload-input');
    const fileError = document.getElementById('fileError');
    const files = fileInput.files;
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'video/mp4', 'video/avi', 'video/mov'];
    let hasError = false;
    fileError.textContent = '';
    for (let i = 0; i < files.length; i++) {
        console.log(56);
        const file = files[i];
        if (file.size > maxSize) {
            fileError.textContent = `文件 "${file.name}" 大小超过 50MB，请选择较小的文件。`;
            hasError = true;
            break;
        }

        if (!allowedTypes.includes(file.type)) {
            fileError.textContent = `文件 "${file.name}" 类型不支持，请选择图片或视频文件。`;
            hasError = true;
            break;
        }
    }
    return hasError;

}

// 处理详情图片上传
detailUploadInput.addEventListener('change', function (e) {
    const files = e.target.files;
    const detailImages = getCurrentImages('detailImage');
    const hasError = checkFilesIfHasError();
    if (hasError) {
        e.preventDefault();
        alert("文件不符合要求，问题详情看页面提示！");
        return;
    }
    if ( detailImages.length>9 ) {
        e.preventDefault();
        alert("详情图最多只能传10张！");
        return;
    } else {
        let newImages = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onloadend = function () {
                newImages.push(reader.result);
                displayImages([...detailImages, ...newImages], 'detailImage');
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }
        
    }
});


// 删除图片
function removeImage(imageUrl, imageType) {
    if (imageType === 'showImage') {
        const items = document.querySelectorAll('.show-image-item');
        items.forEach(item => {
            const img = item.querySelector('img');
            if (img.src === imageUrl) {
                item.remove();
            }
        });
    } else {
        const items = document.querySelectorAll('.detail-image-item');
        items.forEach(item => {
            const img = item.querySelector('img');
            if (img.src === imageUrl) {
                item.remove();
            }
        });
    }
}

// 获取当前展示的图片列表
function getCurrentImages(imageType) {
    if (imageType === 'showImage') {
        const imgElements = document.querySelectorAll('.show-image-item img');
        return Array.from(imgElements).map(img => img.src);
    } else {
        const imgElements = document.querySelectorAll('.detail-image-item img');
        return Array.from(imgElements).map(img => img.src);
    }
}



publishForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // 这里可以添加实际的表单提交逻辑，例如使用 AJAX 或表单默认提交
    console.log('所有文件通过校验，可以提交表单');
    const productName = document.getElementById('product-name').value;
    const originalPrice = document.getElementById('original-price').value;
    const expectedPrice = document.getElementById('expected-price').value;
    const productNum = document.getElementById('product_num').value;
    const bargainAllowed = document.getElementById('bargain-allowed').value;
    const productLocation = document.getElementById('product-location').value;
    const productDescription = document.getElementById('product-description').value;
    const contactPhone = document.getElementById('contact-phone').value;

    
    const isConfirmed = confirm(`产品名称: ${productName}\n原价: ${originalPrice}\n期望价格: ${expectedPrice}\n库存数量：${productNum}\n是否允许砍价: ${bargainAllowed}\n产品所在位置: ${productLocation}\n联系人方式：${contactPhone}\n产品描述：${productDescription}`);
    if (!isConfirmed) {
        e.preventDefault(); // 阻止表单提交
    } else {
        const tokenId = localStorage.getItem('tokenId');
        console.log("tokenId",tokenId);
        if(tokenId) {
            document.getElementById('publish-form').action = "/api/publishs/publish?tokenId=" + tokenId;
            publishForm.submit();
        } else {
            alert("你尚未登录或登录状态异常，无权发布产品，请登录后再发布！");
        }
    }
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

function showSystemAdmin(userInfo){
    const systemAdmin = document.getElementById("system-admin");
    if (userInfo) {
        const rolesCodes = userInfo.rolesCodes;
        if (rolesCodes && ( rolesCodes.includes('sys_admin') || rolesCodes.includes('normal_admin') )) {
            systemAdmin.style.display = 'block';
        }
    }
}

async function initPage(){
    // 创建 URLSearchParams 对象
    const urlParams = new URLSearchParams(window.location.search);

    // 获取特定的参数
    const from = urlParams.get('from');
    const productId = urlParams.get('id');
    if (from === 'detail') {
        toDetailHref.href = '/detail?id='+productId;
    } else {
        toDetail.style.display = 'none';
    }
    // 获取 Token
    const tokenId = localStorage.getItem('tokenId');
    if (!tokenId) {
        console.log("tokenId",tokenId);
        window.location.href = "/login";
    } else {
        let response = await getUserInfoByTokenId(tokenId);
        if (!response) {
            console.log("response",response);
            window.location.href = "/login";
        } else {
            if (response.status != "success") {
                console.log("responseStatus",response.status);
                window.location.href = "/login";
            } else {
                const userInfoOut = response.userInfo;
                if (userInfoOut) {
                    const userInfo = userInfoOut.userInfo;
                    showSystemAdmin(userInfo);
                    console.log("当前为登录状态，可以使用当前页面！");
                }
            }
        }
    }
}

initPage();

