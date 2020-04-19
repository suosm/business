var stato;
var lat;
var lon;
var acc;
var truelat;
var truelon;
var distGPStoSelection = 0;
var marker;
var posID;
var nopostcode = false;

// Ottiene l' inserimento automatico dell' indirizzo
function getDataFromNominatim(lat, lon){
  var request = "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon + "&format=jsonv2&accept-language=it&zoom=10&namedetails=1";
  $.getJSON( request, function( data ) {
    // Inserisce istruzioni sull' indirizzo a seconda della regione
    switch (data.address.state){
      case "Trentino-Alto Adige" : $("#stradaMex").html("🌐 Se il tuo comune è multilingua, <b>inserisci il nome della strada in tutte le lingue parlate</b>, partendo da quella più utilizzata a quella meno utilizzata in questo formato <b>\"Nome1 - Nome2 - Nome 3\"</b> (es. Maiastraße - Via Maia)"); $('#comuneMex').html("🌐 Anche qui, come prima, <b>inserisci il nome in tutte lingue parlate</b> nel formato <b>\"Nome1 - Nome2 - Nome 3\"</b> (es. Urtijëi - St. Ulrich - Ortisei).<br>"); break;
      case "Sardegna" : $("#comuneMex").html("🌐 <b>Inserisci il nome della città sia nella lingua italiana che in quella locale</b> in questo modo <b>\"Nome locale/Nome italiano\"</b> (es. Nùgoro/Nuoro).<br>"); break;
      default : $("#comuneMex").html("");
    }

    // Inserisce città e CAP da Nominatim
  if(data.address.city != "")
    $('#comune').val(data.namedetails.name);
  if(typeof data.address.postcode != "undefined"){
    $('#cap').val(data.address.postcode);
  } else {
    $('#cap').val("");
    // Inserisce avviso "Manca l' indirizzo postale"
    $("#capMex").html('<div class="alert alert-warning small" role="alert"> ✉️ A quanto pare non abbiamo il CAP di questa città sul nostro database. 😓 Ci farebbe molto piacere che tu lo inserissi, così potremo inserirlo in questa città! </div>');
    nopostcode = true;
  }
 });
}

// Ferma la posizione
function stopLocation(){
  navigator.geolocation.clearWatch(posID);
  $("#pos-button").removeClass("disabled");
  $("#pos-img").removeClass("animated flash slower infinite");
  getDataFromNominatim(lat, lon);
}

  //Recupera le coordinate dal device
  function getLocation()
  {
    if (navigator.geolocation)
    {
      posID = navigator.geolocation.watchPosition(getDataFromGPS,showError,{enableHighAccuracy:true,timeout:240000});
      $("#geo-information").html('<div class="alert alert-info text-center" role="alert">🕵️‍ Ti stiamo localizzando... <div class="spinner-border spinner-border-sm float-right" role="status"></div></div>');
      $("#pos-button").addClass("disabled");
      $("#pos-img").addClass("animated flash slower infinite");
    }
    else{$("#geo-information").html('<div class="alert alert-danger" role="alert">😔 Il tuo browser non supporta la geolocalizzazione.</div>');}
  }

// Mostra i messaggi di errore
function showError(error)
{
  var text;
  var animation;
  (error.code > 1) ? animation = "animated shake" : animation = " ";
  switch (error.code){
  case 1 : text = '🥺 Non hai consentito l\' accesso alla posizione. Se hai dubbi sulla privacy, consulta le <a href="#come-funziona">informazioni</a> in fondo. ⬇️'; break;
  case 2 : text = "📡 Qualcosa non ha funzionato... Riprova più tardi. <b>Controlla di avere il GPS attivo</b>."; break;
  case 3 : text = "💤 L' accesso alla posizione sta impiegando più tempo del previsto."; break;
  default : text = "😨 Errore nella localizzazione.";
}
  $("#geo-information").html('<div class="alert alert-danger ' + animation + '" role="alert">'+ text +'</div>');
}



// Ottiene i dati dal GPS
function getDataFromGPS(position){
  $("#geo-information").html('<div class="alert alert-info text-center" role="alert">⌛‍ Aggiornamento... <div class="spinner-grow spinner-grow-sm float-right" role="status"></div></div>');
  truelat = position.coords.latitude;
  truelon = position.coords.longitude;
  updateData(truelat, truelon, position.coords.accuracy);
}

// Aggiorna i dati e li visualizza
function updateData(new_lat, new_lon, new_acc){
  lat = new_lat;
  lon = new_lon;
  acc = new_acc;
  showPosition();
}

// Function che aggiunge un marker alla mappa
function addMarker(){
if (typeof marker != "undefined") {
       map.removeLayer(marker);
       map.setView([lat, lon]);
} else {
  map.setView([lat, lon], 18);
}
marker = new L.Marker([lat, lon]);
if (typeof acc != 'undefined'){
  marker.bindPopup('Sei a circa '+ Math.round(acc) + 'm da qui');
} else {
  marker.bindPopup('Selezionato da te sulla mappa');
}
map.addLayer(marker);
}

// Aggiunge marker al click e ferma la localizzazione
function addMarkerClick(e){
  maxDist = 0.8 / 110.574;
  distGPStoSelection = Math.sqrt(Math.pow(e.latlng.lat - truelat, 2) + Math.pow(e.latlng.lng - truelon, 2));
// Controlla se la distanza non è eccessiva
  if(distGPStoSelection <= maxDist && stato == 1){
    updateData(e.latlng.lat, e.latlng.lng);
    stopLocation();
    $("#geo-information").html('<div class="alert alert-dark text-center" role="alert">📌 Modalità selezione manuale, la geolocalizzazione è in pausa. 🛑 </div>');
} else if (distGPStoSelection <= maxDist){
  $("#geo-information").html('<div class="alert alert-info text-center" role="alert">✋ Attendi che l\' accuratezza migliori prima di selezionare la posizione dalla mappa manualmente.<div class="spinner-grow spinner-grow-sm float-right" role="status"></div></div>');
} else if (stato == 1) {
    $("#geo-information").html('<div class="alert alert-danger text-center" role="alert">✋ Non puoi selezionare un punto così distante dalla tua posizione attuale.');
}
 }


  //Visualizza la posizione
function showPosition()
  {
  // aggiunge marker sulla mappa
  addMarker();
  map.on('click', addMarkerClick);


  //visualizza i dati nel div con id geo
  var text_pos = "Lat: " + lat + " Lon: " + lon;
  (typeof acc != 'undefined') ? text_pos += " Accuratezza: "+ Math.round(acc) + "m" : text_pos += '<span class="text-danger"> [Selezionato sulla mappa]</span>';
  $("#geo").html(text_pos);
  // Gestisce i tre stati rispetto all'accuratezza
  if (acc>35) { $("#acc-status").css("background-color","#b60e0e"); stato=0;}
  if (acc<=35 && acc>20) { $("#acc-status").css("background-color","#c7b51f");stato=0;}
  if (acc<=20) { $("#acc-status").css("background-color","#2ac417"); stato=1;}

  if (stato == 0){
    $("#geo-information").html('<div class="alert alert-warning text-center" role="alert">⚠️ L\' accuratezza della tua posizione non è ottimale... <b>Attendi che la spia diventi verde prima di proseguire.</b> 👴</div>');
    $("#acc-status").addClass("animated delay-2s flash fast infinite");
  } else {
    var text;
    if (acc <=20 && acc > 10) { text = "👍 La geolocalizzazione è avvenuta con successo! <b>L' accuratezza è abbastanza buona.</b>";} else if (acc<=10 && acc > 5) {text = "🙌 La geolocalizzazione è avvenuta con successo! Dovresti essere a circa "+ Math.round(acc) +"m da qui 🤗";} else {text = "🎯 Perfetto! La geolocalizzazione è avvenuta con successo! 🎉";}
    $("#geo-information").html('<div class="alert alert-success text-center" role="alert">'+ text +'<br><small>Clicca sulla mappa per selezionare la posizione giusta.</small></div>');
    stopLocation();
    $("#acc-status").removeClass("animated delay-2s flash fast infinite");
  }
  }
