const Style = {
  VISUALLY_HIDDEN: `visually-hidden`,
};

export const makeFirstCharCapital = (word) => word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ``;
export const compareEventsByTime = (a, b) => a.time.start - b.time.start;

export const hideIfTrue = (element, isHide) =>
  element.classList[isHide ? `add` : `remove`](Style.VISUALLY_HIDDEN);

