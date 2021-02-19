import fragShaderSource from './fragShaderSource';
import vertShaderSource from './vertShaderSource';

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const info = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    const message = `Error creating shader: ${info}`;
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertShader: WebGLShader,
  fragShader: WebGLShader,
): WebGLProgram {
  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const info = gl.getProgramInfoLog(program);
    const message = `Error creating program: ${info}`;
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

function draw(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {}

function resize(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  draw(canvas, gl);
}

// This cast will not be sound if the HTML element isn't actually a canvas
const canvas = document.getElementById('root-canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl');

resize(canvas, gl);
window.addEventListener('resize', () => resize(canvas, gl));

const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
const program = createProgram(gl, vertShader, fragShader);
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const resolutionUniformLocation = gl.getUniformLocation(
  program,
  'u_resolution',
);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const size = 2;
const type = gl.FLOAT;
const normalize = false;
const stride = 0.0;
const offset = 0.0;
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset,
);
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function setRectangle(
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW,
  );
}

const colorUniformLocation = gl.getUniformLocation(program, 'u_color');

for(let i = 0; i < 50; ++i) {
  setRectangle(gl, randomInt(canvas.width), randomInt(canvas.height), randomInt(canvas.width), randomInt(canvas.height));
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1.0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
