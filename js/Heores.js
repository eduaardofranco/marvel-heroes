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
       
        this.itemsPerPage = 8
        this.currentPage = 1

        this.loadMoreButton = document.querySelector('.load-more a')
        this.searchInput = document.getElementById('search')
        
        // Use an arrow function to preserve the context
        this.loadMoreButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.loadMore(); // Now "this" refers to the instance of HeroesView
        })

        //search input function
        this.searchInput.addEventListener('keydown', (e) => {
            const heroeSearch = e.target.value
            this.search(heroeSearch)

        })
        
        this.loadMore()
    }
    async search(heroeSearch) {

        //clear the heroes on the screen every key typed on search
        this.container.innerHTML = ''

        const heroes = await MarvelApi.search();
        // console.log(heroes)

        const  newHeroes = heroes.filter((heroe) => heroe.name.toLowerCase().includes(heroeSearch.toLowerCase()))
        console.log(newHeroes)
        this.update(newHeroes)

    }

    async loadMore() {
        
        //get the response from marvel fetch class and assign to heroes variable
        const heroes = await MarvelApi.search();

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