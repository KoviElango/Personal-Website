document.addEventListener("DOMContentLoaded", function() {
    var message = {
        message: [
            'making mobile apps;', 
            'Robots and anime;', 
            'Astronomy;', 
            'Python, Kotlin and React...;',
            'கொத்து பரோட்டா;'
        ],
        counterS: 0,
        counterL: 0,
        deleteS: false,

        init: function() {
            this.cacheElem();
            this.type();
        },

        cacheElem: function() {
            this.$text = document.querySelector('.text');
        },

        type: function() {
            var message  = this.message[this.counterS],
                  that    = this,
                  speed   = 0;

            message = !this.deleteS ? message.slice(0, ++this.counterL) : message.slice(0, --this.counterL);
            if(this.message[this.counterS] != message && !this.deleteS) {
                this.$text.textContent = message;
                speed = 90;
            }
            else {
                this.deleteS = true;
                speed = this.message[this.counterS] == message ? 1000 : 40;
                this.$text.textContent = message;
                if (message == '') {
                    this.deleteS = false;
                    this.counterS = this.counterS < this.message.length - 1 ? this.counterS + 1 : 0;
                }
            }
            setTimeout(function(){that.type()}, speed);
        }
    };
    message.init();

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
