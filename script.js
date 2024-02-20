const typeColor = {
  bug: "#A6B91A",
  dark: "#705746",
  dragon: "#6F35FC",
  electric: "#F7D02C",
  fairy: "#D685AD",
  fighting: "#C22E28",
  fire: "#EE8130",
  flying: "#A98FF3",
  grass: "#7AC74C",
  ground: "#E2BF65",
  ghost: "#735797",
  ice: "#96D9D6",
  normal: "#A8A77A",
  poison: "#A33EA1",
  psychic: "#F95587",
  rock: "#B6A136",
  steel: "#B7B7CE",
  water: "#6390F0",
};

const url = "https://pokeapi.co/api/v2/pokemon/";
const card = document.getElementById("card");
const typesContainer = document.getElementById("types");
const typeButtons = document.getElementsByClassName("typeButton");
const livesSpan = document.getElementById("lives");
const guessedCountSpan = document.getElementById("guessedCount");
const record = document.getElementById("record"); 
const minusOne = document.getElementById("minusOne");
const plusOne = document.getElementById("plusOne");

let alreadyGeneratedTypes = false;
let typesGuessed = 0;
let lives = 3;
let pokemonGuessed = 0;
let recordCount;

let getSelectedType = (e) => {
	const type1 = document.getElementById("type0");
	const type2 = document.getElementById("type1");
	if(type1.innerHTML === e.target.innerHTML){
		type1.style.display = "block";
		typesGuessed++;
		checkWin(typesGuessed, type2);
	} else if(type2 !== null && type2.innerHTML == e.target.innerHTML){
		type2.style.display = "block";
		typesGuessed++;
		checkWin(typesGuessed, type2);
	} else {
		lives--;
		setTimeout(function(){
			minusOne.style.display = 'none';
		}, 1000);
		minusOne.style.display = 'inline';
		livesSpan.innerHTML = lives;
		checkLoss(type1, type2, pokemonGuessed);
	}
};

let checkLoss = (type1, type2, pokemonGuessed) => {
	if(lives < 0){
		if(type2 !== null){
			checkRecord(pokemonGuessed);
			if(!alert(`It was ${type1.innerHTML} / ${type2.innerHTML}. You lost😊`)){window.location.reload();}
		}else{
			checkRecord(pokemonGuessed);
			if(!alert(`It was ${type1.innerHTML}. You lost😊`)){window.location.reload();}
		}
	}
}


let checkGameWon = () => {
	if(pokemonGuessed > 1017) {
		if(!alert('Wtf you won!!?? Get a life lol🤡')){window.location.reload();}
	}
}


let checkWin = (count, type2) => {
	if(type2 !== null && count === 2){
		typesGuessed = 0;
		plusOne.style.display = 'inline';
		setTimeout(function(){
			plusOne.style.display = 'none';
		}, 1000);
		pokemonGuessed++;
		guessedCountSpan.innerHTML = pokemonGuessed;
		checkGameWon();
		card.style.borderColor = 'green';
		setTimeout(function(){
			card.style.borderColor = 'black';
    	getPokeData();
		}, 1000);
	} else if(type2 === null && count === 1) {
		typesGuessed = 0;
		plusOne.style.display = 'inline';
		setTimeout(function(){
			plusOne.style.display = 'none';
		}, 1000);
		pokemonGuessed++;
		guessedCountSpan.innerHTML = pokemonGuessed;
		checkGameWon();
		card.style.borderColor = 'green';
		setTimeout(function(){
			card.style.borderColor = 'black';
    	getPokeData();
		}, 1000);
	}
}

let checkRecord = (count) => {
	if(count > recordCount){
		localStorage.setItem('myRecord', count);
		recordCount = count;
		record.innerHTML = recordCount;
	}
}

let getPokeData = () => {
	recordCount = localStorage.getItem('myRecord');
	record.innerHTML = recordCount;
	let id = Math.floor(Math.random() * 1017) + 1;
	
	const finalUrl = url + id;

	fetch(finalUrl).then((response) => response.json())
	.then((data) => {
		if(alreadyGeneratedTypes === false){
			generateTypes();
			alreadyGeneratedTypes = true;
		}
		generateCard(data);
	});
};


let generateTypes = () => {
	for (const key in typeColor){
		var button = document.createElement('button');
		button.className = "typeButton";
    button.innerText = key;
    button.style.backgroundColor = typeColor[key];
    button.addEventListener("click", getSelectedType);
    typesContainer.appendChild(button);
	}
};


let generateCard = (data) => {
	let pokeName = data.name;
	pokeName = pokeName[0].toUpperCase() + pokeName.slice(1).toLowerCase();

	const imgSrc = data.sprites.front_default;
	let typeNames = [];
	const type1 = typeColor[data.types[0].type.name];
	typeNames.push(type1);
	let type2 = "";

	if(data.types.length > 1){
		type2 = typeColor[data.types[1].type.name];
		typeNames.push(type2);
	}

	card.innerHTML = `
		<h2 class="poke-name">${pokeName}</h2>
		<img src="${imgSrc}" />
		<div class="types">
         
        </div>
	`;
	appendTypes(data.types, typeNames);
}

let appendTypes = (types, typeNames) => {
  let count = 0;
  types.forEach((item) => {
    let span = document.createElement("SPAN");
    span.textContent = item.type.name;
    span.style.backgroundColor = typeNames[count];
    span.style.display = 'none';
    let typeN = "type" + count;
    span.setAttribute("id", typeN);
    document.querySelector(".types").appendChild(span);
  	count++;
  });
};


window.addEventListener("load", getPokeData);