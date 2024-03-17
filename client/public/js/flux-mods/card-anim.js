const cardAnimOnMouseMove = (event, element) => {
  if (!element) return;
  const { left, top, width, height } = element.getBoundingClientRect();
  const x = (event.clientX - left - width / 2) / 25;
  const y = (event.clientY - top - height / 2) / 25;
  element.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
};

const cardAnimOnMouseEnter = (_event, element) => {
  if (!element) return;
};

const cardAnimOnMouseLeave = (_event, element) => {
  if (!element) return;
  element.style.transform = `rotateY(0deg) rotateX(0deg)`;
};
