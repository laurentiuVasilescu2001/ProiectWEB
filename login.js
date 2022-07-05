var btnAutentificare = document.getElementById("Autentificare");   
btnAutentificare.addEventListener("click", function(){    
    var inputUser= document.getElementById("Utilizator").value; 

    var xhr = new XMLHttpRequest()   
	xhr.open('GET', 'http://api.ipify.org?format=json'); 
    xhr.onreadystatechange = function() {  
        if (xhr.readyState == 4 && xhr.status == 200) {  
            const detaliiIp = JSON.parse(xhr.responseText);  
            const ip = detaliiIp.ip; 

            
        
            var detaliiExistente = localStorage.getItem(inputUser+"Detalii");  
            var firstLogin = false  
            if(detaliiExistente == null) {
                firstLogin = true
            }
        
            var detaliiLogin= {   
                "ip": ip,
                "firstLogin": firstLogin,
                "dateLogin": new Date().toLocaleString()  
            }
            var d=JSON.stringify(detaliiLogin); 
            localStorage.setItem(inputUser+"Detalii", d); 

            localStorage.setItem("userName", inputUser);  
            window.location.href = "http://localhost:8080/mesaje.html?user="+inputUser;  
        }
    }
    xhr.send();  
});
