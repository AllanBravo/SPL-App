  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

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

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");

        // The core Firebase JS SDK is always required and must be listed first -->
     var url="https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js"

// TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDEGAYhuB7-vrb2b20EIx7lze2fbuUQ17w",
    authDomain: "spl-app-abaad.firebaseapp.com",
    databaseURL: "https://spl-app-abaad.firebaseio.com",
    projectId: "spl-app-abaad",
    storageBucket: "spl-app-abaad.appspot.com",
    messagingSenderId: "903764480502",
    appId: "1:903764480502:web:6bfe1e8eaa3e787ae737d7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


    $$("#enter").on("click", function(){
        var email = "usuario@dominio.com";
    var password = "123456";
    firebase.auth().createUserWithEmailAndPassword(email, passowrd)
    .catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
            alert("Clave muy debil.");
        } else {
            alert(errorMessage);
        }
        console.log(error);




    });
    });

    

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="secondpage"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    
})


/** FUNCIONES PROPIAS **/




