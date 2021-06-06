const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const qrcode = require('qrcode-terminal');

const SESSION_FILE_PATH = './session.json'
let client;
let session;

const withSession = () => 
{
    const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp...')}`);
    sessionData = require(SESSION_FILE_PATH);
    spinner.start();

    client = new Client({
        session :sessionData
    })

    client.on('ready', () => {
        console.log('Client is ready!');
        spinner.stop();
        listenNewMenssage();
    })

    client.on('auth_failure', () =>{
        spinner.stop();
        console.log("********* Error en la session ************")
    })

    client.initialize();

}


/**
* esta funcion genera el codigo qr 
*/
const withOutSession = () => 
{
    console.log("no tenemos la session guardada");
    client = new Client();
    client.on('qr', qr => {
    
        // Generate and scan this code with your phone
    console.log(qr);
    qrcode.generate(qr, {small:true});
    });

    client.on('authenticated', (session) =>{

        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err){
            if(err)
            {
                console.log(err)
            }
        });
    });

    client.initialize();
}

/**
 * esta funcion se encarga de escuchar los mensajes que van ingresando nuevos.
 */

const listenNewMenssage = () => 
{
    console.log('read menssage')

    client.on('message', (msg) =>{
        const {from, to, body} = msg;
        console.log('Nuevo Mensaje')
        console.log(from, to, body);

        // sendMenssage(from, 'En breve le respondere, este es un mensaje de prueba');

    });
}

/**
 * eviamos mensaje automatico
 */
const sendMenssage = (to, message) => 
{
    console.log('Enviando mensaje')
   
    client.sendMessage(to,message)
   
    console.log(to,  message)
}




/** */
(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();
