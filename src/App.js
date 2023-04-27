//Implementing a transform stream
//other will not be able to decipher the data of the file unless they has your decryption

//encryption/decryption => using crypto module
//hashing-salting => using crypto module
//compression  =>using zlib module
//encoding/decoding => using buffer text-encoding/decoding

const {encryptor} = require("./encryptor")
const {decryptor} = require("./decryptor")

/* @param (source:string,destination?:string) */

encryptor("../files/read.txt","../files/encrypted.txt")  // I am currently using the relative path but you can also add the absolute path
// decryptor("../files/encrypted.txt","../files/decrypted.txt")
