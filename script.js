let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    const moveHandler = (e) => {
      let clientX, clientY;
      if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      if (dirLength > 0) {
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;

        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = (180 * angle) / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;
        if (this.rotating) {
          this.rotation = degrees;
        }
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
      }
    };

    const startHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;

      if (e.touches) {
        this.mouseTouchX = e.touches[0].clientX;
        this.mouseTouchY = e.touches[0].clientY;
        this.prevMouseX = e.touches[0].clientX;
        this.prevMouseY = e.touches[0].clientY;
      } else {
        this.mouseTouchX = e.clientX;
        this.mouseTouchY = e.clientY;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }

      if (e.touches && e.touches.length === 2) {
        this.rotating = true;
      }
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler, { passive: false });
    paper.addEventListener("mousedown", startHandler);
    paper.addEventListener("touchstart", startHandler, { passive: false });
    window.addEventListener("mouseup", endHandler);
    window.addEventListener("touchend", endHandler);
  }
}

const papers = document.querySelectorAll(".paper");
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
