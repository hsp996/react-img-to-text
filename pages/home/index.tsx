import Tesseract from 'tesseract.js';
import {FC, useEffect, useState,useRef} from "react";
import {ImageUploader} from "antd-mobile";
import {preprocessImage} from "../../utils";
import styles from './home.module.scss'

const Home: FC = function () {
    const [ocrText,setOcrText]=useState('')
    const [image,setImage]=useState('')
    const [fileList,setFileList]=useState<any[]>([])
    const canvasRef = useRef<any>(null)
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
    const mockUpload = async function (file: File){
        const url = URL.createObjectURL(file)
        const image = new Image()
        image.src = url
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        image.onload=function () {
            ctx.drawImage(image,0,0)
            ctx.putImageData(preprocessImage(canvas),0,0)
            const dataUrl = canvas.toDataURL("image/jpeg");
            odOCR(dataUrl)
        }
        // odOCR(url)
        return {
            url,
        }
    }
    useEffect(()=>{

    },[])
    return <div>
        <div className={styles.f_js_as}>
            <ImageUploader
                style={{'--cell-size':'300px',marginRight:'20px'}}
                value={fileList}
                maxCount={1}
                onChange={setFileList}
                upload={mockUpload}
            />
            <canvas ref={canvasRef} width={1000} style={{background:'#cec1c1'}} height={500}></canvas>
        </div>
        <p style={{color:"black",fontSize:'28px',width:'800px'}}>{ocrText}</p>
    </div>
}


export default Home