var stato;
var lat;
var lon;
var acc;
var truelat;
var truelon;
var distGPStoSelection = 0;
var marker;

  //Recupera le coordinate dal device
  function getLocation()
  {
    if (navigator.geolocation)
    {
      navigator.geolocation.watchPosition(getDataFromGPS,showError,{enableHighAccuracy:true,timeout:240000});
      $("#geo-information").html('<div class="alert alert-success text-center" role="alert">🙌 Geolocalizzazione avvenuta con successo! 🙌</div>');
    }
    else{$("#geo-information").html('<div class="alert alert-danger" role="alert">😔 Il tuo browser non supporta la geolocalizzazione.</div>');}
  }

function showError(error)
{
  var text;
  switch (error.code){
  case 1 : text = '🥺 Non hai consentito l\' accesso alla posizione. Se hai dubbi sulla privacy, consulta le <a href="#come-funziona">informazioni</a> in fondo. ⬇️'; break;
  case 2 : text = "📡 Qualcosa non ha funzionato... Riprova più tardi."; break;
  case 3 : text = "💤 L' accesso alla posizione sta impiegando più tempo del previsto."; break;
  default : text = "😨 Errore nella localizzazione.";
}
  $("#geo-information").html('<div class="alert alert-danger" role="alert">'+ text +'</div>');
}

// Ferma la posizione
function stopLocation(){
  navigator.geolocation.clearWatch();
  $("#geo-information").html('<div class="alert alert-dark text-center" role="alert">📌 Modalità selezione manuale, la geolocalizzazione è in pausa. 🛑 </div>');
}


// Ottiene i dati dal GPS
function getDataFromGPS(position){
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
marker = new L.Marker([lat, lon])
if (typeof acc != 'undefined')
  .bindPopup('Sei a circa '+ acc + 'm da qui');
map.addLayer(marker);
}

// Aggiunge marker al click e ferma la localizzazione
function addMarkerClick(e){
  maxDist = 1 / 110.574;
  distGPStoSelection = Math.sqrt(Math.pow(e.latlng.lat - truelat, 2) + Math.pow(e.latlng.lng - truelon, 2));
// Controlla se la distanza non è eccessiva
  if(distGPStoSelection <= maxDist){
    updateData(e.latlng.lat, e.latlng.lng);
    stopLocation();
}
 }


  //Visualizza la posizione
function showPosition()
  {
  // aggiunge marker sulla mappa
  addMarker();
  map.on('click', addMarkerClick);


  //visualizza i dati nel div con id geo
  $("#geo").html("Lat: " + lat + " Lon: " + lon +" Accuratezza: "+ acc);

  // Gestisce i tre stati rispetto all'accuratezza
  if (acc>35) { $("#acc-status").css("background-color","#b60e0e"); stato=0;}
  if (acc<=35 && acc>20) { $("#acc-status").css("background-color","#c7b51f");stato=0;}
  if (acc<=20) { $("#acc-status").css("background-color","#2ac417"); stato=1;}
  }
