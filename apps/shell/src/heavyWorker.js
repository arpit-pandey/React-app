// Web Worker for heavy data processing
typeof self === 'object' && self.addEventListener('message', function(e) {
  // Simulate heavy computation (e.g., sum of large array)
  const arr = e.data;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  self.postMessage(sum);
});
