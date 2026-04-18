const contentData = {
  'shi-ren': {
    title: '士人精神',
    text: '杜甫在草堂写下《茅屋为秋风所破歌》，将个人困顿升华为“大庇天下寒士俱欢颜”的胸怀。草堂由此成为后世文人心中的道德坐标——即使身处逆境，仍心系苍生。',
    image: '../IMG/shi-ren-bg.jpg'
  },
  'shi-xue': {
    title: '诗学源头',
    text: '草堂时期是杜甫创作高峰，近300首诗在此诞生，确立了“沉郁顿挫”的现实主义诗风。苏轼、陆游等皆以“学杜”为荣，形成千年文脉传承。',
    image: '../IMG/shi-xue-bg.jpg'
  },
  'min-zu': {
    title: '民族记忆',
    text: '草堂历经唐、宋、元、明、清至今，屡毁屡建，从未被遗忘。它承载的不仅是建筑，更是一个民族对“良知诗人”的集体敬仰与文化认同。',
    image: '../IMG/min-zu-bg.jpg'
  }
};

const bgMap = {
  'shi-ren': '../IMG/shi-ren-bg.jpg',
  'min-zu': '../IMG/min-zu-bg.jpg',
  'shi-xue': '../IMG/shi-xue-bg.jpg'
};

document.querySelectorAll('.bg-layer').forEach(layer => {
  const key = layer.dataset.key;
  if (key && bgMap[key]) {
    layer.style.setProperty('--bg-url', `url(${bgMap[key]})`);
  }
});

const navItems = document.querySelectorAll('.nav-item');
const titleEl = document.getElementById('title');
const textEl = document.getElementById('text');
const contentBox = document.getElementById('contentBox');
const bgLayers = document.querySelectorAll('.bg-layer');

let currentLayerIndex = 0; 

function switchContent(key) {
  const data = contentData[key];
  if (!data) return;

  navItems.forEach(el => el.classList.remove('active'));
  const targetItem = document.querySelector(`[data-key=" ${key}"]`); 
  if (targetItem) {
    targetItem.classList.add('active');
  }

  animateText(titleEl, data.title);
  animateText(textEl, data.text);

  switchBackground(data.image);
}

function switchBackground(imageUrl) {
  const key = Object.keys(contentData).find(k => contentData[k].image === imageUrl);
  if (!key) return;

  const currentActive = document.querySelector('.bg-layer.active');
  const targetLayer = document.querySelector(`.bg-layer[data-key="${key}"]`);

  if (!targetLayer) return;

  if (currentActive) currentActive.classList.remove('active');
  targetLayer.classList.add('active');
}

function animateText(element, text) {
  element.innerHTML = '';

  let delay = 0;
  for (let i = 0; i < text.length; i++) {
    const char = document.createElement('span');
    char.className = 'char';
    char.textContent = text[i];
    char.style.animationDelay = `${delay}ms`; 
    element.appendChild(char);
    delay += 80;
  }
}

navItems.forEach(item => {
  item.addEventListener('mouseenter', function() {
    const key = this.dataset.key;
    switchContent(key);
  });
});

Object.values(contentData).forEach(item => {
  const img = new Image();
  img.src = item.image;
});