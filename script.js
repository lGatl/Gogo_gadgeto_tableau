
//Fonction qui génère un tableau dynamiquement en fonction,
// de la liste de joueurs js et de l'id de l'élément dans lequel 
// ce tableau doit etre injecté 

//fonction qui vide un élément du DOM
var viderelt = function(elt){
	while (elt?elt.firstChild:false) {
    	elt.removeChild(elt.firstChild);
	}
}

//==============================================================================
//														TABLEAU
//==============================================================================
var creationTableau = function(js, iddiv){

	//Preparation du header
	var createHeader = function(js){
			
			var Thead = document.createElement("thead");

			var hrow = document.createElement("tr")
			var unecaze = document.createElement("th")
				unecaze.setAttribute("colspan",1)
				unecaze.setAttribute("class","first")

				hrow.appendChild(unecaze)
			js.forEach(function(elt2){
				var caze = document.createElement("th")
				var jou = document.createTextNode(elt2[1]);
				caze.setAttribute("colspan",2)
				caze.appendChild(jou)

				hrow.appendChild(caze)
			})

			var endcaze = document.createElement("th")
			endcaze.setAttribute("colspan",1)
			var text = document.createTextNode('PTS');
			endcaze.appendChild(text)
			hrow.appendChild(endcaze)

			Thead.appendChild(hrow)

			return Thead
	}

	//Preparation du body
	var createBody = function(js){
		var Tbody = document.createElement("tbody");
		js.forEach(function(elt,i){
			var row = document.createElement("tr")
			var caze = document.createElement("td")
			var jou = document.createTextNode(elt[0]+" - "+elt[1]);
			caze.appendChild(jou);
			row.appendChild(caze);
			caze.setAttribute("class","first")

			js.forEach(function(elt2,j){
				var caze1 = document.createElement("td")
				caze1.setAttribute("class","caze")//donne une class pour le css
				var caze2 = document.createElement("td")
				caze2.setAttribute("class","caze")//donne une class pour le css
				if(elt!==elt2){
					var input1 = document.createElement("input")
					input1.setAttribute("name",elt[0]+","+elt2[0]+"s1")
					var input2 = document.createElement("input")
					input2.setAttribute("name",elt[0]+","+elt2[0]+"s2")
					caze1.appendChild(input1)
					caze2.appendChild(input2)
				}

				row.appendChild(caze1)
				row.appendChild(caze2)
			})

			var endcaze = document.createElement("td")
			endcaze.setAttribute("class","caze")//donne une class pour le css
			endcaze.setAttribute("name","total"+i)

			row.appendChild(endcaze);
			Tbody.appendChild(row)
		})

		return Tbody
	}
	//Prepare la creation du tableau
	var creeTable = function(js, idtable){
		var Table = document.createElement("table");
		Table.setAttribute("id",idtable)

		var Thead = createHeader(js)
			Table.appendChild(Thead)
		
		var Tbody = createBody(js) 
		Table.appendChild(Tbody)
		return Table
	}
	//Insert le tableau elt dans dans l'element id du DOM
	var putindoc = function(elt, id){
		var reponse = document.getElementById(id);
		viderelt(reponse)
		reponse.appendChild(elt)
	}

		//lance la creation du tableau
		var Table = creeTable(js,iddiv+"_table")
		//insert dans le DOM
		putindoc(Table, iddiv)

}
//==============================================================================
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^TABLEAU^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//==============================================================================


//==============================================================================
//											Interactions Avec le tableau
//==============================================================================

//Fonction qui sert à recuperer les données du tableau correspondant à l'id
var getData = function(iddiv){
	var elt = document.getElementById(iddiv)//on cible l'endroit ou on travail
	//On met dans un tableau tous les inputs de la div ciblée
 	var inputs = Array.prototype.slice.call(elt.getElementsByTagName("input"))

 	//On parcours les inputs de la div et on génère le tableau de data.
 	var data = inputs.reduce(function(total,inp,i){

		if(i>0&&inp.name.split("s")[0]===inputs[i-1].name.split("s")[0]&&(inputs[i-1].value!==""||inp.value!=="")){
			return[...total, inp.name.split("s")[0] +","+ inputs[i-1].value +","+inp.value]
		}else{
			return total
		}	
 	},[])

 	return data //retourne les données sous forme de tableau
 }

//Fonction qui sert à inserer les données data dans le tableau correspondant à l'id
var putData = function(data, iddiv){

 var elt = document.getElementById(iddiv)//on cible l'endroit ou on travail
 //On met dans un tableau tous les inputs de la div ciblée
 var inps = Array.prototype.slice.call( elt.getElementsByTagName('input'))
 //On vide tous les inputs
 	inps.forEach(function(inpu){
		inpu.value = ""
	})
 	//On parcouts les données et on les insert dans les inputs dont le name correspond
 	data.forEach(function(str){
 	let	tab = str.split(",")
 	if(tab[2].length>0){
 		
		var inp = inps.find(function(elt){return tab[0]+","+tab[1]+"s1" === elt.name})
			inp.value = tab[2]
	 	}
 		if(tab[3].length>0){
				var inp = inps.find(function(elt){return tab[0]+","+tab[1]+"s2" === elt.name})
			inp.value = tab[3]
	 	}
 	})
}

// fonction lancée au clique sur le bouton get
var get = function(){
	//get les données dans le tableau de la div id = reponse
	var score = getData('tableau')
	//recupere l'élément dans lequel on affiche les datas
	var restit = document.getElementById('restit')

	viderelt(restit)
	//on joint les elements du tableau avec un separateur / et on insert 
	restit.appendChild(document.createTextNode(score.join("/")))

}
//put les données dans le tableau de la div id = reponse
var put = function(){
	//On recupere les datas à inserer
	//Converti la string en tableau en fonction des separateurs /
	var data =	document.getElementById('put').value.split("/")
	putData(data,'tableau')
}


//Generer ou re génerer le tableau, on precise l'id de l div dans laquelle on veut l'inserer
var refrech = function(){
	//on Recupere la liste des joueurs
	//Converti la string en tableau en fonction des separateurs /
	var js = document.getElementById("joueurs").value.split("/").map(function(name, id){ return [name,((id+1)+"").length>1?((id+1)+""):("0"+(id+1))]});
	//On lance la creation du tableau
 	creationTableau(js,'tableau');
}

var getTotal = function(){

	//Converti la string en tableau en fonction des separateurs /
	var js = document.getElementById("joueurs").value.split("/").map(function(name,id){ return [name,id+1]});

	var elt = document.getElementById('tableau')//on cible l'endroit ou on travail
 	//On met dans un tableau tous les inputs de la div ciblée
 	var inps = Array.prototype.slice.call( elt.getElementsByTagName('input'))
 	//On fait les comptes
 	var total = js.map(function(jou){ 
		return inps.reduce(function(total,inp){
			return jou[0] === inp.name.split(",")[0]?total+(inp.value*1):total
		},0)
 	})

 	var tds = Array.prototype.slice.call( elt.getElementsByTagName('td'))

 	total.forEach(function(tot,i){

 		var latd = tds.find(function(ted){
 			return (ted.getAttribute('name') === ("total"+i))
 		})
		
		viderelt(latd)
		latd.appendChild(document.createTextNode(tot))
 	})

}

//on Genère une premiere fois le tableau
refrech();
