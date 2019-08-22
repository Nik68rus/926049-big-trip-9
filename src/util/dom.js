export const makeMarkupGenerator = (generator, separator = `\n`) =>
  (markups) => markups.map(generator).join(separator);

export const renderComponent = (container, component, position = `beforeend`) =>
  container.insertAdjacentHTML(position, component);

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const createFewElements = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.appendChild(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

