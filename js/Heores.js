export class MarvelApi {
    static search(itemsPerPage) {
        
        const endPoint = `http://gateway.marvel.com/v1/public/characters?limit=${itemsPerPage}&ts=1691389216&apikey=deee09649e76da698be9309401af1ab5&hash=31df0cb4cb6edcdb610ce8e2721dd832`
        
        return fetch(endPoint)
        .then(response => response.json())
        .then(res => res.data.results)
        .then(results => {
            // Assuming results is an array containing objects
            return results.map(({ id, name, description, thumbnail, series }) => ({
              id,
              name,
              description,
              thumbnail,
              series
            }));
          })
        .catch((err) => {
            console.log('rejected ', err)
        })
    }
}
export class Heores {
    constructor(root) {

        this.root = document.getElementById(root)
        this.container = document.querySelector('.character-container')
        this.containerModal = document.querySelector('.character-modal')
    }
}

export class HeroesView extends Heores {
    constructor(root) {
        super(root)
       
        //set how many heroes per load()
        this.itemsPerPage = 8
        this.currentPage = 1
        this.itemsToLoad = this.itemsPerPage
        this.itemsToLoadLimit = 21
        
        this.heroes = []

        //load the firsts heroes
        this.loadMore()

        this.character = document.querySelector('.character a')
        this.loadMoreButton = document.querySelector('.load-more button')
        this.searchInputText = document.getElementById('search')
        this.searchNotFound = document.querySelector('.search-result')
        this.searchNotFoundValue = document.querySelector('.search-result span')
        this.searchButton = document.getElementById('search-input')
        this.closeModal = document.querySelector('.heroe-stats-container .close-modal')
        this.characterModal = document.querySelector('.character-modal')

        //open heroe modal
        //event delegation
        //attach the addeventlistener to the parent and when the character html is created add to him
        this.container.addEventListener('click', (event)=> {
            event.preventDefault()

            //if heroe div click open heroe modal details
            //prevent from clicking outside heroe div and throwing error
            if(event.target !== this.container) {
                const heroeCard = event.target.closest('.character a').dataset.id
                this.updateHeroeDetails(heroeCard)
            }
            
        })
        
        // Use an arrow function to preserve the context
        this.loadMoreButton.addEventListener('click', async (event) => {
            event.preventDefault()

            //disable the button till the async loadMore() is completed
            this.loadMoreButton.disabled = true;

            await this.loadMore(); // Now "this" refers to the instance of HeroesView

            this.loadMoreButton.disabled = false;

        })

        //assign the debounce fnc to a variable
        const debouncedSearch = this.deBounce((inputValue) => {
            this.search(inputValue);
        });

        //search input field action
        this.searchInputText.addEventListener('input', (event) => {
            const inputValue = event.target.value;
            debouncedSearch(inputValue); // Call the debounced function and pass the input value
          });
        // close modal func
        //event delegation because the close button was not created yet
        this.characterModal.addEventListener('click', function(event) {
            event.preventDefault()
            if(event.target.tagName === 'A') {
                document.querySelector('.heroe-stats-container').remove()
            }
        })
    }
    async callApi() {

        return  this.heroes = await MarvelApi.search(this.itemsToLoad)
        
    }

    //deBounce function
    deBounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                func.apply(this, args)
            }, timeout)
        }
    }
    
    async search(inputValue) {
        console.log(inputValue)

        //assign the loadApi to heroes variable
        const heroes = await this.callApi(this.itemsToLoadLimit)

        //clear the heroes on the screen every key(with debounce) typed on search
        this.container.innerHTML = ''

        // if search is empty load 8 heroes and show loadmore button
        if(inputValue == '') {
            this.searchNotFound.style.display = 'none'
            this.loadMore()
            this.currentPage = 1
            this.loadMoreButton.style.display = 'block'
        }
        //filter the array with the value passed on search input
        const  newHeroes = heroes.filter((heroe) => heroe.name.toLowerCase().includes(inputValue.toLowerCase()))

        //if filter returns no heroes show message not found
        if(newHeroes.length == 0 ){
            this.searchNotFound.style.display = 'block'
            this.searchNotFoundValue.innerText = inputValue
            this.loadMoreButton.style.display = 'none'
        }
        //if the filter returns smt hide not found message and display the heroes on the screen
        if(newHeroes.length !== 0 && inputValue !== '') {
            this.searchNotFound.style.display = 'none'
            this.update(newHeroes)
        }

    }

    async loadMore() {

        // if itemsToLoad is smaller than the api limit response increment itemsToLoad
        const isBigger = this.itemsToLoad >= this.itemsToLoadLimit
        if(isBigger) {
            this.itemsToLoad = this.itemsToLoadLimit
            // Hide the "Load More" button if no more items to display
            this.loadMoreButton.style.display = 'none';
        }    
        this.heroes = await this.callApi()
        

        //set the start and end of slice function
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        
        const heroesToDisplay = this.heroes.slice(startIndex, endIndex);

        //call uptdate with next 4 items i want to display
        this.update(heroesToDisplay);
        
        this.currentPage++; // Increment the page number

        if( this.itemsToLoad < this.itemsToLoadLimit) this.itemsToLoad += this.itemsPerPage




    }
    

    update(heroesToDisplay) {

        heroesToDisplay.forEach((heroeItem) => {
            const heroe = this.createHeroe()
            heroe.querySelector('.character a').dataset.id = heroeItem.id
            heroe.querySelector('.character img').src = heroeItem.thumbnail.path+'/portrait_uncanny.'+heroeItem.thumbnail.extension
            heroe.querySelector('.character img').alt = heroeItem.name +' photo'
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
            <a href="" data-id="">
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


    async updateHeroeDetails(heroeId) {

            const heroes = await this.callApi()
            const heroDetail = heroes.find((heroe) => heroe.id == heroeId)

            const heroe = this.createHeroDetail()
            heroe.querySelector('.heroe-stats-container h2').innerText = heroDetail.name
            heroe.querySelector('.heroe-stats-container img').src = heroDetail.thumbnail.path+'/portrait_uncanny.'+heroDetail.thumbnail.extension
            heroe.querySelector('.heroe-stats-container img').alt = heroDetail.name +' photo'
            heroe.querySelector('.heroe-stats-container .details p').innerText = heroDetail.description
            heroDetail.series.items.forEach((serie) => {
                const p = document.createElement('p')
                p.innerText = serie.name
                heroe.querySelector('.heroe-stats-container .series').append(p)

            })

            this.containerModal.append(heroe)
    }

    createHeroDetail() {

        const detailContainer = document.createElement('div')
        detailContainer.classList.add('heroe-stats-container')

        detailContainer.innerHTML = 
        `
        <a href="" class="close">
                <?xml version="1.0" ?><svg data-name="Livello 1" id="Livello_1" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><title/><path d="M64,0a64,64,0,1,0,64,64A64.07,64.07,0,0,0,64,0Zm0,122a58,58,0,1,1,58-58A58.07,58.07,0,0,1,64,122Z"/><path d="M92.12,35.79a3,3,0,0,0-4.24,0L64,59.75l-23.87-24A3,3,0,0,0,35.88,40L59.76,64,35.88,88a3,3,0,0,0,4.25,4.24L64,68.25l23.88,24A3,3,0,0,0,92.13,88L68.24,64,92.13,40A3,3,0,0,0,92.12,35.79Z"/></svg>
            </a>
            <div class="container">
                <img src="assets/deadpool.png" alt="Deadpool">
                <div class="details">
                    <h2>Spider Man</h2>
                    <p class="description">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam sapiente, quo eligendi molestias laborum sed. Aperiam, nostrum pariatur fuga, itaque quae corporis ipsam non obcaecati, iusto minima hic similique earum!
                    </p>
                    <div class="series">
                        <h4>Series</h4>
                    </div>
                </div>
            </div>
        `
        return detailContainer
    }

}