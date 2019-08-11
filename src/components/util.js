export const getMarkup = (dataList, generator) => dataList.map(generator).join(`\n`);
export const renderComponent = (container, component, position) => container.insertAdjacentHTML(position, component);
