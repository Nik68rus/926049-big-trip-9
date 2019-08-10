export const getMarkup = (dataList, generator) => dataList.map(generator).join(`\n`);
