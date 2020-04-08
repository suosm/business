function sendNote(){
  $('#form').submit(function(event){
    event.preventDefault();
    // non permette di inviare i dati se l'accuratezza supera i 35m
    if (stato==0) $("#sending-information").html('<div class="alert alert-danger" role="alert">🛰️ Attendi che l\' accuratezza migliori, la spia da rossa deve diventare 🟡 gialla o ancora meglio 🟢 verde!</div>');
		    else {

		      // Verifica Dei Campi
		      if($("#strada").val()=="") {alert("Il Campo Nome non Può essere vuoto");return false;}
		      if($("#civico").val()=="") {alert("Il Campo numero civico non può essere vuoto");return false;}

		      //Creazione testo da inserire nella nota
		      var testo="AggiuntoIndirizzo"
		        +"\naddr:street="+$("#strada").val()
			+"\naddr:housenumber="+$("#civico").val()
			+"\naddr:city="+$("#comune").val()
			+"\naddr:postcode="+$("#cap").val()
			+"\ndescription="+$("#note").val();

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
			 }
		      });
          $("#sending-information").html('<div class="alert alert-success text-center" role="alert"><h1>Evviva! 🎉</h1>I dati sono stati inviati! Grazie mille per aver contribuito ❤️</div><p class="font-weight-light text-muted mt-4">Ecco come apparirà il tuo messaggio:</p><div class="w-100"><img src="https://wiki.openstreetmap.org/w/images/d/d0/Open_note_marker.png" alt="" class="mx-auto d-block"></div><div class="note">'+ testo +'</div>');
		      $('#form')[0].reset();
		    }
    return false
  });

}
