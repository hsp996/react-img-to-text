import Tesseract,{createWorker} from 'tesseract.js';
import {FC, useEffect, useState,useRef} from "react";
import {ImageUploader} from "antd-mobile";
import {preprocessImage} from "../../utils";
import styles from './home.module.scss'

const Home: FC = function () {
    const [ocrText,setOcrText]=useState('')
    const [fileList,setFileList]=useState<any[]>([])
    const canvasRef = useRef<any>(null)
    const imgRef = useRef<any>(null)
    const odOCR = function (image: any){
        Tesseract.recognize(
            image,
            'chi_sim',
            {
                logger:m => console.log(m)
            }
        ).then(({data: result})=>{
            console.log('result', result)
            setOcrText(result?.text)
        })
    }
    const worker = createWorker({
        logger:m=>console.log(m),
    })
    const odOCR2= async function (img: any){
        await worker.load()
        await  worker.loadLanguage('chi_sim')
        await  worker.initialize('chi_sim')
        const { data: { text } } = await worker.recognize(img);
        setOcrText(text)
        await worker.terminate()
    }
    const mockUpload = async function (file: File){
        const url = URL.createObjectURL(file)
        imgRef.current.src = url
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        imgRef.current.onload=function () {
            ctx.scale(0.5,0.5)
            ctx.drawImage(imgRef.current,0,0,imgRef.current.width * 4,imgRef.current.height * 4)
            ctx.putImageData(preprocessImage(canvas),0,0)
            const dataUrl = canvas.toDataURL("image/jpeg");
            odOCR(dataUrl)
        }
         // odOCR(url)
        return {
            url:'',
        }
    }
    useEffect(()=>{

    },[])
    return <div>
        <div className={styles.f_js_as}>
                <ImageUploader
                    style={{marginRight:'20px'}}
                    value={fileList}
                    maxCount={1}
                    onChange={setFileList}
                    upload={mockUpload}
                />
                <img  ref={imgRef}  width={400} src="" alt=""/>
            <canvas ref={canvasRef} width={800} style={{transform:'scale(0.5,0.5)',transformOrigin: '0 0', marginLeft: 20}} height={500}></canvas>
        </div>
        <p style={{color:"black",fontSize:'28px',width:'800px'}}>{ocrText}</p>
    </div>
}


export default Home