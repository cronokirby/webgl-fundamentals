function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  console.log(width, height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);
}

function resize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  draw(canvas, ctx);
}

// This cast will not be sound if the HTML element isn't actually a canvas
const canvas = document.getElementById('root-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

resize(canvas, ctx);
