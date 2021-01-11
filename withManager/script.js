const gradientRoot = document.getElementById('gradient-root');

const myColorGen = new GradientGenerator({ mainElement: gradientRoot });
const myGenManager = myColorGen.createUIManager({ keepChanges: false });

const addBtn = document.getElementById('add');
addBtn.addEventListener('click', () => {
  myGenManager.setAddMode();
});

const cancelBtn = document.getElementById('cancel');
cancelBtn.addEventListener('click', () => {
  myGenManager.restoreColors();
});

const acceptBtn = document.getElementById('accept');
acceptBtn.addEventListener('click', () => {
  myGenManager.saveColors();
});

const getColorsBtn = document.getElementById('getColors');
const output = document.getElementById('output');

getColorsBtn.addEventListener('click', () => {
  const colors = myColorGen.generateColors(10);
  output.innerHTML = '<ul>';
  colors.forEach(colorHex => {
    output.innerHTML += `<li>${colorHex}</li>`;
  });
  output.innerHTML += '</ul>';
});
