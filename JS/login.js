document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('登录成功！欢迎进入杜甫草堂数字展馆。');
    });
  });