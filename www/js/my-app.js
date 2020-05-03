  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var mostrarErrores = 1;


var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/secondpage/',
        url: 'secondpage.html',
      },
      {
        path: '/paginaprincipal/',
        url: 'paginaprincipal.html',
      },
      {
        path: '/chat/',
        url: 'chat.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

//Base de Datos

var db, refUsuarios, refTiposUsuarios;

var nombre, apellido , paginaweb , telefono , fnac , email;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

    //seteo variables BD

    db = firebase.firestore();
    refUsuarios = db.collection("USUARIOS");
    refTiposUsuarios = db.collection("TIPO_USUARIO");

    var iniciarDatos = 0;
    if (iniciarDatos == 1) {
        fnIniciarDatos();
    }
    
    fnMostrarError("Device is ready!");

        


    $$("#enter").on('click', fnRegistro);
    $$("#ingreso").on('click', fnIngreso);



    

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    fnMostrarError(e);

    



})


// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="secondpage"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    fnMostrarError(e);

    $$("#guardar").on("click", fnGuardarDP);

    $$("#abrirCamara").on("click", getImage);
    $$("#abrirGaleria").on("click", selImage);
    
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="paginaprincipal"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    fnMostrarError(e);

    fnXML();
    var parser, xmlDox;

    function fnXML() {
        url = "https://primerlector.com.ar/feed/";
        app.request.get(url, function (data) {
        console.log(data);

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(data,"text/xml");

        alert(xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue);

        $$('.article').html(data);
        console.log('hola');
        });
    

} 

    
    })



/** FUNCIONES PROPIAS **/

function crearNoticiaHtml(codigo) {
    noticiaHTML = " ";
      noticiaHTML += codigo + "<br>";
      return noticiaHTML;
}

function fnRegistro() {

    var elMail = $$('#email').val(); // es un input... uso val!
    var laClave = $$('#clave').val(); // es un input... uso val!

    email = elMail;

    var huboError = 0;

    firebase.auth().createUserWithEmailAndPassword(elMail, laClave)          
      .catch(function(error) {       
        // Handle Errors here.
        huboError = 1;
        var errorCode = error.code;
        var errorMessage = error.message; 
        
        fnMostrarError(errorCode);
        fnMostrarError(errorMessage);
      })
      .then(function(){
          if(huboError == 0){
            // alert('OK');
            // lo seteo en el panel.... contenedor lblEmail
            //$$('#lblEmail').text(elMail);   // es una etiqueta html. Text va sin formato
            mainView.router.navigate("/secondpage/");
          }
      });
}


//HAY QUE VER ESTO!! 

function fnIngreso() {


    email = $$('#email').val();
    var clave = $$('#clave').val();
       
//Se declara la variable huboError (bandera)
    var huboError = 0;
        
    firebase.auth().signInWithEmailAndPassword(email, clave)
        .catch(function(error){
//Si hubo algun error, ponemos un valor referenciable en la variable huboError
            huboError = 1;
            var errorCode = error.code;
            var errorMessage = error.message;
            fnMostrarError(errorMessage);
            fnMostrarError(errorCode);
        })
        .then(function(){   
//En caso de que esté correcto el inicio de sesión y no haya errores, se dirige a la siguiente página
            if(huboError == 0){

                tipoUsuario = "";

                // recuperar el tipo de usuario segun el email logueado....
                // REF: https://firebase.google.com/docs/firestore/query-data/get-data
                // TITULO: Obtén un documento
                
                refUsuarios.doc(email).get().then(function(doc) {
                      if (doc.exists) {
                          //console.log("Document data:", doc.data());
                          //console.log("Tipo de Usuario: " + doc.data().tipo );
                          tipoUsuario = doc.data().tipo;

                          if ( tipoUsuario == "VIS" ) {
                              mainView.router.navigate("/paginaprincipal/");
                          }
                          if ( tipoUsuario == "ADM" ) {
                              mainView.router.navigate("/panel_admin/");
                          }
                          


                      } else {
                          // doc.data() will be undefined in this case
                          //console.log("No such document!");
                      }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });


            }

        }); 



}

//BASE DE DATOS

function fnGuardarDP() {
    nombre = $$("#nombre").val();
    apellido = $$('#apellido').val();
    paginaweb = $$('#paginaweb').val();
    telefono = $$('#telefono').val();
    fnac = $$('#fnac').val();
    clave= $$('#clave').val();

    //clave: variable de datos

    var data = {
        nombre: nombre,
        apellido: apellido,
        web: paginaweb,
        telefono: telefono,
        fnac: fnac,
        clave: clave,
        tipo: "VIS",
    }

    refUsuarios.doc(email).set(data);

    var wrong = 0;

    if (wrong==0) {
        mainView.router.navigate("/paginaprincipal/");
    }


}

//INICIO CAMARA

function getImage() {
    navigator.camera.getPicture(onSuccess,onError,
        {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA
        });
}

function selImage() {
    navigator.camera.getPicture(onSuccess,onError,
        {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
}



function onError(){
    console.log("error camara");
}

function idRandom(){
  var result = "";
  var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var caracteresLength = caracteres.length;
  for(var i = 0; i < 25; i++){
    result += caracteres.charAt(Math.floor(Math.random() * caracteresLength ));
  }
  return result;
}

function onSuccess(imageData) {
    //var image = document.getElementById("myImage");
    //image.src = imageData;

    var nombreAleatorio = idRandom;
    var Imagenes = nombreAleatorio + ".jpg";
    var direccionImagen = "images/" + Imagenes;

    var storage = firebase.storage();
    var storageRef = firebase.storage().ref();
    

    var getFileBlob = function(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener("load", function(){
            cb(xhr.response);
        });
        xhr.send();
    }

    var blobToFile = function(blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
    }

    var getFileObject = function(filePathOrUrl, cb) {
        getFileBlob(filePathOrUrl, function(blob){
            cb(blobToFile(blob, Imagenes));
        });
    }

        getFileObject(imageData, function(fileObject) {
          var uploadTask = storageRef.child(direccionImagen).put(fileObject);

          uploadTask.on('state_changed', function(snapshot) {
             console.log(snapshot);
          }, function(error) {
             console.log(error);
          }, function() {
             //var downloadURL = uploadTask.snapshot.downloadURL;
             //console.log(downloadURL);
             // handle image here
             storageRef.child(Imagenes).getDownloadURL().then(function(url) {
             // `url` is the download URL for 'images/stars.jpg'

             // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
            var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

             // Or inserted into an <img> element:
            var img = document.getElementById('myImage');
            img.src = imageData;
            }).catch(function(error) {
             // Handle any errors
            }); 
          });
       });



}

//FIN CAMARA




function fnMostrarError(txt) {
  if (mostrarErrores == 1) {
      console.log("ERROR: " + txt);
  }
}
