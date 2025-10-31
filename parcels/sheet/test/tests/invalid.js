/*
invalid.js
*/

export default ({ Sheet, assets, css }) => {
  const sheet = Sheet.create().use();

  sheet.rules.add({
    h1: {bad: 'pink'},
  });
};
