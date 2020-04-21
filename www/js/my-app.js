  
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
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

//Base de Datos

var db, refUsuarios, refTiposUsuarios;

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

    //$$("#guardar").on("click", fnGuardarDP);

    $$("#abrirCamara").on("click", getImage);
    $$("#abrirGaleria").on("click", selImage);
    
})




/** FUNCIONES PROPIAS **/

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
                              mainView.router.navigate("/secondpage/");
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

function onSuccess(imageData) {
    var image = document.getElementById("myImage");
    image.src = imageData;
}

//FIN CAMARA




function fnMostrarError(txt) {
  if (mostrarErrores == 1) {
      console.log("ERROR: " + txt);
  }
}
