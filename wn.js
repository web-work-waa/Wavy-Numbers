gsap.registerPlugin(InertiaPlugin);

console.clear();
const svgns = "http://www.w3.org/2000/svg";
const demo = document.querySelector("svg");

let positions = 20; // how many numbers
let count = 0; // simple counter for the numbers
let startX = 30; // first line position and fist number position
let dragMin = startX;
let y2Pos = 200; // bottom of each tick line
let y1Pos;
let spacing = 9.4; // space between lines
let jump = 120; // height of number jump during animation
let dur = 1.1; // master duration
let masterStagger = 3; // higher numbers tighten the curve

// move the draggable element into position
gsap.set("#slider", { x: startX, xPercent: -50, y: y2Pos + 20 });

// make a 5 pack of lines for each number
for (let j = 0; j < positions; j++) {
  makeNumber();
  for (let i = 0; i < 5; i++) {
    y1Pos = i === 0 ? y2Pos - 25 : y2Pos - 15; // first line in each pack is slightly taller
    makeLine(y1Pos);
    startX += spacing;
  }
  count++;
}

makeNumber(); // need one final number 
makeLine(y2Pos - 25); //  need 1 extra line for the last number

// creates the line elements
function makeLine(yp) {
  let newLine = document.createElementNS(svgns, "line");
  demo.appendChild(newLine);
  gsap.set(newLine, {
    attr: { x1: startX, x2: startX, y1: yp, y2: y2Pos }
  });
}

// creates the numbers
function makeNumber() {
  let txt = document.createElementNS(svgns, "text");
  demo.appendChild(txt);
  txt.textContent = count;
  gsap.set(txt, {
    attr: { x: startX, y: y2Pos - 40, "text-anchor": "middle" }
  });
}

// final position of last line is new draggable max
let dragMax = startX;

// main timeline for the number jump
let animNumbers = gsap.timeline({ paused: true });
animNumbers
  .to("text", {
    duration: dur,
    y: -jump,
    scale: 1.5,
    fill: "#5cceee",
    stagger: {
      amount: masterStagger,
      yoyo: true,
      repeat: 1
    },
    ease: "sine.inOut"
  })
  .time(dur); // set the time to the end of the first number jump



// Map the drag range to the timeline duration
let mapper = gsap.utils.mapRange(
  dragMin,
  dragMax,
  dur,
  animNumbers.duration() - dur
);

// Create the draggable element and set the range 
Draggable.create("#slider", {
  type: "x",
  bounds: {
    minX: dragMin,
    maxX: dragMax
  },
  inertia: true,
  edgeResistance: 1,
  onDrag: updateMeter,
  onThrowUpdate: updateMeter
});

function updateMeter() {
  gsap.set(animNumbers, { time: mapper(this.x) });
}
