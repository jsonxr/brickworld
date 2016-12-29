const a1 = new Float32Array([0,1,2,  3,4,5,  6,7,8,9,    10,11,12,  13,14,15,  16,17,18]);
const a2 = new Float32Array([-1,-1,-1, -1,-1,-1, -1,-1,-1]);

console.log(a1);
console.log(a2);

console.log(a1.slice(0*3, (2+1)*3));
a2.set(a1.slice(0*3, (2+1)*3));
console.log(a2);

console.log(a1.slice(3*3, (5+1)*3));
a2.set(a1.slice(3*3, (5+1)*3));
console.log(a2);