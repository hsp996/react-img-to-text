## OCR
OCR 是光学字符识别和光学字符阅读器。它用于从图像中读取

## Tesseract.js

Tesseract.js 是一个js库，它将原始的 C 编译为 js WebAssembly(运行在 web 平台的 Assembly，Assembly 是指汇编代码，是直接操作 CPU 的指令代码)
正如 Tesseract.js 官网所说，它支持100多种语言，自动文本定位和脚本检测，用于阅读段落、文字和字符边界框的简单界面

Tesseract 是用于各种操作系统的光学字符识别引擎，目前有Google维护。这个 OCR 引擎的优点是可以不断的进行训练，增强图像转文本的能力

## Tesseract API

根据 Tesseract.js 官方文档，使用方法有以下两种

```ecmascript 6
Tesseract.recognize(
  image,language,
  { 
    logger: m => console.log(m) 
  }
)
.catch (err => {
  console.error(err);
})
.then(result => {
 console.log(result);
})

```
图像格式支持 jpg png bmp、pmb
这个 image 参数是类似于图片，取决于是在浏览器运行还是 node.js 运行
如果在浏览器上面，image 参数是：
 一个 img 或者 canvas 图片
 一个 file 对象 (<input>)
 一个 Blob 对象
 base64编码图片
Node.js中，image 参数是：
本地图片路径
存储二进制图片的缓存区
base64编码图片

语言是字符串类型，多种语言用+拼接， 'eng+chi_sim'

Tesseract 自动生成的对象作为 logger 函数的参数。随着识别过程的发生，每次调用函数时都会更新 logger 对象属性，
因此，它可用于转换转换进度条等

```ecmascript 6
{
    progress: 0
    status: "loading language traineddata"
    userJobId: "Job-9-ea2b5"
    workerId: "Worker-2-328a0"

}
```


```ecmascript 6
import { createWorker } from 'tesseract.js';
const worker = createWorker({
    logger: m=> console.log(m)
})
(
    async ()=>{
        await  worker.load();
        await  worker.loadLanguage('chi_sim')
        await  worker.initialize('chi_sim')
        const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
        await worker.terminate()
    }
)()
```

## 二值化
二值化是将图片的像素转为黑色或白色，为了确定像素属于黑色还是白色，设定一个阈值，大于阈值的为黑色，小于阈值的为白色

## 去噪
可以通过模糊图片来去除图片中的补丁，有两种方法分别为 框模糊、高斯模糊,
模糊是降低图像的清晰度来平滑图像的颜色。

## 反转
反转是将图像的浅色区域变为深色区域，将深色区域变为浅色

## 放大
增加图片中对象的亮度，比如白色文本的亮度
