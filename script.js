document.addEventListener("DOMContentLoaded", function() {
    const timelineItemsLeft = document.querySelectorAll(".timeline-left .timeline-item");
    const timelineItemsRight = document.querySelectorAll(".timeline-right .timeline-item");
    const scrollDownButton = document.getElementById('scroll-down');
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    const businessCard = document.querySelector('.business-card');

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                entry.target.classList.remove("hidden");
            } else {
                entry.target.classList.remove("visible");
                entry.target.classList.add("hidden");
            }
        });
    }, observerOptions);

    timelineItemsLeft.forEach(item => {
        observer.observe(item);
    });

    timelineItemsRight.forEach(item => {
        observer.observe(item);
    });

    scrollDownButton.addEventListener('click', () => {
        document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
    });

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        const rect = businessCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        businessCard.style.transform = `rotateY(${x * 0.05}deg) rotateX(${-y * 0.05}deg)`;
        businessCard.style.boxShadow = `${x * 0.1}px ${y * 0.1}px 30px rgba(0, 0, 0, 0.2)`;

        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
    });

    document.addEventListener('scroll', () => {
        const timelineSection = document.getElementById('timeline');
        const projectsSection = document.getElementById('projects');
        const timelineRect = timelineSection.getBoundingClientRect();
        const projectsRect = projectsSection.getBoundingClientRect();

        if (timelineRect.top <= window.innerHeight && timelineRect.bottom >= 0) {
            cursor.style.backgroundColor = 'rgba(0, 0, 255, 0.7)'; // Blue cursor in timeline section
        } else if (projectsRect.top <= window.innerHeight && projectsRect.bottom >= 0) {
            cursor.style.backgroundColor = 'rgba(0, 255, 0, 0.7)'; // Green cursor in projects section
        } else {
            cursor.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Default cursor color
        }
    });
});
