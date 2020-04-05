var stato;
var lat;
var lon;
var direzione;

$( document ).ready(
  
  //Recupera le coordinate dal device
  function getLocation()
  {
    if (navigator.geolocation)
    {
      navigator.geolocation.watchPosition(showPosition,showError,{enableHighAccuracy:true,timeout:240000});
    }
    else{alert("Questo device non Supporta la Geolocalizzazione");}
  }
);
  
function showError()
{
  alert("Errore nella localizzazione");
}
  
  //Visualizza la posizione
function showPosition(position)
  {
  lat=position.coords.latitude;
  lon=position.coords.longitude;
  direzione=0;
   
  //visualizza i dati nel div con id geo
  $("#geo").html("Lat: " + lat + " Lon: " + lon +" Accuratezza: "+ position.coords.accuracy+ "m Direzione: ");
  
  // Gestisce i tre stati rispetto all'accuratezza
  if (position.coords.accuracy>35) { $("#geo").css("color","red"); stato=0;}
  if (position.coords.accuracy<=35 && position.coords.accuracy>20) { $("#geo").css("color","yellow");stato=1;}
  if (position.coords.accuracy<=20) { $("#geo").css("color","green"); stato=1;}
  }
