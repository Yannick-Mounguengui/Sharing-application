let userlogin;
let userpassword;
const setup = () => {
    userlogin = document.getElementById('userlogin');
    userpassword = document.getElementById('userpassword');
    document.getElementById('login').addEventListener('click', login);
}
window.addEventListener('DOMContentLoaded', setup);

const login = async() => {
  //const userinfo=document.getElementById("userId");
    const userData = { login: userlogin.value, password: userpassword.value };
    const body = JSON.stringify(userData);
    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: body
    };
    const response = await fetch(`/access/login`, requestOptions);
    if (response.ok) {
       //const createdUser = await response.json();
       //console.log(`user registered : ${JSON.stringify(createdUser)}`);
        //userinfo.innerHTML=`${loggedUser.name} id is ${loggedUser.login}`;
        window.location.href = '/share-app.html';
      //window.location.href = '/user/me';
    } else {
        const error = await response.json();
        document.getElementById('problem').textContent = `erreur : ${error.message}`;
    }
}
