$(function(){

    $("#addCustSubmit").click(function(){
        lisaaAsiakas();
    });
    
    $("#getBtn").click(function(){
        haeKaikki();
    });
    
    $("#deleteCustomer").click(function(){
        poista(id);
    });

    $("#editCustSubmit").click(function(){
        muokkaaAsiakas();
    });

    // avataan asiakkaanlisäysdialogi
    $('#addCustBtn').click(() => {
    const isOpen = $('#addCustomerDialog').dialog("isOpen");
    if (!isOpen) {
        $('#addCustomerDialog').dialog("open");
    }
    });

    // avataan asiakkaanmuokkausysdialogi
    $('#editCustBtn').click(() => {
        const isOpen = $('#editCustomerDialog').dialog("isOpen");
        if (!isOpen) {
            $('#editCustomerDialog').dialog("open");
        }
        });
});


// Tehtävä 7
// Poistetaan asiakas JQueryn Ajax-kutsua käyttäen
var poista = (id) => {
        $.ajax({
            url: "http://localhost:3002/Asiakas/" + id,
            type: 'DELETE',
            success: () => {
                haeKaikki();
            }
        }          
        ).fail((err) => {
            console.log("Error " + err);
        })
    }

// Haetaan asiakasta
var haeAsiakas = () => {
    $.get("http://localhost:3002/Types",(data, status, xhr) => {
        $.each(data, (index, json_obj) => {
            $("#asty_avain").append("<option value=" + json_obj.AVAIN + ">" + json_obj.SELITE + "</option>");
        });
    });
}

// Haetaan kaikki asiakkaat
var haeKaikki = () => {
    let sp = searcParameters();

    $('#data').empty();
    $.get(`http://localhost:3002/Asiakas?${sp}`,(data, status, xhr) => {
        $.each(data, (index, json_obj) => {
            $("#data").append("<tr>");
            $("#data").append("<td>" + json_obj.AVAIN + "</td>");
            $("#data").append("<td>" + json_obj.NIMI + "</td>");
            $("#data").append("<td>" + json_obj.OSOITE + "</td>");
            $("#data").append("<td>" + json_obj.POSTINRO + "</td>");
            $("#data").append("<td>" + json_obj.POSTITMP + "</td>");
            $("#data").append("<td>" + json_obj.LUONTIPVM + "</td>");
            $("#data").append("<td>" + json_obj.ASTY_AVAIN + "</td>");
            $("#data").append("<td><button onClick=poista(" + json_obj.AVAIN + ")>Delete</td>");
            $("#data").append("<td><button id=editCustBtn onClick=edit(" + json_obj.AVAIN + ")>Edit</td>");
            $("#data").append("</tr>");
            
        });
    });
}

// Funktio asiakkaan lisäämiselle
var lisaaAsiakas = (param) => {
    $.post("http://localhost:3002/Asiakas/", param)
        .then((data) => {
            showAddCustStat(data);
            $('#addCustomerDialog').dialog("close");
            $('#data').empty();
            haeKaikki();
        });
}

// Funktio asiakkaan muokkaamiselle
var muokkaaAsiakas = (param) => {
    $.put("http://localhost:3002/Asiakas/"+ id, param)
        .then((data) => {
            showAddCustStat(data);
            $('#editCustomerDialog').dialog("close");
            $('#data').empty();
            haeKaikki();
        });
}

// Näytetään haun tulokset
var naytaHakutulokset = () =>{
    var nimi=$("#nimi").val();
     var osoite=$("#osoite").val();
     var tyyppi = $("#asiakastyyppi").val();

      var tableHeaderRowCount = 1;
      var table = document.getElementById('tulokset');
      var rowCount = table.rows.length;
          for (var i = tableHeaderRowCount; i < rowCount; i++) {
              table.deleteRow(tableHeaderRowCount); 
          }
          
    $.get("http://localhost:3002/asiakas?nimi=" + nimi + "&osoite=" + osoite + "&asty_avain=" + tyyppi,	function(data, status, xhr){
            var json_array = data;
            //console.log("status=" + status);
                for(var i=0; i < json_array.length; i++){
                  console.log("nimi=" + json_array[i].nimi);
                  console.log("osoite=" + json_array[i].osoite);
                };

            $.each(data, function(index, json_obj)
            {
                //console.log(data);
                $("#tulokset").append("<tr><td>" + json_obj.nimi +"</td><td>"+json_obj.osoite + "</td><td><button onclick='poista(" + json_obj.avain+ ")'>Poista " + json_obj.avain + "</button></td></tr>");
            });
    }).done(function(){
    }).fail(function(err){
      alert("fail");
    }).always(function(){
    })
}

// luodaan asiakkaanlisäysdialogi
let dialog = $('#addCustomerDialog').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 400,
        width: 'auto',
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

// luodaan asiakkaanmuokkausdialogi
let editDialog = $('#editCustomerDialog').dialog({
    autoOpen: false,
    modal: true,
    resizable: false,
    minWidth: 400,
    width: 'auto',
    close: function() {
        form[0].reset();
        allFields.removeClass("ui-state-error");
    }
});

// luodaan formi asiakkaan lisäykselle
let form = dialog.find("form")
        .on("submit", (event) => {
            event.preventDefault();
                let param = dialog.find("form").serialize();
                lisaaAsiakas(param);
            }
);


// luodaan formi asiakkaan muokkaukselle
let editForm = editDialog.find("form")
.on("submit", (event) => {
    event.preventDefault();
        let param = editDialog.find("form").serialize();
        muokkaaAsiakas(param);
    }
);

// Asiakkaan lisäyksen tarkistus
showAddCustStat = (data) => {
    if (data.status == 'ok') {
        $('#addStatus').css("color", "green").text("Lisääminen onnistui")
        .show().fadeOut(6000);
    } else {
        $('#addStatus').css("color", "red").text("Virhe: Asiakkaan lisäys epäonnistui").show()
        .show().fadeOut(6000);
    }
}


// Palautetaan hakuparametri
searcParameters = () => {
    let str = '';
    if ($('#name').val().trim() != '') {
        let name = $('#name').val().trim();
        str += `nimi=${name}`;
    }
    if ($('#address').val().trim() != '') {
        let address = $('#address').val().trim();
        if (str !== '') {
            str += '&';
        }
        str += `osoite=${address}`;
    }
    if ($('#custType').val() !== null) {
        let custType = $('#custType').val();
        if (str !== '') {
            str += '&';
        }
        str+=`asty_avain=${custType}`;
    }
    return str;
}
