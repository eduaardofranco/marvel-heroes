export class MarvelApi {
    static search() {
        
        const endPoint = 'http://gateway.marvel.com/v1/public/characters?limit=100&ts=1691389216&apikey=deee09649e76da698be9309401af1ab5&hash=31df0cb4cb6edcdb610ce8e2721dd832'
        // const endPoint = 'https://www.superheroapi.com/api.php/6536724586393711'
        
        return fetch(endPoint)
        .then(response => response.json())
        .then(data => data.data.results)
        .catch((err) => {
            console.log('rejected ', err)
        })
    }
}
export class Heores {
    constructor(root) {

        this.root = document.getElementById(root)
        this.container = document.querySelector('.character-container')
    }
}

export class HeroesView extends Heores {
    constructor(root) {
        super(root)
       
        //set how many he
        this.itemsPerPage = 8
        this.currentPage = 1
        this.heroes = []

        //load the firsts heroes
        this.loadMore()

        this.loadMoreButton = document.querySelector('.load-more a')
        this.searchInputText = document.getElementById('search')
        this.searchNotFound = document.querySelector('.search-result')
        this.searchNotFoundValue = document.querySelector('.search-result span')
        this.searchButton = document.getElementById('search-input')

        
        // Use an arrow function to preserve the context
        this.loadMoreButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.loadMore(); // Now "this" refers to the instance of HeroesView
        })

        //search input function
        this.searchButton.addEventListener('click', (e) => {
            
            const inputValue = this.searchInputText.value
            //if input text is != empty shoe the search
            if(inputValue != '') {
                e.preventDefault()
                this.search(inputValue)
            }

        })
        
    }
    async loadApi() {
        //get the response from marvel fetch class and assign to heroes variable
        return  this.heroes = await MarvelApi.search();
    }
    
    async search(heroeSearch) {
        //assign the full away api to heroes variable loading the function loadApi()
        const heroes = await this.loadApi()

        //clear the heroes on the screen every key typed on search
        this.container.innerHTML = ''

        // console.log(heroes)

        const  newHeroes = heroes.filter((heroe) => heroe.name.toLowerCase().includes(heroeSearch.toLowerCase()))
        if(newHeroes == 0 ){
            this.searchNotFound.style.display = 'block'
            this.searchNotFoundValue.innerText = heroeSearch
        }
        else {
            this.searchNotFound.style.display = 'none'
            this.update(newHeroes)
        }
        this.loadMoreButton.style.display = 'none'

    }

    async loadMore() {
        
        //assign the full away api to heroes variable loading the function loadApi()
        const heroes = await this.loadApi()

        //set the start and end of slice function
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        
        const heroesToDisplay = heroes.slice(startIndex, endIndex);
        //call uptdate with next 4 items i want to display
        this.update(heroesToDisplay);
        
        this.currentPage++; // Increment the page number
        
        // Hide the "Load More" button if no more items to display
        if (endIndex >= heroes.length) {
            this.loadMoreButton.style.display = 'none';
        }

    }
    

    update(heroesToDisplay) {

        heroesToDisplay.forEach((heroeItem) => {
            const heroe = this.createHeroe()
            heroe.querySelector('.character img').src = heroeItem.thumbnail.path+'/portrait_uncanny.'+heroeItem.thumbnail.extension
            heroe.querySelector('.character img').alt = heroeItem.name +' photo'
            heroe.querySelector('.character p').textContent = heroeItem.author
            heroe.querySelector('.character h3').textContent = heroeItem.name

            this.container.append(heroe)
        })
    }




    createHeroe() {
        //create a div
        const character = document.createElement('div')
        //add a class to it
        character.classList.add('character')

        character.innerHTML = 
        `
            <a href="">
                <figure>
                    <img src="" alt="">
                </figure>
                <div class="name">
                    <p></p>
                    <h3></h3>
                </div>
            </a>
        `
        return character
    }

}