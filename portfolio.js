document.addEventListener('DOMContentLoaded', () => {
  // Carousel
  const slides = document.querySelectorAll('.carousel-slide');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  if (slides && slides.length) {
    let current = 0;
    const total = slides.length;
    const update = () => {
      slides.forEach(s => s.classList.remove('active'));
      slides[current].classList.add('active');
    };
    if (nextBtn) nextBtn.addEventListener('click', () => { current = (current+1)%total; update(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { current = (current-1+total)%total; update(); });
    setInterval(() => { current = (current+1)%total; update(); }, 6000);
  }

  // Canvas particles (lightweight placeholder)
  const canvas = document.getElementById('art-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  // simple animated dots
  const dots = Array.from({length:40}).map(()=>({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4, r:Math.random()*1.8+0.3 }));
  function loop(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(212,175,55,0.7)';
    for (let d of dots){
      d.x += d.vx; d.y += d.vy;
      if (d.x<0||d.x>w) d.vx*=-1;
      if (d.y<0||d.y>h) d.vy*=-1;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
});