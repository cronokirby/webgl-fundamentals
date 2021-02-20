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

interface Attributes {
  a_position: number;
}

interface Uniforms {
  u_resolution: WebGLUniformLocation;
  u_color: WebGLUniformLocation;
  u_translation: WebGLUniformLocation;
}

interface Buffers {
  position: WebGLBuffer;
}

class Context {
  private constructor(
    private gl: WebGLRenderingContext,
    private program: WebGLProgram,
    private attributes: Attributes,
    private uniforms: Uniforms,
    private buffers: Buffers,
  ) {}

  static init(gl: WebGLRenderingContext): Context {
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
    const program = createProgram(gl, vertShader, fragShader);
    const attributes = {
      a_position: gl.getAttribLocation(program, 'a_position'),
    };
    const uniforms = {
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_color: gl.getUniformLocation(program, 'u_color'),
      u_translation: gl.getUniformLocation(program, 'u_translation'),
    };
    const buffers = {
      position: gl.createBuffer(),
    };
    return new Context(gl, program, attributes, uniforms, buffers);
  }

  setRectangle() {
    const x1 = 0;
    const x2 = 100;
    const y1 = 0;
    const y2 = 200;

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      this.gl.STATIC_DRAW,
    );
  }

  draw(translation: [number, number]) {
    const color = [Math.random(), Math.random(), Math.random(), 1];

    this.gl.viewport(0.0, 0.0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.attributes.a_position);
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);

    this.gl.vertexAttribPointer(
      this.attributes.a_position,
      2,
      gl.FLOAT,
      false,
      0,
      0,
    );

    this.gl.uniform2f(
      this.uniforms.u_resolution,
      this.gl.canvas.width,
      this.gl.canvas.height,
    );
    this.gl.uniform2f(
      this.uniforms.u_translation,
      translation[0],
      translation[1],
    );
    this.gl.uniform4fv(this.uniforms.u_color, color);

    this.gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  resize() {
    this.gl.canvas.width = document.body.clientWidth;
    this.gl.canvas.height = document.body.clientHeight;
    this.draw([0, 0]);
  }
}

// This cast will not be sound if the HTML element isn't actually a canvas
const canvas = document.getElementById('root-canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl');
const ctx = Context.init(gl);
ctx.setRectangle();

window.addEventListener('resize', () => ctx.resize());
ctx.resize();
