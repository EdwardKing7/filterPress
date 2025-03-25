// 账户信息悬浮框显示与隐藏
const accountTab = document.getElementById('account-tab');
const userInfoPopup = document.getElementById('user-info-popup');
const userNamePopup = document.getElementById('popup-username');
const userPhonePopup = document.getElementById('popup-phone');
const userEmailPopup = document.getElementById('popup-email');
const userRolePopup = document.getElementById('popup-role');

accountTab.addEventListener('mouseenter', () => {
    userInfoPopup.style.display = 'block';
});

accountTab.addEventListener('mouseleave', () => {
    userInfoPopup.style.display = 'none';
});



const productIdElement = document.getElementById('product-id');
const productCodeElement = document.getElementById('product-code');
const productNameElement = document.getElementById('product-name');
const originalPriceElement = document.getElementById('original-price');
const expectedPriceElement = document.getElementById('expected-price');
const productNumElement = document.getElementById('product_num');
const bargainAllowedElement = document.getElementById('bargain-allowed');
const productLocationElement = document.getElementById('product-location');
const productDescriptionElement = document.getElementById('product-description');
const contactPhoneElement = document.getElementById('contact-phone');

const showImageListElement = document.getElementById('show-image-list');
const showUploadInput = document.getElementById('show-upload-input');
const showUploadButton = document.getElementById('show-upload-button');

const detailImageListElement = document.getElementById('detail-image-list');
const detailUploadInput = document.getElementById('detail-upload-input');
const detailUploadButton = document.getElementById('detail-upload-button');
const toDetailHref = document.getElementById('to-detail-href');
const publishForm = document.getElementById('publish-form');

// 创建 URLSearchParams 对象
const urlParams = new URLSearchParams(window.location.search);

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

// 从url地址中获取用户信息
function getOriginProductInfoFromUrl(){
    // 拿到被编码过的产品对象字符串
    const encodeProductInfoStr = urlParams.get('productInfoStr');
    if (!encodeProductInfoStr) {
        console.log("页面代码异常，请返回重新跳转操作！");
        return;
    }
    // 反编码
    const productInfoStr = decodeURIComponent(encodeProductInfoStr);
    if (!productInfoStr) {
        console.log("页面代码解码异常，请返回重新跳转操作！");
        return;
    }
    // 将字符串改回json对象
    const productInfo = JSON.parse(productInfoStr);
    if (!productInfo) {
        console.log("页面代码解码json异常，请返回重新跳转操作！");
        return;
    }
    console.log("originProductInfo", productInfo);
    return productInfo;
}

// 判断编辑页的内容是否发生改变
function checkIfHasChanges(){
    const originProductInfo = getOriginProductInfoFromUrl();
    console.log("originProductInfo",originProductInfo);

    const productName = document.getElementById('product-name').value;
    const originalPrice = document.getElementById('original-price').value;
    const expectedPrice = document.getElementById('expected-price').value;
    const productNum = document.getElementById('product_num').value;
    const bargainAllowed = document.getElementById('bargain-allowed').value === 'yes'? 1 : 0;
    const productLocation = document.getElementById('product-location').value;
    const productDescription = document.getElementById('product-description').value;
    const contactPhone = document.getElementById('contact-phone').value;
    let result = {};
    let hasChanged = false;
    let changeContent = [];

    if (productName != originProductInfo.product_name) {
        hasChanged = true;
        changeContent.push("productName");
    }

    if (originalPrice != originProductInfo.origin_price) {
        hasChanged = true;
        changeContent.push("originalPrice");
    }

    if (expectedPrice != originProductInfo.expect_price) {
        hasChanged = true;
        changeContent.push("expectedPrice");
    }

    if (productNum != originProductInfo.product_num) {
        hasChanged = true;
        changeContent.push("productNum");
    }

    if (bargainAllowed != originProductInfo.bargain_allowed) {
        hasChanged = true;
        changeContent.push("bargainAllowed");
    }

    if (productLocation != originProductInfo.product_addr) {
        hasChanged = true;
        changeContent.push("productLocation");
    }

    if (productDescription != originProductInfo.product_desc) {
        hasChanged = true;
        changeContent.push("productDescription");
    }

    if (contactPhone != originProductInfo.product_owner_phone) {
        hasChanged = true;
        changeContent.push("contactPhone");
    }

    const productPicSrc = originProductInfo.product_pic_src;
    
    let showPicDeleted = '';
    //检查图片是否减少
    const showImage = getCurrentImages('showImage');
    console.log("showImage",showImage);
    if ( showImage && showImage.length > 0 ) {
        const showImageOne = showImage[0];
        if ( productPicSrc != showImageOne ) {
            hasChanged = true;
            showPicDeleted = productPicSrc;
        }

        if (!showImageOne.startsWith("http://")) {
            hasChanged = true;
        }
    }

    let detailPicDeleted = [];
    const detailPics = originProductInfo.detail_pics;
    const detailImages = getCurrentImages('detailImage');
    console.log("detailImages",detailImages);
    if ( detailPics && detailPics.length > 0 ) {
        detailPics.forEach(detailPic=>{
            if ( !detailImages.includes(detailPic) ) {
                hasChanged = true;
                detailPicDeleted.push(detailPic);
            }

            if ( !detailPic.startsWith("http://")) {
                hasChanged = true;
            }
        });
    }

    if ( detailImages && detailImages.length > 0) {
        detailImages.forEach(detailImage=>{
            if ( !detailImage.startsWith("http://")) {
                hasChanged = true;
            }
        });
    }

    result.hasChanged = hasChanged;
    result.showPicDeleted = showPicDeleted;
    result.detailPicDeleted = detailPicDeleted;
    result.changeContent = changeContent;

    return result;
}



//提交编辑表单
publishForm.addEventListener('submit', function (e) {
    e.preventDefault();

    //先检查编辑的数据是否已经发生变化
    const ifChanges = checkIfHasChanges();
    console.log("ifChanges：",ifChanges);

    if (! ifChanges.hasChanged ) {
        alert("页面数据未发生变化，无需保存提交！");
        return;
    }

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
            const ifChangesJsonString = JSON.stringify(ifChanges);
            // 对 JSON 字符串进行 URL 编码
            const ifChangesStr = encodeURIComponent(ifChangesJsonString);
            publishForm.action = "/api/publishs/updateProduct?tokenId=" + tokenId + "&ifChanges=" + ifChangesStr;
            publishForm.submit();
        } else {
            alert("你尚未登录或登录状态异常，无权发布产品，请登录后再发布！");
        }
    }
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

async function editproductInit(){

    // 获取特定的参数
    const from = urlParams.get('from');
    const productId = urlParams.get('id');
    if (from === 'detail') {
        toDetailHref.href = '/detail?id='+productId;
    } else {
        toDetail.style.display = 'none';
    }

    //处理登录的用户数据
    const tokenId = localStorage.getItem('tokenId');
    const userInfoStr = localStorage.getItem('userInfo');
    if (tokenId && userInfoStr) {
        const userInfoFromServer = await getUserInfoByTokenId(tokenId);
        if (userInfoFromServer.status === 'error') {
            window.location.href = "/login";
            return;
        } else {
            const userInfo = JSON.parse(userInfoStr);
            userNamePopup.textContent = userInfo.name;
            userPhonePopup.textContent = userInfo.phone;
            userEmailPopup.textContent = userInfo.email;
            userRolePopup.textContent = userInfo.roles;

            accountTab.textContent = userInfo.name;
            accountTab.style.display = 'block';
            showSystemAdmin(userInfo);
        }
    } else {
        window.location.href = "/login";
        return;
    }
    if (!tokenId) {
        console.log("tokenId",tokenId);
        window.location.href = "/login";
    } else {
        let response = await getUserInfoByTokenId(tokenId);
        console.log(response);
        if (!response) {
            console.log("response",response);
            window.location.href = "/login";
        } else {
            if (response.status != "success") {
                console.log("responseStatus",response.status);
                window.location.href = "/login";
            } else {
                const productInfo = getOriginProductInfoFromUrl();
                if (productInfo) {
                    // 将产品的数据回写到编辑的页面上
                    productIdElement.value = productInfo.id;
                    productCodeElement.value = productInfo.product_code;
                    productNameElement.value = productInfo.product_name;
                    originalPriceElement.value = productInfo.origin_price;
                    expectedPriceElement.value = productInfo.expect_price;
                    productNumElement.value = productInfo.product_num;
                    bargainAllowedElement.value = productInfo.bargain_allowed === 0 ? 'no' : 'yes';
                    productLocationElement.value = productInfo.product_addr;
                    productDescriptionElement.value = productInfo.product_desc;
                    contactPhoneElement.value = productInfo.product_owner_phone;
                    initialShowImage.push(productInfo.product_pic_src);
                    const detailPics = productInfo.detail_pics;
                    if (detailPics && detailPics.length >0 ) {
                        initialDetailImages.push(...detailPics);
                    }
                    // 初始化展示封面图
                    displayImages(initialShowImage, 'showImage');
                    // 初始化展示详情图
                    displayImages(initialDetailImages, 'detailImages');
                } else {
                    alert("url未得到产品信息，请重试！");
                }
            }
        }
    }
}

editproductInit();


















