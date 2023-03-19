// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';

const selectElement = document.getElementById('select')
const button = document.getElementById('button')
const photoContainer = document.getElementById('photoContainer')
const favoritesContainer = document.getElementById('favorites')

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
    } else {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
};


const paintFavorites = () => {
    if(favorites.length === 0)return
    else{
    getLocalStorage()
    favoritesContainer.innerHTML = ''
    const fragment = document.createDocumentFragment()
    for (let index = 0; index <= favorites.length; index++) {
        const newFavoriteImage = document.createElement('img')
        console.log(favorites[index]);
        newFavoriteImage.src = favorites[index]
        newFavoriteImage.classList.add('favorites__img')
        fragment.append(newFavoriteImage)
    }
    favoritesContainer.append(fragment)
}
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
    if(!e.target.classList.contains('fav-button')) return
    else {
        imageFavoritesArray.push(imagesrc);
        updateLocalStorage()
        updateLocalStorage()
        getLocalStorage()
        paintFavorites()
    }
})

