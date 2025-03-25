// 获取视频元素和占位图片元素
const video = document.getElementById('video-player');
const placeholder = document.getElementById('placeholder-img');

// 监听视频的 canplaythrough 事件，当视频可以流畅播放时触发
video.addEventListener('canplaythrough', function () {
    // 隐藏占位图片
    placeholder.style.display = 'none';
    // 显示视频元素
    video.style.display = 'block';
    // 开始播放视频
    video.play();
});

// 页面加载完成后尝试播放视频
window.addEventListener('load', function () {
    // 设置视频静音
    video.muted = true;
    // 尝试播放视频
    video.play().catch(error => {
        console.error('视频播放出错:', error);
    });
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

//处理登录的用户数据
const tokenId = localStorage.getItem('tokenId');
const userInfoStr = localStorage.getItem('userInfo');
console.log("userInfoStr：",userInfoStr);
if (tokenId && userInfoStr) {
    const userInfo = JSON.parse(userInfoStr);
    showSystemAdmin(userInfo);
}