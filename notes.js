$( document ).ready(function(){
  $('#form').submit(function(event){
    event.preventDefault();
    // non permette di inviare i dati se l'accuratezza supera i 35m
    if (stato==0) alert("Attendere che l'accuratezza diventi minore di 35m (Testo da Rosso diventi Giallo o preferibilmente Verde)");
		    else {
		      
		      // Verifica Dei Campi
		      if($("#strada").val()=="") {alert("Il Campo Nome non Può essere vuoto");return false;}
		      if($("#civico").val()=="") {alert("Il Campo numero civico non può essere vuoto");return false;}
		      
		      //Creazione testo da inserire nella nota
		      var testo="AggiuntoCivico"
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
			  alert("Chiamata fallita, si prega di riprovare...");
			}
		      });
		      
		      alert("Dati Inviati \n" + testo);
		      $('#form')[0].reset();
		    }
    return false
  });
  
});  
