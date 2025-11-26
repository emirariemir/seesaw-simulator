const boxSize = 40;
const seesaw = document.getElementById("seesaw");
const SEESAW_WIDTH = 750;

// function for placing boxes on the seesaw
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
}

seesaw.addEventListener("click", placeBox);
