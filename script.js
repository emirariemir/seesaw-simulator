const boxSize = 40;
const seesaw = document.getElementById("seesaw");
const SEESAW_WIDTH = 750;
const placedBoxes = [];

// constants for physics laws
const physics = {
  gravity: 9.81,
  maxAngle: 25,
  damping: 0.99,
};

let angle = 0;
let angularVelocity = 0;
let angularAcceleration = 0;

function placeBox(event) {
  // getting the bounding box of seesaw
  const rect = seesaw.getBoundingClientRect();

  // returning if click is outside seesaw area
  if (event.clientX < rect.left || event.clientX > rect.right) {
    return;
  }

  // creating a box
  const box = document.createElement("div");
  box.className = "box";

  // generating random weight
  const weight = Math.round(1 + Math.random() * 10);
  box.textContent = weight;

  // calculating the pos of the box relative to seesaw
  // if user clicks too much right edge, be at least 0
  // if user clicks too much left, be at seesaw width - box most
  const relativeLeft = Math.min(
    Math.max(event.clientX - rect.left - boxSize / 2, 0),
    rect.width - boxSize
  );

  box.style.left = `${relativeLeft}px`;
  box.style.top = `-${boxSize}px`;

  seesaw.appendChild(box);

  // push that box to our array
  placedBoxes.push({
    el: box,
    weight: weight,
    distanceFromCenter: relativeLeft + boxSize / 2 - SEESAW_WIDTH / 2,
  });
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
  } else if (angle < -physics.maxAngle) {
    angle = -physics.maxAngle;
  }

  // rotate the css object
  seesaw.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

function animate() {
  updateRotation();
  requestAnimationFrame(animate);
}

seesaw.addEventListener("click", (event) => {
  placeBox(event);
});

animate();
