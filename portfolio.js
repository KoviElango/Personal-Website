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

// ========================================
// PORTFOLIO PAGE: Project Hover & Preview
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const projectsList = document.getElementById('projects-list');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const projectItems = document.querySelectorAll('.project-item');
    
    let currentItem = null;

    /**
     * Handle mouse enter: update image and show preview
     */
    const handleMouseEnter = (event) => {
        const targetItem = event.target.closest('.project-item');
        if (!targetItem || currentItem === targetItem) return;

        currentItem = targetItem;

        const imageText = targetItem.getAttribute('data-image');
        const imageUrl = `https://placehold.co/${imageText}/FFF`;
        imagePreview.src = imageUrl;

        imagePreviewContainer.classList.add('is-visible');
    };

    /**
     * Handle mouse leave: hide preview with debounce
     */
    const handleMouseLeave = (event) => {
        if (event.target.closest('.project-item') === currentItem) {
            setTimeout(() => {
                if (!projectsList.querySelector(':hover .project-item')) {
                    imagePreviewContainer.classList.remove('is-visible');
                    currentItem = null;
                }
            }, 50);
        }
    };

    /**
     * Handle mouse move: track mouse Y position for dynamic preview movement
     */
    const handleMouseMove = (event) => {
        if (imagePreviewContainer.classList.contains('is-visible')) {
            const mouseY = event.clientY;
            imagePreviewContainer.style.transform = `translate3d(0, ${mouseY - 200}px, 0) rotate3d(0, 0, 1, 0deg)`;
            imagePreviewContainer.style.top = '0';
        }
    };

    // Attach event listeners
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', handleMouseEnter);
    });
    
    projectsList.addEventListener('mouseleave', () => {
        imagePreviewContainer.classList.remove('is-visible');
        currentItem = null;
    });
    
    document.addEventListener('mousemove', handleMouseMove);
});