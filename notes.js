function sendNote(){
  $('#form').submit(function(event){
    event.preventDefault();
    // non permette di inviare i dati se l'accuratezza supera i 20m
    if (stato==0) $("#sending-information").html('<div class="alert alert-danger" role="alert">🛰️ Attendi che l\' accuratezza della posizione migliori, la spia da 🔴 rossa deve diventare 🟡 gialla o ancora meglio 🟢 verde!</div>');
		    else {

		      // Verifica Dei Campi
          if(typeof lat == "undefined") {$("#sending-information").html('<div class="alert alert-danger text-center" role="alert"><p class="h3">😵 Dove sei? 😵</p><p class="h5">Non hai inserito alcuna posizione!</p><small>Ci hai dato tutte le informazioni di cui avevamo bisogno, ma così non riusciremo mai a sapere dove inserirle. 🤔</small></div>');return false;}
		      if($("#strada").val()=="") {alert("Il Campo Nome della strada non può essere vuoto");return false;}
		      if($("#civico").val()=="") {alert("Il Campo Numero civico non può essere vuoto");return false;}
          if($("#comune").val()=="") {alert("Il Campo Comune non può essere vuoto");return false;}

		      //Creazione testo da inserire nella nota
		      var testo="node\n"
		        +"\naddr:street="+$("#strada").val()
			+"\naddr:housenumber="+$("#civico").val()
			+"\naddr:city="+$("#comune").val()
			+"\naddr:postcode="+$("#cap").val()
			+"\n\n------ NOTE ------\n"+$("#note").val()
      +"\n------------------\n\nQuesta nota è stata generata automaticamente dal tool di segnalazione di indirizzi.\n https://naposm.github.io/indirizzo/\n #AggiuntoIndirizzo";

		      // Invia i dati a osm
		      // https://api.openstreetmap.org/api/0.6/notes?lat=51.00&lon=0.1&text=ThisIsANote
		      $.ajax({
			type: "POST",
     	                url: "https://api.openstreetmap.org/api/0.6/notes?",
			data: "lat=" + lat  + "&lon=" + lon +"&text="+testo,
			dataType: "html",
			success: function(msg)
			{
			  $("#risultato").html(msg);
			},
			error: function()
			{
        $("#sending-information").html('<div class="alert alert-danger" role="alert">😴 Chiamata fallita... Per favore riprova.</div>');
        return false;
			 }
		      });
          $("#sending-information").html('<div class="alert alert-success text-center" role="alert"><p class="h3">Evviva! 🎉</p>I dati sono stati inviati! Grazie mille per aver contribuito ❤️</div><p class="font-weight-light text-muted mt-4">Ecco come apparirà il tuo messaggio:</p><div class="w-100"><img src="https://wiki.openstreetmap.org/w/images/d/d0/Open_note_marker.png" alt="" class="mx-auto d-block"></div><div class="note">'+ testo +'</div>');
		      $('#form')[0].reset();
		    }
    return false
  });

}
