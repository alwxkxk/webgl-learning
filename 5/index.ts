// 第一步，获取canvas元素并创建webgl上下文

const canvas:HTMLCanvasElement = document.querySelector("#glcanvas")
const gl = canvas.getContext("webgl")

if(!gl){
  alert("浏览器不支持webgl。")
}

gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
gl.clearColor(0.0,0.0,0.0,1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

//第二步，创建vertex shader与fragment shader程序，连接起来并使用

const VertexSource = `
attribute vec4 a_position;

void main(){
  gl_Position = a_position;
}

`

const FragmentSource = `
void main(){
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}

`
//创建vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader,VertexSource)
gl.compileShader(vertexShader)
if(! gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
  alert("vertexShader 创建失败。")
}
//创建fragmentShader shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader,FragmentSource)
gl.compileShader(fragmentShader)
if(! gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
  alert("fragmentShader 创建失败。")
}

//创建并使用shader程序
const program = gl.createProgram()
gl.attachShader(program,vertexShader)
gl.attachShader(program,fragmentShader)
gl.linkProgram(program)
if(! gl.getProgramParameter(program,gl.LINK_STATUS)){
  alert("shader 程序 创建失败")
}

gl.useProgram(program)

//第三步，传入顶点数据
//生成buffer数据
let positionBuffer = gl.createBuffer()
let position = [
  0,0,
  0,0.5,
  0.7,0,
]

gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(position),gl.STATIC_DRAW)
//转换成attribute
let positionAttribute = gl.getAttribLocation(program,"a_position")
gl.enableVertexAttribArray(positionAttribute)
gl.vertexAttribPointer(positionAttribute,2,gl.FLOAT,false,0,0)
// 画
gl.drawArrays(gl.TRIANGLES,0,3)
