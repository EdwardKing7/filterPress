// 配置 Axios 拦截器，确保axios请求的接口在被中间件重定向的时候可以正确的重定向
axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        // 检查状态码和重定向标记
        if (status === 403 && data.redirect) {
          window.location.href = data.redirect; // 浏览器级跳转
        }
      }
      return Promise.reject(error);
    }
);