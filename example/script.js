const gradientRoot = document.getElementById('gradient-root');

const myColorGen = new GradientGenerator(gradientRoot);
const myGenManager = myColorGen.createManager({ keepChanges: false });

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
getColorsBtn.addEventListener('click', () => {
  const colors = myColorGen.generateColors();
  colors.forEach(color => {
    console.log(color.length);
  });
});