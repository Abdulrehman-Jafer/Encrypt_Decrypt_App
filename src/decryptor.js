const {Transform} = require("node:stream")
const fs = require("node:fs/promises")


let bytesDecrypted = 0
let percentage_completed = 0
let one_percent;

class Decrypt extends Transform {

    _transform(chunk,encoding,cb) {
        for(let i=0 ; i<chunk.length; i++){        // 1 chunk has 65536 bytes
            if(chunk[i] !== 255){
                chunk[i] = chunk[i] - 1
                bytesDecrypted++
                if(bytesDecrypted >= one_percent){
                    percentage_completed += Math.floor((bytesDecrypted/FileSize) * 100)
                    bytesDecrypted = 0
                    console.log(`Encrypted ${percentage_completed}%...`)
                }
            }
        }
        cb(null,chunk)
    }
}


let FileSize;

const decryptor = async (file,saveTo) => {
    const readFileHandle = await fs.open(file,"r")
    // const writeFileName = file.substring(0,file.indexOf(".txt"))
    const writeFileHandle = await fs.open(saveTo ?? `./decrypted.txt`,"w")

    const stat = await readFileHandle.stat()
    FileSize = stat.size
    one_percent = FileSize/100

    const readStream = readFileHandle.createReadStream()
    const writeStream = writeFileHandle.createWriteStream()
    const decyrpt = new Decrypt()
    readStream.pipe(decyrpt).pipe(writeStream)
    readStream.on("end",()=>{
        console.log(`Decrpted 100%...`)
        console.log("Decrytion was Successful!")
    })
}

module.exports = {
    decryptor
}