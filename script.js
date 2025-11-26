const boxSize = 40;
const seesaw = document.getElementById("seesaw");
const SEESAW_WIDTH = 750;
const placedBoxes = [];

// constants for physics laws
const physics = {
  maxAngle: 25,
  torqueScale: 2400,
};

let angle = 0;

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

  // calculate net torque by
  // iterating all boxes in our array
  placedBoxes.forEach((box) => {
    netTorque += box.weight * box.distanceFromCenter;
  });

  const angle = netTorque / physics.torqueScale;

  // limit the angle to maxAngle
  angle = Math.max(Math.min(rawAngle, physics.maxAngle), -physics.maxAngle);

  // rotate the css object
  seesaw.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

seesaw.addEventListener("click", (event) => {
  placeBox(event);
  updateRotation();
});
