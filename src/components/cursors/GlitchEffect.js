export class GlitchEffect {
  constructor() {
    this.root = document.body;
    this.cursor = document.querySelector(".curzr-glitch-effect");

    (this.distanceX = 0),
      (this.distanceY = 0),
      (this.pointerX = 0),
      (this.pointerY = 0),
      (this.previousPointerX = 0);
    this.previousPointerY = 0;
    this.cursorSize = 20;
    this.glitchColorB = "#00feff";
    this.glitchColorR = "#ff4f71";

    this.cursorStyle = {
      boxSizing: "border-box",
      position: "fixed",
      top: `${this.cursorSize / -7}px`,
      left: `${this.cursorSize / -7}px`,
      zIndex: "2147483647",
      width: `${this.cursorSize}px`,
      height: `${this.cursorSize}px`,
      backgroundColor: "#222",
      borderRadius: "50%",
      boxShadow: `0 0 0 ${this.glitchColorB}, 0 0 0 ${this.glitchColorR}`,
      transition: "100ms, transform 100ms",
      userSelect: "none",
      pointerEvents: "none",
    };

    if (CSS.supports("backdrop-filter", "invert(1)")) {
      this.cursorStyle.backdropFilter = "invert(1)";
      this.cursorStyle.backgroundColor = "#fff0";
    } else {
      this.cursorStyle.backgroundColor = "#222";
    }

    this.init(this.cursor, this.cursorStyle);
  }

  init(el, style) {
    Object.assign(el.style, style);
    setTimeout(() => {
      this.cursor.removeAttribute("hidden");
    }, 500);
    this.cursor.style.opacity = 1;
  }

  move(event) {
    this.previousPointerX = this.pointerX;
    this.previousPointerY = this.pointerY;
    this.pointerX = event.pageX + this.root.getBoundingClientRect().x;
    this.pointerY = event.pageY + this.root.getBoundingClientRect().y;
    this.distanceX = Math.min(
      Math.max(this.previousPointerX - this.pointerX, -10),
      10
    );
    this.distanceY = Math.min(
      Math.max(this.previousPointerY - this.pointerY, -10),
      10
    );

    if (
      event.target.localName === "svg" ||
      event.target.localName === "a" ||
      event.target.onclick !== null ||
      Array.from(event.target.classList).includes("curzr-hover")
    ) {
      this.hover();
    } else {
      this.hoverout();
    }

    this.cursor.style.transform = `translate3d(${this.pointerX}px, ${this.pointerY}px, 0)`;
    this.cursor.style.boxShadow = `
      ${+this.distanceX * 2}px ${+this.distanceY * 4}px 0 ${this.glitchColorB}, 
      ${-this.distanceX * 2}px ${-this.distanceY * 4}px 0 ${this.glitchColorR}`;
    this.stop();
  }

  hover() {
    this.cursorSize = 30;
  }

  hoverout() {
    this.cursorSize = 20;
  }

  click() {
    this.cursor.style.transform += ` scale(0.75)`;
    setTimeout(() => {
      this.cursor.style.transform = this.cursor.style.transform.replace(
        ` scale(0.75)`,
        ""
      );
    }, 30);
  }

  stop() {
    if (!this.moving) {
      this.moving = true;
      setTimeout(() => {
        this.cursor.style.boxShadow = "";
        this.moving = false;
      }, 50);
    }
  }

  hidden() {
    this.cursor.style.opacity = 0;
    setTimeout(() => {
      this.cursor.setAttribute("hidden", "hidden");
    }, 500);
  }
}
export function appendCursorGlitch() {
  // Create the div element
  let div = document.createElement("div");
  div.setAttribute("class", "curzr-glitch-effect");
  div.setAttribute("hidden", "");

  // Append div to body
  document.body.appendChild(div);
}
