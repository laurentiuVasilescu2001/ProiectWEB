const loadPosts=function(){  
    var userName=localStorage.getItem("userName");  
    const urlParams = new URLSearchParams(window.location.search); 
    const userNameURL = urlParams.get('user'); 
    var xhr = new XMLHttpRequest()  
	xhr.open('GET', 'http://localhost:3000/users/'+userNameURL+'/posts'); 
    xhr.onreadystatechange = function(){  
        if (xhr.readyState == 4 && xhr.status == 200) {  
            const posts=JSON.parse(xhr.responseText);  
            var lista =document.getElementById("listaPostari"); 
            lista.innerHTML = "";  
            for(p of posts){  
                var divThread = document.createElement("div");
                divThread.classList.add("thread");  

                var divTweet=document.createElement("div");
                divTweet.classList.add("tweet");
                divThread.appendChild(divTweet);

                var img=document.createElement("img");
                if(p.stare=="fericit"){
                    img.src="images/smile.png";
                    divTweet.appendChild(img);
                }
                else if(p.stare=="trist") {
                    img.src="images/sad.png";
                    divTweet.appendChild(img);
                }

                else if(p.stare=="plictisit") {
                    img.src="images/bored.png";
                    divTweet.appendChild(img);
                }

                else {
                    img.src="images/thinking.png";
                    divTweet.appendChild(img);
                }

                var divBody=document.createElement("div");
                divBody.classList.add("body");
                divTweet.appendChild(divBody);

                var divSimple=document.createElement("div");
                divBody.appendChild(divSimple);

                var divTitle=document.createElement("div");
                divTitle.classList.add("title");
                divTitle.innerHTML=p.titlu; 
                divSimple.appendChild(divTitle)

                var divMessage=document.createElement("div");
                divMessage.classList.add("message");
                divMessage.innerHTML=p.descriere;
                divSimple.appendChild(divMessage);

                var divData=document.createElement("div");
                divData.classList.add("message");
                divData.innerHTML=p.data;
                divSimple.appendChild(divData);

                if(userNameURL==userName){ 
                    var btnDelete=document.createElement("button"); 
                    btnDelete.classList.add("button-delete");
                    btnDelete.innerHTML="Stergere";
                    btnDelete.setAttribute("id", p.id); 
                    btnDelete.onclick = function(e) {  
                        var xhr = new XMLHttpRequest(); 
                        xhr.open('DELETE', 'http://localhost:3000/users/'+userNameURL+'/posts/' + e.target.id); 
                        xhr.onreadystatechange = function(){  
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                loadPosts(); 
                             }
                        }
                        xhr.send(); 
                    }
                    divBody.appendChild(btnDelete);
                }
               
                lista.appendChild(divThread);

                
            }
            if(userNameURL!=userName){ 
                document.getElementById("formPosteaza").remove(); 
            }
        }
	}
    xhr.send(); 
}

window.onload = function() {  
    var userName=localStorage.getItem("userName"); 
    document.getElementById("Titlu").innerHTML = "Bine ai venit, "+ userName +"!"; 
    setInterval(function(){ 
         var userNameTime=localStorage.getItem(userName+"Time"); 
         if (userNameTime==null)
            userNameTime=1000;
        else userNameTime=parseInt(userNameTime)+ 1000;  
        localStorage.setItem(userName+"Time", userNameTime); 
        var SecUserNameTime=(userNameTime%60000)/1000;
        var RestSecUserNameTime=(userNameTime%60000);
        var MinUserNameTime=(userNameTime-RestSecUserNameTime)/60000;

        document.getElementById("TimpPetrecut").innerHTML= "Timp petrecut in aplicatie: "+MinUserNameTime+" minute si "+SecUserNameTime+" secunde"; 
    }, 1000);
    loadPosts(); 
    var userNumarAccesari=localStorage.getItem(userName+"Accesari"); 
    if (userNumarAccesari==null)
        userNumarAccesari=1;
    else userNumarAccesari=parseInt(userNumarAccesari)+ 1; 
    localStorage.setItem(userName+"Accesari", userNumarAccesari);
    document.getElementById("NumarAccesari").innerHTML= "Ai vizitat site-ul de: "+userNumarAccesari+" ori";

    var detaliiLogin=localStorage.getItem(userName+"Detalii"); 
    var d= JSON.parse(detaliiLogin); 

    if(d.firstLogin == true) {
        document.getElementById("DetaliiLogin").innerHTML = "Salut, te-ai logat azi pentru prima oara";
    } else {
        document.getElementById("DetaliiLogin").innerHTML ="Salut, " +  userName + "  ultima oara ai intrat de pe ip-ul " + d.ip + " la data de "+ d.dateLogin;
    }

  };

var btnPosteaza = document.getElementById("Posteaza"); 
btnPosteaza.addEventListener("click", function(){  
    var inputPostare= document.getElementById("postare").value;
    var inputDescriere= document.getElementById("descriere").value;
    var inputRadio = document.getElementsByName('stare'); 
    var stare 

    for (var i = 0, length = inputRadio.length; i < length; i++) {
      if (inputRadio[i].checked) {
        stare=inputRadio[i].value;
        break;
      }
    }
    var post=
    {
        "titlu": inputPostare,
        "descriere": inputDescriere,
        "stare" : stare

    }
    var userName=localStorage.getItem("userName");
    xhr = new XMLHttpRequest(); 
    xhr.open("POST", "http://localhost:3000/users/"+userName+"/posts", true); 
    xhr.setRequestHeader("Content-type", "application/json");  
    xhr.onreadystatechange = function () {  
        if (xhr.readyState == 4 && xhr.status == 200) { 
           loadPosts();
        }
    }
    xhr.send(JSON.stringify(post)); 
});




  