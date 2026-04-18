const images = {
  spring: {
    image: '../IMG/spring.jpg',
    poem: '好雨知时节，当春乃发生。',
    author: '——《春夜喜雨》',
    color: '#6d9f4b' 
  },
  summer: {
    image: '../IMG/summer.jpg',
    poem: '清江一曲抱村流，长夏江村事事幽。',
    author: '——《江村》',
    color: '#8ab4a6' 
  },
  autumn: {
    image: '../IMG/autumn.jpg',
    poem: '八月秋高风怒号，卷我屋上三重茅。',
    author: '——《茅屋为秋风所破歌》',
    color: '#a67c52' 
  },
  winter: {
    image: '../IMG/winter.jpg',
    poem: '窗含西岭千秋雪，门泊东吴万里船。',
    author: '——《绝句》',
    color: '#b0c4b1' 
  }
};

let currentSlide = null;
let currentSeason = null;

function switchSeason(season) {
  const slider = document.getElementById('seasonImage');
  const seasonPoem = document.getElementById('seasonPoem');
  const buttons = document.querySelectorAll('.season-btn');
  
  buttons.forEach(btn => {
    if (btn.dataset.season === season) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const newSlide = document.createElement('div');
  newSlide.className = 'image-slide slide-enter';
  newSlide.style.backgroundImage = `url(${images[season].image})`;
  
  slider.appendChild(newSlide);
  void newSlide.offsetWidth;

  if (currentSlide) {
    currentSlide.classList.remove('slide-active');
    currentSlide.classList.add('slide-exit');
    
    setTimeout(() => {
      document.getElementById('image').remove();
    }, 100);
  }

  newSlide.classList.remove('slide-enter');
  newSlide.classList.add('slide-active');

  currentSlide = newSlide;
  currentSeason = season;

  updatePoem(season);
}

function updatePoem(season) {
  const seasonPoem = document.getElementById('seasonPoem');
  const data = images[season];
  
  seasonPoem.innerHTML = '';

  const poemText = data.poem;
  const authorText = data.author;

  for (let i = 0; i < poemText.length; i++) {
    const char = document.createElement('span');
    char.className = 'poem-char';
    char.textContent = poemText[i];
    char.style.animationDelay = `${i * 0.08}s`;
    seasonPoem.appendChild(char);
  }

  const author = document.createElement('div');
  author.style.marginTop = '10px';
  author.style.fontSize = '0.9em';
  author.style.fontStyle = 'normal';
  author.textContent = authorText;
  seasonPoem.appendChild(author);

  seasonPoem.classList.remove('show');
  setTimeout(() => seasonPoem.classList.add('show'), 100);

  document.documentElement.style.setProperty('--btn-color', data.color);
}

document.querySelectorAll('.season-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    switchSeason(btn.dataset.season);
  });
});

switchSeason('spring');