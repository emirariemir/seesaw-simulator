const seesaw = document.getElementById("seesaw");
const resetButton = document.getElementById("reset-btn");
const totalLeftEl = document.getElementById("total-left");
const totalRightEl = document.getElementById("total-right");
const boxSize = 40;
const SEESAW_WIDTH = 750;
const placedBoxes = [];

const boxPlacedSound = new Audio("sounds/boxPlaced.wav");
const resetButtonSound = new Audio("sounds/resetButtonSound.wav");

// constants for physics laws
const physics = {
  gravity: 9.81,
  maxAngle: 30,
  damping: 0.99,
};

let angle = 0;
let angularVelocity = 0;
let angularAcceleration = 0;

function placeBox(event) {
  // finding the center of screen
  const screenCenter = window.innerWidth / 2;

  // calculating the virtual distance,
  // as if seesaw is not rotated
  const virtualDistanceFromCenter = event.clientX - screenCenter;

  // we need to project the screen distance
  // onto tilted seesaw by dividing by cos(angle)
  // --------
  // we need to convert angle to radians before
  // using it in cos function
  const angleInRadians = angle * (Math.PI / 180);
  const relativeDistanceFromCenter =
    virtualDistanceFromCenter / Math.cos(angleInRadians);

  // calculating the left pos
  // of the box relative to seesaw
  let relativeLeft =
    SEESAW_WIDTH / 2 + relativeDistanceFromCenter - boxSize / 2;

  // clamping the pos to keep boxes inside seesaw
  relativeLeft = Math.min(Math.max(relativeLeft, 0), SEESAW_WIDTH - boxSize);

  // creating a box
  const box = document.createElement("div");
  box.className = "box";

  // generating random weight
  const weight = Math.floor(1 + Math.random() * 10);
  box.textContent = weight;

  box.style.left = `${relativeLeft}px`;
  box.style.top = `-${boxSize}px`;

  seesaw.appendChild(box);

  // push that box to our array
  placedBoxes.push({
    el: box,
    weight: weight,
    distanceFromCenter: relativeDistanceFromCenter,
  });

  // higher volume for heavier boxes
  boxPlacedSound.volume = weight / 10;
  boxPlacedSound.play();

  // update weights because
  // theres a new box!
  updateWeightDisplay();
}

function updateRotation() {
  let netTorque = 0;
  let momentOfInertia = 0;

  // calculate net torque by
  // iterating all boxes in our array
  placedBoxes.forEach((box) => {
    // torque = force x distance
    // force = mass x gravity
    netTorque += box.weight * box.distanceFromCenter * physics.gravity;

    // moment of inertia = mass x distance^2
    momentOfInertia += box.weight * Math.pow(box.distanceFromCenter, 2);
  });

  // adding base inertia to avoid extreme angles with small weights
  momentOfInertia += 5002;

  // we need calculate angular velocity
  // so we need angular acceleration
  angularAcceleration = netTorque / momentOfInertia;
  angularVelocity += angularAcceleration;
  angularVelocity *= physics.damping;

  angle += angularVelocity;

  // limit the angle to maxAngle
  if (angle > physics.maxAngle) {
    angle = physics.maxAngle;

    // flip velocity and reduce it heavily
    // for bouncing effect
    if (angularVelocity > 0) {
      angularVelocity *= -0.5;
    }
  } else if (angle < -physics.maxAngle) {
    angle = -physics.maxAngle;

    if (angularVelocity < 0) {
      angularVelocity *= -0.5;
    }
  }

  // rotate the css object
  seesaw.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

function resetSimulation() {
  // remove all boxes in the DOM
  seesaw.innerHTML = "";
  placedBoxes.length = 0;

  // reset acceleration and velocity
  angle = 0;
  angularVelocity = 0;
  angularAcceleration = 0;

  // update display because
  // we just got reset!
  updateWeightDisplay();

  resetButtonSound.play();
}

function updateWeightDisplay() {
  let leftTotal = 0;
  let rightTotal = 0;

  // calculate total weights on
  // both side by iterating through boxes
  placedBoxes.forEach((box) => {
    if (box.distanceFromCenter < 0) {
      leftTotal += box.weight;
    } else {
      rightTotal += box.weight;
    }
  });

  totalLeftEl.textContent = leftTotal;
  totalRightEl.textContent = rightTotal;
}

function animate() {
  updateRotation();
  requestAnimationFrame(animate);
}

seesaw.addEventListener("click", (event) => {
  placeBox(event);
});

resetButton.addEventListener("click", resetSimulation);

animate();
