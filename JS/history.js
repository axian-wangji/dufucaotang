document.querySelectorAll('.timeline-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();

    document.querySelectorAll('.event, .timeline-img').forEach(el => {
      el.classList.remove('visible');
    });

    const event = item.querySelector('.event');
    const img = item.querySelector('.timeline-img');

    if (event) event.classList.add('visible');
    if (img) img.classList.add('visible');
  });
});

document.body.addEventListener('click', (e) => {
  if (!e.target.closest('.timeline-item')) {
    document.querySelectorAll('.event, .timeline-img').forEach(el => {
      el.classList.remove('visible');
    });
  }
});