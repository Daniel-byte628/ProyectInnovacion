// Constante que guarda la url actual del servidor
let url = `http://${window.location.host}`;
let sesionToken; // Declaración global


sesionToken = localStorage.getItem('token');  // Asignación dentro de la función

/! Función para cambiar entre los diferentes Grids (secciones de contenido)!/
function changeSection(activeSectionId) {
	var sections = document.querySelectorAll(".section-content");

	sections.forEach(function (section) {
		if (section.id === activeSectionId) {
			section.classList.add("active");
		} else {
			section.classList.remove("active");
		}
	});
}
// Agregamos eventos a los botones para cambiar de sección
document.getElementById("post-btn").addEventListener("click", function () {
	changeSection("post");
});
document.getElementById("playlist-btn").addEventListener("click", function () {
	changeSection("playlist");
});


// Muestra la sección de publicaciones al cargar la página



/* --------------------------------------PopUp--------------------------------------------- */
const formContent = document.querySelectorAll(".form-content"),
	fileInput = document.querySelector(".file-input"),
	middleAreas = document.querySelectorAll('.middle-area');

let selectedSong = null;
let selectedImage = null;


fileInput.onchange = ({ target }) => {
	let file = target.files[0];
	selectedImage = target.files[0];

	if (file) {
		let fileName = file.name;
		if (fileName.length >= 12) {
			let splitName = fileName.split('.');
			fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
		}
		//uploadFile(file);

		// Vista previa de la imagen seleccionada
		let reader = new FileReader();
		reader.onload = function (e) {
			// Modifica el CSS de tu pop-up para incluir la imagen seleccionada como fondo

			middleAreas.forEach((middleArea) => {
				middleArea.style.backgroundImage = 'url(' + e.target.result + ')';
			});
		}
		// Lee el archivo de imagen
		reader.readAsDataURL(file);

		// Desactiva el input del archivo
		fileInput.disabled = true;

		// Oculta el contenido del formulario
		formContent.forEach(formContent => formContent.classList.add('active'));
	}
}



function cerrarPopup() {
	// Reinicia el input del archivo al cerrar el popup
	fileInput.value = "";
	fileInput.disabled = false;

	if (audioPlayer) {
		// Detenemos la canción que se está reproduciendo
		audioPlayer.pause();
		audioPlayer = null;
	}
	// Limpia la imagen de fondo
	middleAreas.forEach((middleArea) => { middleArea.style.backgroundImage = ""; });
	// Cierra todos los elementos de tipo popup
	let popups = document.querySelectorAll('.popup');
	let wrappers = document.querySelectorAll('.wrapper');
	let btnCloses = document.querySelectorAll('.btn-cerrar-popup');

	popups.forEach(popup => popup.classList.remove('active'));
	wrappers.forEach(wrapper => wrapper.classList.remove('active'));
	btnCloses.forEach(btnclose => btnclose.classList.remove('active'));

	// Muestra el contenido del formulario
	formContent.forEach(formContent => formContent.classList.remove('active'));
}


function togglePopup() {
	let popup = document.getElementById('popup');
	let wrapper = popup.querySelector('.wrapper');
	popup.classList.add('active');
	wrapper.classList.add('active');
	let btnclose = document.querySelector('.btn-cerrar-popup');
	btnclose.classList.add('active');
}

function togglePopup2() {
	let popup = document.getElementById('popup2');
	let wrapper = popup.querySelector('.wrapper');
	popup.classList.add('active');
	wrapper.classList.add('active');
	let btnclose = document.querySelector('.btn-cerrar-popup');
	btnclose.classList.add('active');
}


/* --------------------------------------selectMenu--------------------------------------------- */

const selectMenu = document.querySelector(".select-menu");
const selectBtn = selectMenu.querySelector(".select-btn");
const searchInp = selectMenu.querySelector("input");
const options = selectMenu.querySelector(".options");

let songs = [""]; // lista de canciones
let songIDs = [""]; // lista paralela de ids de canciones
let audioPlayer = null; // creamos una variable global para el reproductor


function updateName(selectedLi) {
	searchInp.value = "";
	selectMenu.classList.remove("active");
	selectBtn.firstElementChild.innerText = selectedLi.innerText;

}


changeSection("post");
/!Función para revisar si la sección está vacía, y en caso de que lo esté muestra una advertencia!/
function checkEmptyGrid() {
	var sections = document.querySelectorAll(".section-content");

	sections.forEach(function (section) {
		var grid = section.querySelector(".grid");

		if (grid && grid.children.length === 0) {
			grid.innerHTML = `
				<img src="../assets/imgs/blanco.jpg" alt="post" />
				<img src="../assets/imgs/noPublicacion.jpg" alt="post" />
				<img src="../assets/imgs/blanco.jpg" alt="post" />
			`;
		}
	});
}
/* --------------------------------------foto perfil--------------------------------------------- */
let postBtn2 = document.querySelector('#btn-post2');
postBtn2.addEventListener('click', () => postProfilePhoto(usernameElement.textContent.slice(1)));
async function postProfilePhoto(username) {
	let formData = new FormData();
	formData.append('image', selectedImage);
	try {
		let response = await fetch(`${url}/accounts/image/${username}`, {
			method: 'PUT',
			headers: {
				'x-token': sesionToken
			},
			body: formData
		});

		if (!response.ok) {
			throw new Error('Error al publicar en el feed');
		}
		// Cierra el popup después de subir la publicación
		cerrarPopup();

	} catch (error) {
		console.error(error);
	}
}



checkEmptyGrid();

/*------------------------------------------------- Calificacion estrellas -----------------------------------------------------------*/

const stars = document.querySelectorAll(".stars i");


stars.forEach((star, index1) => {
	// Add an event listener that runs a function when the "click" event is triggered
	star.addEventListener("click", () => {
		// Loop through the "stars" NodeList Again
		stars.forEach((star, index2) => {

			index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
		});
	});
});
/*----------------------------------------------contadores------------------------------------------------------*/
function contarImagenesYActualizarLabel() {
	const grid = document.querySelector('.grid');
	const numeroFotos = document.getElementById('numero-fotos');
	const imagenes = grid.getElementsByTagName('img');
	const cantidadImagenes = imagenes.length;

	numeroFotos.textContent = `(${cantidadImagenes})`;
	numeroFotos.style.color = '#e75a5a';
}

// Llama a la función para contar las imágenes y actualizar el label.
contarImagenesYActualizarLabel();


function contarReseñasYActualizarLabel() {
	const gridResena = document.querySelector('.grid-resena');
	const numeroReseñas = document.getElementById('numero-reseñas');
	const reseñas = gridResena.getElementsByClassName('review');
	const cantidadReseñas = reseñas.length;

	numeroReseñas.textContent = `(${cantidadReseñas})`;
	numeroReseñas.style.color = '#e75a5a';
}

// Llama a la función para contar las reseñas y actualizar el label.
contarReseñasYActualizarLabel();



