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
// gl_Position 代表最终得到的点位置
// gl_FragColor 代码最终渲染的颜色

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
//gl.COMPILE_STATUS ：GL常量，返回 是否编译成功
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
gl.attachShader(program,fragmentShader) //经测试，可attach多个shader。
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
// gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
// gl.STATIC_DRAW: GL常量，提示这个buffer数据是经常用到并且不会经常改变
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(position),gl.STATIC_DRAW)
//得到attribute的位置 index值，当没找到时返回-1，在这里返回0。（GLint 32位的数据）
let positionAttribute = gl.getAttribLocation(program,"a_position")
// GPU维护 attribute列表，默认不使用，需要先开启才能继续调用其它相关API
gl.enableVertexAttribArray(positionAttribute)
// 设置如何读取attrib
// gl.vertexAttribPointer(index, size, type, normalized, stride, offset)
gl.vertexAttribPointer(positionAttribute,2,gl.FLOAT,false,0,0)
// 渲染图形 renders primitives from array data
gl.drawArrays(gl.TRIANGLES,0,3)
