var share_text = 'Ho appena inserito il mio indirizzo su OpenStreetMap, il database geografico utilizzato da tantissime applicazioni! 🗺 Puoi farlo anche tu, se vuoi. Sostieni un progetto libero e di tutta la comunità ❤️';
var share_url = "https://naposm.github.io/indirizzo/";

function sendNote() {
  $('#form').submit(function(event) {
    event.preventDefault();

    // non permette di inviare i dati se l'accuratezza supera i 20m
    if (stato == 0) $("#sending-information").html('<div class="alert alert-warning" role="alert">🛰️ Attendi che l\' accuratezza della posizione migliori, la spia da rossa o gialla deve diventare 🟢 verde!</div>');
    else {

      // Verifica Dei Campi
      if (typeof lat == "undefined") {
        $("#sending-information").html('<div class="alert alert-danger text-center" role="alert"><p class="h3">😵 Dove sei? 😵</p><p class="h5">Non hai inserito alcuna posizione!</p><small>Ci hai dato tutte le informazioni di cui avevamo bisogno, ma così non riusciremo mai a sapere dove inserirle. 🤔</small></div>');
        return false;
      }
      if ($("#strada").val() == "") {
        alert("Il Campo Nome della strada non può essere vuoto");
        return false;
      }
      if ($("#civico").val() == "") {
        alert("Il Campo Numero civico non può essere vuoto");
        return false;
      }
      if ($("#comune").val() == "") {
        alert("Il Campo Comune non può essere vuoto");
        return false;
      }

      //Creazione testo da inserire nella nota
      // Inserisce node : lat, lon per Level0
      var testo = "node : " + lat.toString().slice(0, 8) + ", " + lon.toString().slice(0, 8) +
       "\n\naddr:street=" + $("#strada").val() +
       "\naddr:housenumber=" + $("#civico").val() +
       "\naddr:city=" + $("#comune").val();

        // Aggiunge il CAP se presente
        if($("#cap").val() != "")
          testo += "\naddr:postcode=" + $("#cap").val();



      // Aggiunge le note se presenti
      if ($("#note").val() != "") {
        testo += "\n\n------ NOTE ------\n" + $("#note").val() +
                  "\n------------------";
      }

      // Inserisce un avviso se manca il CAP
      if (nopostcode && $("#cap").val() != ""){
        testo += "\n\n[⚠️ ATTENZIONE: A questa città mancano i dati sull' indirizzo postale!]\nPer inserirlo andare nella relazione della città e inserire: \" postal_code:" + $("#cap").val() + " \" " ;
      }

      testo +=  "\n\nQuesta nota è stata generata automaticamente dal tool di segnalazione di indirizzi.\n https://naposm.github.io/indirizzo/\n #AggiuntoIndirizzo";

      if (distGPStoSelection != 0) {
        testo = "[SELEZIONATO SU MAPPA (dist. " + distGPStoSelection + ")]\n\n" + testo;
      }
      // Invia i dati a osm
      // https://api.openstreetmap.org/api/0.6/notes?lat=51.00&lon=0.1&text=ThisIsANote
      $.ajax({
        type: "POST",
        url: "https://api.openstreetmap.org/api/0.6/notes?",
        data: "lat=" + lat + "&lon=" + lon + "&text=" + testo,
        dataType: "html",
        success: function(msg) {
          $("#risultato").html(msg);
        },
        error: function() {
          $("#sending-information").html('<div class="alert alert-danger" role="alert">😴 Chiamata fallita... Per favore riprova.</div>');
          return false;
        }
      });

      var sharing = "";
      if (navigator.share) {
        sharing = '<a class="btn btn-warning" onclick="navigator.share({title: document.title, text: \'share_text\',url: \'share_url\'})">CONDIVIDI</div>';
      } else {
        sharing = '</div><div class="alert alert-light mt-2 text-center"role=alert><p class="h5 text-primary">Fallo sapere anche ai tuoi amici!</p><a aria-label="Share on WhatsApp"class=resp-sharing-button__link href="https://api.whatsapp.com/send?text=' + share_text + '%20%20https%3A%2F%2Fnaposm.github.io%2Findirizzo%2F"rel=noopener target=_blank><div class="resp-sharing-button resp-sharing-button--large resp-sharing-button--whatsapp"><div class="resp-sharing-button__icon resp-sharing-button__icon--solid"aria-hidden=true><svg viewBox="0 0 24 24"xmlns=http://www.w3.org/2000/svg><path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"/></svg></div>Condividi su WhatsApp</div></a><a aria-label="Share on Telegram"class=resp-sharing-button__link href="https://telegram.me/share/url?text=' + share_text + '&url=https%3A%2F%2Fnaposm.github.io%2Findirizzo%2F"rel=noopener target=_blank><div class="resp-sharing-button resp-sharing-button--large resp-sharing-button--telegram"><div class="resp-sharing-button__icon resp-sharing-button__icon--solid"aria-hidden=true><svg viewBox="0 0 24 24"xmlns=http://www.w3.org/2000/svg><path d="M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z"/></svg></div>Condividi su Telegram</div></a></div>';
      }

      $("#sending-information").html('<div class="alert alert-success text-center" role="alert"><p class="h3">Evviva! 🎉</p>I dati sono stati inviati! Grazie mille per aver contribuito ❤️</div><p class="font-weight-light text-muted mt-4">Ecco come apparirà il tuo messaggio:</p><div class="w-100"><img src="https://wiki.openstreetmap.org/w/images/d/d0/Open_note_marker.png" alt="" class="mx-auto d-block"></div><div class="note">' + testo.replace(new RegExp('\r?\n', 'g'), '<br />') + sharing);
      $('#form')[0].reset();
    }
    return false;
  });

}
