document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('poemSubmissionForm');
    const poemTextarea = document.getElementById('poemText');
    const wordCountEl = document.getElementById('wordCount');
    const aiCheckbox = document.getElementById('aiPolish');
    const polishTip = document.getElementById('polishTip');
    const successMessage = document.getElementById('successMessage');
    const backToTopBtn = document.getElementById('back-to-top');
    const selectContainer = document.getElementById('poemTypeContainer');
  const selectedEl = selectContainer.querySelector('.select-selected');
  const itemsEl = selectContainer.querySelector('.select-items');

  selectedEl.addEventListener('click', function () {
    itemsEl.style.display = itemsEl.style.display === 'block' ? 'none' : 'block';
  });

  document.querySelectorAll('.select-item').forEach(item => {
    item.addEventListener('click', function () {
      const value = this.getAttribute('data-value');
      selectedEl.textContent = value;
      itemsEl.style.display = 'none';

      const hiddenInput = document.getElementById('poemType');
      if (hiddenInput) {
        hiddenInput.value = value;
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!selectContainer.contains(e.target)) {
      itemsEl.style.display = 'none';
    }
  });
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth' 
        });
      });
    }

    poemTextarea.addEventListener('input', () => {
        const len = poemTextarea.value.length;
        wordCountEl.textContent = `已输入 ${len} / 200 字`;
    });

    aiCheckbox.addEventListener('change', () => {
        polishTip.style.display = aiCheckbox.checked ? 'block' : 'none';
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const captcha = document.getElementById('captcha').value.trim();
        if (captcha !== '草堂') {
            alert('验证码错误，请输入“草堂”');
            return;
        }

        successMessage.style.display = 'block';
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✅ 投稿成功！';

        setTimeout(() => {
            form.reset();
            successMessage.style.display = 'none';
            submitBtn.textContent = originalText;
            polishTip.style.display = 'none';
        }, 3000);
    });
});