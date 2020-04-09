var stato;
var lat;
var lon;
var direzione;
var marker;

  //Recupera le coordinate dal device
  function getLocation()
  {
    if (navigator.geolocation)
    {
      navigator.geolocation.watchPosition(showPosition,showError,{enableHighAccuracy:true,timeout:240000});
      $("#geo-information").html('<div class="alert alert-success text-center" role="alert">🙌 Geolocalizzazione avvenuta con successo! 🙌</div>');
    }
    else{$("#geo-information").html('<div class="alert alert-danger" role="alert">😔 Il tuo browser non supporta la geolocalizzazione.</div>');}
  }

function showError()
{
  $("#geo-information").html('<div class="alert alert-danger" role="alert">😨 Errore nella localizzazione.</div>');
}

  //Visualizza la posizione
function showPosition(position)
  {
  lat=position.coords.latitude;
  lon=position.coords.longitude;
  direzione=0;

  // aggiunge marker sulla mappa
  map.setView([lat, lon], 16);
  marker = new L.Marker([lat, lon]);
  map.addLayer(marker);
  //if (marker !== null) {
  //       map.removeLayer(marker);
  //}
  

  //visualizza i dati nel div con id geo
  $("#geo").html("Lat: " + lat + " Lon: " + lon +" Accuratezza: "+ position.coords.accuracy+ "m Direzione: ");

  // Gestisce i tre stati rispetto all'accuratezza
  if (position.coords.accuracy>35) { $("#acc-status").css("background-color","#b60e0e"); stato=0;}
  if (position.coords.accuracy<=35 && position.coords.accuracy>20) { $("#acc-status").css("background-color","#c7b51f");stato=0;}
  if (position.coords.accuracy<=20) { $("#acc-status").css("background-color","#2ac417"); stato=1;}
  }
