const formulario = document.querySelector('#formulario-contacto');
const botonEnviar = document.querySelector('.btn-enviar');


const nameContact = document.getElementsByName('name_contact')[0];
const email = document.getElementsByName('email_contact')[0];
const phone = document.getElementsByName('phone_contact')[0];
const topic = document.getElementById('topic_contact');
const commit =  document.getElementsByName('commit_contact')[0];

const errorsList = document.getElementById('errors');

function showError(element, message){
    element.classList.toggle ('error');
    errorsList.innerHTML += `<li>${message}</li>`
}

function cleanErrors(){
    errorsList.innerHTML = '';
}

async function sendMail(name, email,phone,select, comment){
   const rawResponse =await fetch ('https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email',{
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({name, email, phone, select, comment})
    });
    const content = await rawResponse.json();
    if(Object.keys(content.errors).length > 0){
        alert('Error al enviar correo')
    }else{
        alert('Mensaje enviado')
    }
}
/*
Campo nombre y apellido no debe estar vacio y contener al menos un espacio.
Campo correo debe tener un correo valido.
Campo numero de telefono debe tener entre 7 y 15 digitos, 
    pudiendo tener un + al inicio, ignorando espacios en blanco.
Campo comentario debe tener al menos 20 caracteres.

*/


botonEnviar.addEventListener('click', (event)=>{
    event.preventDefault();
    cleanErrors();
    let hasErrors = false;
    const sanitizedName = nameContact.value.trim();
    if(sanitizedName.length === 0 || sanitizedName.indexOf(' ') < 0){
        showError(nameContact, 'El nombre y apellido no debe estar vacio debe contener al menos un espacio.');
        hasErrors = true;
    }
    const mailRe = /\w+@\w+\.\w{2,7}/;
    if(!mailRe.exec(email.value)){
        showError(email, 'El correo debe seguir un formato valido');
        hasErrors = true;

    }
    const phoneRe =  /^\+?\d{7,15}$/;
    const sanitizedPhone = phone.value.replace(' ', '');
    if(!phoneRe.exec(sanitizedPhone)){
        showError(phone, 'El numero de telefono debe tener entre 7 y 15 digitos.');
        hasErrors = true;
    }
    const sanitizedCommit = commit.value.trim();
    if(sanitizedCommit.length < 20){    
        showError(commit, 'El mensaje debe tener al menos 20 caracteres de largo.');
        hasErrors = true;


    }
    if(!hasErrors){
        sendMail(sanitizedName, email.value, sanitizedPhone, topic.value, sanitizedCommit);
    }
})
