export const makeFirstCharCapital = (word) => word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ``;
export const compareEventsByTime = (a, b) => a.time.start - b.time.start;
export const hideIfTrue = (node, condition) => {
  if (condition === true) {
    node.classList.add(`visually-hidden`);
  } else {
    node.classList.remove(`visually-hidden`);
  }
};

