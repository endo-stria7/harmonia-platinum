export class MotionBlur {
  constructor() {
    this.root = document.body;
    this.cursor = document.querySelector(".curzr-motion");
    this.filter = document.querySelector(".curzr-motion .curzr-motion-blur");

    (this.position = {
      distanceX: 0,
      distanceY: 0,
      pointerX: 0,
      pointerY: 0,
    }),
      (this.previousPointerX = 0);
    this.previousPointerY = 0;
    this.angle = 0;
    this.previousAngle = 0;
    this.angleDisplace = 0;
    this.degrees = 57.296;
    this.cursorSize = 15;
    this.moving = false;

    this.cursorStyle = {
      boxSizing: "border-box",
      position: "fixed",
      top: `${this.cursorSize / -2}px`,
      left: `${this.cursorSize / -2}px`,
      zIndex: "2147483647",
      width: `${this.cursorSize}px`,
      height: `${this.cursorSize}px`,
      borderRadius: "50%",
      overflow: "visible",
      transition: "200ms, transform 20ms",
      userSelect: "none",
      pointerEvents: "none",
    };

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
    this.previousPointerX = this.position.pointerX;
    this.previousPointerY = this.position.pointerY;
    this.position.pointerX = event.pageX + this.root.getBoundingClientRect().x;
    this.position.pointerY = event.pageY + this.root.getBoundingClientRect().y;
    this.position.distanceX = Math.min(
      Math.max(this.previousPointerX - this.position.pointerX, -20),
      20
    );
    this.position.distanceY = Math.min(
      Math.max(this.previousPointerY - this.position.pointerY, -20),
      20
    );

    this.cursor.style.transform = `translate3d(${this.position.pointerX}px, ${this.position.pointerY}px, 0)`;
    this.rotate(this.position);
    this.moving ? this.stop() : (this.moving = true);
  }

  rotate(position) {
    let unsortedAngle =
      Math.atan(Math.abs(position.distanceY) / Math.abs(position.distanceX)) *
      this.degrees;

    if (isNaN(unsortedAngle)) {
      this.angle = this.previousAngle;
    } else {
      if (unsortedAngle <= 45) {
        if (position.distanceX * position.distanceY >= 0) {
          this.angle = +unsortedAngle;
        } else {
          this.angle = -unsortedAngle;
        }
        this.filter.setAttribute(
          "stdDeviation",
          `${Math.abs(this.position.distanceX / 2)}, 0`
        );
      } else {
        if (position.distanceX * position.distanceY <= 0) {
          this.angle = 180 - unsortedAngle;
        } else {
          this.angle = unsortedAngle;
        }
        this.filter.setAttribute(
          "stdDeviation",
          `${Math.abs(this.position.distanceY / 2)}, 0`
        );
      }
    }
    this.cursor.style.transform += ` rotate(${this.angle}deg)`;
    this.previousAngle = this.angle;
  }

  stop() {
    setTimeout(() => {
      this.filter.setAttribute("stdDeviation", "0, 0");
      this.moving = false;
    }, 50);
  }

  hidden() {
    this.cursor.style.opacity = 0;
    setTimeout(() => {
      this.cursor.setAttribute("hidden", "hidden");
    }, 500);
  }
}

export function appendCursorMotionBlur() {
  let div = document.createElement("div");
  div.setAttribute("class", "curzr-motion");
  div.setAttribute("hidden", "");
  // Create the SVG element
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // Create the filter element
  let filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", "motionblur");
  filter.setAttribute("x", "-100%");
  filter.setAttribute("y", "-100%");
  filter.setAttribute("width", "400%");
  filter.setAttribute("height", "400%");

  // Create the feGaussianBlur element
  let feGaussianBlur = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feGaussianBlur"
  );
  feGaussianBlur.setAttribute("class", "curzr-motion-blur");
  feGaussianBlur.setAttribute("stdDeviation", "0, 0");

  // Append feGaussianBlur to filter
  filter.appendChild(feGaussianBlur);

  // Create the circle element
  let circle = document.createElementNS("http://www.w3.org/2000/150", "circle");
  circle.setAttribute("cx", "50%");
  circle.setAttribute("cy", "50%");
  circle.setAttribute("r", "5");
  circle.setAttribute("fill", "#ffbc90");
  circle.setAttribute("filter", "url(#motionblur)");

  // Append filter to svg
  svg.appendChild(filter);

  // Append circle to svg
  svg.appendChild(circle);

  // Append svg to body
  document.body.appendChild(svg);
}
