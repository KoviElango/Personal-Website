document.addEventListener("DOMContentLoaded", function() {
    const timelineItemsLeft = document.querySelectorAll(".timeline-left .timeline-item");
    const timelineItemsRight = document.querySelectorAll(".timeline-right .timeline-item");
    const scrollDownButton = document.getElementById('scroll-down');
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

    // Function to set the background color and highlight class based on the current time
    function setBackgroundColor() {
        const now = new Date();
        const hours = now.getHours();
        let gradient;
        let textColor;
        let cardBackground;
        let cardTextColor;
        let highlightClass;

        if (hours >= 20 || hours < 6) { // Night time
            gradient = "linear-gradient(to bottom, #2E2E2E, #000000)";
            textColor = "#FFFFFF";
            cardBackground = "rgba(46, 46, 46, 0.8)";
            cardTextColor = "#FFFFFF";
            highlightClass = "highlight-night";
            addStars();
            removeClouds();
        } else if (hours >= 6 && hours < 12) { // Morning
            gradient = "linear-gradient(to bottom, #87CEFA, #00BFFF)";
            textColor = "#000000";
            cardBackground = "rgba(135, 206, 250, 0.8)";
            cardTextColor = "#000000";
            highlightClass = "highlight-morning";
            removeStars();
            addClouds();
        } else if (hours >= 12 && hours < 18) { // Afternoon
            gradient = "linear-gradient(to bottom, #FFA07A, #FF4500)";
            textColor = "#000000";
            cardBackground = "rgba(255, 160, 122, 0.8)";
            cardTextColor = "#000000";
            highlightClass = "highlight-afternoon";
            removeStars();
            addClouds();
        } else { // Evening
            gradient = "linear-gradient(to bottom, #FF4500, #FFD700)"; // Orange to Yellow gradient
            textColor = "#FFFFFF";
            cardBackground = "rgba(255, 69, 0, 0.8)";
            cardTextColor = "#FFFFFF";
            highlightClass = "highlight-evening";
            removeStars();
            addClouds();
        }

        document.body.style.background = gradient;
        document.querySelectorAll('h1, h2, h3, h4, p, a, span').forEach(el => {
            el.style.color = textColor;
            el.classList.remove("highlight-morning", "highlight-afternoon", "highlight-evening", "highlight-night");
            el.classList.add(highlightClass);
        });
        businessCard.style.background = cardBackground;
        businessCard.style.color = cardTextColor;

        // Update the timeline line color
        document.querySelectorAll('.timeline-line').forEach(line => {
            line.style.background = '#FFD700'; /* Gold color for the line */
        });
    }

    function addStars() {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.top = `${Math.random() * window.innerHeight}px`;
            star.style.left = `${Math.random() * window.innerWidth}px`;
            document.body.appendChild(star);
        }
    }

    function removeStars() {
        document.querySelectorAll('.star').forEach(star => star.remove());
    }

    function addClouds() {
        for (let i = 0; i < 10; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.style.top = `${Math.random() * window.innerHeight * 0.5}px`;
            cloud.style.left = `${Math.random() * window.innerWidth}px`;
            document.body.appendChild(cloud);
        }
    }

    function removeClouds() {
        document.querySelectorAll('.cloud').forEach(cloud => cloud.remove());
    }

    setBackgroundColor();
    setInterval(setBackgroundColor, 60000); // Update background color every minute

    document.addEventListener('mousemove', (e) => {
        const rect = businessCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        businessCard.style.transform = `rotateY(${x * 0.03}deg) rotateX(${-y * 0.03}deg)`;
        businessCard.style.boxShadow = `${x * 0.1}px ${y * 0.1}px 30px rgba(0, 0, 0, 0.2)`;
    });
});
