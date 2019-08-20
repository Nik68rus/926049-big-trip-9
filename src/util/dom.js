export const makeMarkupGenerator = (generator, separator = `\n`) =>
  (markups) => markups.map(generator).join(separator);

export const renderComponent = (container, component, position = `beforeend`) =>
  container.insertAdjacentHTML(position, component);

