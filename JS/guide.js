document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('visitorFeedbackForm');
    if (!form) return;

    const yes = form.querySelector('input[name="notify"][value="yes"]');
    const no = form.querySelector('input[name="notify"][value="no"]');

    if (yes && no) {
        yes.addEventListener('change', () => {
            if (yes.checked) no.checked = false;
        });
        no.addEventListener('change', () => {
            if (no.checked) yes.checked = false;
        });
    }

    document.getElementById('visitorFeedbackForm').addEventListener('submit', function(e) {
        e.preventDefault(); 
    
        const name = document.getElementById('name').value.trim();
        const rating = document.getElementById('rating').value;
        const favorites = Array.from(document.querySelectorAll('input[name="favorite"]:checked'))
                              .map(cb => cb.value);
    
        let message = `感谢${name || '您'}的反馈！`;
        if (rating === '5') {
            message += `\n五星好评太暖心了！`;
        }
        if (favorites.length > 0) {
            message += `\n您最喜欢的景点是：${favorites.join('、')}。`;
        }
        message += `\n您的建议将帮助我们更好地守护草堂。`;
    
        alert(message);

        this.reset();
    });
    if (yes) yes.checked = false;
    if (no) no.checked = false;
});
//
const form = document.getElementById('visitorFeedbackForm');
const yes = document.querySelector('input[value="yes"]');
const no = document.querySelector('input[value="no"]');

yes.addEventListener('change', () => {
    if (yes.checked) {no.checked = false;
    }
});

no.addEventListener('change', () => {
    if (no.checked){
    yes.checked = false;
    }
});
