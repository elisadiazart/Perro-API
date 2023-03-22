// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';

const selectElement = document.getElementById('select')
const button = document.getElementById('button')
const photoContainer = document.getElementById('photoContainer')
const favoritesContainer = document.getElementById('favorites')
const form = document.getElementById('form')

let selectedOption = ''
let imagesrc = ''
const LS = localStorage
let imageFavoritesArray = [];
let favorites



const fetchData = async url => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

const createOptions = async () => {
    const data = await fetchData('https://dog.ceo/api/breeds/list/all')
    const breeds = data.message;
    const breedsList = Object.keys(breeds);
    const fragment = document.createDocumentFragment()
    breedsList.forEach(breed => {
        const newOption = document.createElement('option')
        newOption.textContent = breed
        newOption.value = breed
        fragment.append(newOption)
    })
    selectElement.append(fragment)
}

createOptions()

const generatePhoto= async () =>  {
    const data = await fetchData(`https://dog.ceo/api/breed/${selectedOption}/images/random`)
    photoContainer.innerHTML = ''
    const newPhoto = document.createElement('img')
    newPhoto.src = data.message
    newPhoto.classList.add('generated-photo')
    imagesrc = data.message
    const favButton = document.createElement('div')
    favButton.classList.add('fav-button')
    favButton.textContent = 'Guardar'
    photoContainer.append(newPhoto, favButton)
}


const updateLocalStorage = () => {
    LS.setItem('favorites', JSON.stringify(imageFavoritesArray));
  };
  
const getLocalStorage = () => {
    const localFavourites = LS.getItem('favorites');
    if (localFavourites) {
      favorites = JSON.parse(localFavourites);
      imageFavoritesArray = favorites
    } else {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
};


const paintFavorites = () => {
    getLocalStorage()
    favoritesContainer.innerHTML = ''
    const fragment = document.createDocumentFragment()
    for (let index = 0; index < favorites.length; index++) {
        const favoriteImageContainer = document.createElement('div')
        favoriteImageContainer.classList.add('favorite-image-container')
        const newFavoriteImage = document.createElement('img')
        newFavoriteImage.src = favorites[index]
        newFavoriteImage.classList.add('favorites__img')
        const favButton = document.createElement('div')
        favButton.classList.add('fav-button--favorites')
        favButton.textContent = 'quitar'
        favoriteImageContainer.append(newFavoriteImage, favButton)
        fragment.append(favoriteImageContainer)
    }
    favoritesContainer.append(fragment)
}


getLocalStorage()
paintFavorites()

selectElement.addEventListener('change', e => {
    if(e.target.selectedIndex === 0) return
    else{
        selectedOption = [...e.target.selectedOptions][0].value;}
})

button.addEventListener('click', e => {
    if (selectElement.value === 'breeds') return;
    else {
        generatePhoto()
        paintFavorites()
    }
})


document.body.addEventListener('click', e => {
    if(e.target.classList.contains('fav-button')) {
        imageFavoritesArray.push(imagesrc);
        updateLocalStorage()
        getLocalStorage()
        paintFavorites()
    }
    if(e.target.classList.contains('fav-button--favorites')){
        console.log(e.target.previousElementSibling.src);
        const index = imageFavoritesArray.indexOf(e.target.previousElementSibling.src)
        console.log(index);
        imageFavoritesArray.splice(index,1)
        console.log(imageFavoritesArray.length);
        console.log(imageFavoritesArray);
        updateLocalStorage()
        getLocalStorage()
        paintFavorites()
    }
})


form.addEventListener('submit', e => {
    e.preventDefault();
  });