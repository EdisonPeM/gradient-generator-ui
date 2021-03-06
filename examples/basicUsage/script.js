const gradientRoot = document.getElementById('gradient-root');

const myColorGen = new GradientGenerator({
  mainElement: gradientRoot,
  initialColors: [
    { colorHex: '#f00', position: 0 },
    { colorHex: '#00f', position: 40 },
    { colorHex: '#0f0', position: 80 },
  ],
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
