document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
  
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
  
    let valid = true;
    if (!username || username.length < 2 || username.length > 12) {
      document.getElementById('usernameError').textContent = '雅号需2-12个字符';
      valid = false;
    }
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      document.getElementById('phoneError').textContent = '请输入有效的11位中国大陆手机号';
      valid = false;
    }
    const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/;
    if (!pwdRegex.test(password)) {
      document.getElementById('passwordError').textContent = '密码需8-20位，包含字母和数字';
      valid = false;
    }
  
    if (valid) {
      setTimeout(() => {
        document.querySelector('.form-container form').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        console.log('注册数据:', { username, phone, password });
      }, 500);
    }
  });