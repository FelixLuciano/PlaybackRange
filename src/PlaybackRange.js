const range = document.createElement("input");

range.type  = "range";
range.min   = 0.25;
range.max   = 10;
range.step  = 0.1;
range.value = 3;


range.style.setProperty("width", "20%");
range.style.setProperty("height", "1.5rem");
range.style.setProperty("min-width", "15em");
range.style.setProperty("position", "fixed");
range.style.setProperty("bottom", "1rem");
range.style.setProperty("right", "1rem");
range.style.setProperty("accent-color", "#F22");


range.oninput = function () {
  let value = this.value <= 3 ? this.value / 3 : (this.value * 4 - 5) / 7;

  document.querySelectorAll("audio, video").forEach((node) =>
    node.playbackRate = value
  );
}

range.oncontextmenu = function (event) {
  event.preventDefault();

  this.value = 3;
  this.dispatchEvent(new Event("input"));

  return false;
}

range.onkeyup = function () {
  if (event.key === "Escape") this.remove();
}


document.body.appendChild(range);
