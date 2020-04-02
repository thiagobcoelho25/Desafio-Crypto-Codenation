var urlGet = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=fc808a80c9f2372f1f0891ffd87a3d1d611828bf";
var urlPost = "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=fc808a80c9f2372f1f0891ffd87a3d1d611828bf";


const fs = require("fs");
const axios = require('axios').default;
const FormData = require('form-data');
const sha1 = require('sha1');
 

axios.get(urlGet).then(resp => {
    console.log(resp.data);
    let obj = JSON.stringify(resp.data);
    obj = JSON.parse(obj);
    obj.decifrado = resolverCripto(obj.cifrado,obj.numero_casas);
    obj.resumo_criptografico = sha1(obj.decifrado);
    
    fs.writeFile("./answer.json", JSON.stringify(obj),function(err) {//nao precisa de fs.close();
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    EnviarPOST();
    
}).catch(err => {console.log("Error de GET: " + err)});

function resolverCripto(texto, num) {
    let alf = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let alfC = [];


    alfC = [...alf.slice(num), ...alf.slice(0, num)];

    let decifrado = "";

    for (let i = 0; i < texto.length; i++) {
        if (alf.indexOf(texto[i].toLowerCase()) != -1) {
            decifrado = decifrado.concat(alf[alfC.indexOf(texto[i].toLowerCase())]);
        } else {
            decifrado = decifrado.concat(texto[i]);
        }
    }
    return decifrado;
}
function EnviarPOST(){
    
    const formData = new FormData();
    formData.append('answer',fs.createReadStream("./answer.json"));
    
    axios({
        method: 'post',
        url: urlPost,
        data: formData,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            /*Error por causa do boundary i.e 400  undefined
            https://github.com/axios/axios/issues/318#issuecomment-413152638
            */
        }
      }).then(resp =>{
        //handle success  
        console.log("Resposta POST: " + resp);
      }).catch((error) => console.log("Error no POST: "+error+ "\t"+ error.response.request._response ) );
      
}