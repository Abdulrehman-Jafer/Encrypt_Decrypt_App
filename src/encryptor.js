const {Transform} = require("node:stream")
const fs = require("node:fs/promises")


let bytesEncrypted = 0
let percentage_completed = 0
let one_percent;
class Encrypt extends Transform {
    
    _transform(chunk,encoding,cb) {
        for(let i=0; i<chunk.length; i++){
            if(chunk[i] !== 255){ 
                chunk[i] = chunk[i] + 1
                bytesEncrypted++
                if(bytesEncrypted >= one_percent){
                    let done = Math.floor((bytesEncrypted/FileSize) * 100)
                    percentage_completed += done
                    bytesEncrypted = 0
                    console.log(`Encrypted ${percentage_completed}%...`)
                }
            }
        }
        // this.push(chunk)
        cb(null,chunk)
    }
}

let FileSize;

const encryptor = async (file,saveTo)=> {
    const readFileHandle = await fs.open(file,"r")
    const writeFileHandle = await fs.open(saveTo ?? "./encrypted.txt","w")

    const stat = await readFileHandle.stat()
    FileSize = stat.size
    one_percent = FileSize/100

    const readStream = readFileHandle.createReadStream()
    const writeStream = writeFileHandle.createWriteStream()
    const encrypt = new Encrypt()
    readStream.pipe(encrypt).pipe(writeStream)
    readStream.on("end",()=>{
        console.log(`Encrypted 100%...`)
        console.log("Encryption completed!")
    })
}

module.exports = {
    encryptor
}