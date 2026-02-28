class TigerExperience {
    constructor() {
        this.frameCount = 242;
        this.images = [];
        this.frameIndex = { value: 0 }; // Used for GSAP tracking

        // Canvas Setup
        this.tigerCanvas = document.getElementById('tiger-canvas');
        this.ambientCanvas = document.getElementById('ambient-canvas');
        this.tigerCtx = this.tigerCanvas.getContext('2d');
        this.ambientCtx = this.ambientCanvas.getContext('2d');

        this.isLoaded = false;

        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        this.init();
    }

    async init() {
        this.setupLenis();
        await this.preloadImages();

        this.resize();
        this.setupScrollTrigger();
        this.renderLoop();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 150);
        });

        this.setupCarousel();
    }

    setupLenis() {
        this.lenis = new Lenis({
            duration: 1.5, // slightly slower inertia for a more cinematic feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Sync Lenis with GSAP ScrollTrigger
        this.lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0, 0);
    }

    preloadImages() {
        return new Promise((resolve) => {
            let loadedCount = 0;

            for (let i = 1; i <= this.frameCount; i++) {
                const img = new Image();
                // Format: ezgif-frame-001.jpg ... ezgif-frame-242.jpg
                const indexStr = i.toString().padStart(3, '0');

                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === this.frameCount) {
                        this.isLoaded = true;
                        resolve();
                    }
                };

                img.src = `assets/frames/ezgif-frame-${indexStr}.jpg`;
                this.images[i - 1] = img; // Guarantee order regardless of load time
            }
        });
    }

    resize() {
        // Update Canvas internal resolution
        this.tigerCanvas.width = window.innerWidth;
        this.tigerCanvas.height = window.innerHeight;

        // Ambient canvas is 110% size (see CSS) to prevent vignette edges
        this.ambientCanvas.width = window.innerWidth * 1.1;
        this.ambientCanvas.height = window.innerHeight * 1.1;

        // Re-render current frame immediately to avoid blank flash
        if (this.isLoaded) {
            this.drawFrame();
        }
    }

    setupScrollTrigger() {
        // Scrub through the frames based on the height of #hero-section
        ScrollTrigger.create({
            trigger: "#hero-section",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.1, // Reduced from 0.5 to 0.1 for MUCH tighter, more responsive tracking
            onUpdate: (self) => {
                // Map progress (0 to 1) to frame index (0 to 241)
                this.frameIndex.value = Math.floor(self.progress * (this.frameCount - 1));
            }
        });
    }

    drawFrame() {
        if (!this.images[this.frameIndex.value]) return;
        const img = this.images[this.frameIndex.value];

        // 1. Draw Foreground (Tiger Canvas) - CSS object-fit doesn't apply to canvas *content*, 
        // so we must calculate 'contain' logic manually.
        this.tigerCtx.clearRect(0, 0, this.tigerCanvas.width, this.tigerCanvas.height);

        const tigerRatio = Math.min(
            this.tigerCanvas.width / img.width,
            this.tigerCanvas.height / img.height
        );
        const tw = img.width * tigerRatio;
        const th = img.height * tigerRatio;
        const tx = (this.tigerCanvas.width - tw) / 2;
        const ty = (this.tigerCanvas.height - th) / 2;

        this.tigerCtx.drawImage(img, tx, ty, tw, th);

        // 2. Draw Background (Ambient Canvas) - Cover Logic
        this.ambientCtx.clearRect(0, 0, this.ambientCanvas.width, this.ambientCanvas.height);

        const ambientRatio = Math.max(
            this.ambientCanvas.width / img.width,
            this.ambientCanvas.height / img.height
        );
        const aw = img.width * ambientRatio;
        const ah = img.height * ambientRatio;
        const ax = (this.ambientCanvas.width - aw) / 2;
        const ay = (this.ambientCanvas.height - ah) / 2;

        this.ambientCtx.drawImage(img, ax, ay, aw, ah);
    }

    renderLoop() {
        if (this.isLoaded) {
            this.drawFrame();
        }
        requestAnimationFrame(() => this.renderLoop());
    }

    setupCarousel() {
        const track = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.nav-prev');
        const nextBtn = document.querySelector('.nav-next');

        if (!track || !prevBtn || !nextBtn) return;

        // Scroll by card width + gap approx
        const scrollAmount = 420;

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TigerExperience();
});
