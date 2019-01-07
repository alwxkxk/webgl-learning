# webgl-learning
WebGL个人学习代码记录

## 目录
- 1 创建WebGL环境
- 2 MDN第二个例子，最好了解一些3D 矩阵的基本知识，才能搞明白。
- 3 画一个三角形
[例子来源](https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html)
- 4 传入两次 顶点数据
WebGL How It Works 第二个例子
- 5 用TS自行重写一次3，并写好对应步骤，方便回忆。
- 6 加载图片作为纹理，由于跨域问题所以必须以http服务运行：`http-server . -p 8000`
- 7 未完成，图片处理，多纹理效果共同作用，暂时跳过。
- 8 2D矩形:可输入 坐标、宽高。
- 9 2D矩形：将网页坐标转换成投影坐标
- 10 2D矩形：平移、旋转、缩放。 注意初始坐标与平移的区别，旋转是依据初始坐标来变化。改变初始坐标会影响旋转效果，改变平移不会影响旋转效果。
- 11 2D矩形：使用矩阵实现 平移、旋转、缩放。使用矩阵能简化复杂的运算。
- 12 2D矩形：围绕中心旋转（向中心偏移）
- 13 3D矩形：只画了两面，实现旋转。