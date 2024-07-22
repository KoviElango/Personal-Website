document.addEventListener("DOMContentLoaded", function() {
    const timelineItemsLeft = document.querySelectorAll(".timeline-left .timeline-item");
    const timelineItemsRight = document.querySelectorAll(".timeline-right .timeline-item");

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
});
