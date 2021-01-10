const gradientRoot = document.getElementById('gradient-root');

const myColorGen = new GradientGenerator(gradientRoot);
const colors = myColorGen.generateColors();

const myGenManager = myColorGen.createManager();
console.log(myColorGen.getGradientColors());
console.log(colors);
console.dir(myGenManager);
