export class MarvelApi {
    static search() {
        
        const endPoint = 'http://gateway.marvel.com/v1/public/characters?limit=100&ts=1691389216&apikey=deee09649e76da698be9309401af1ab5&hash=31df0cb4cb6edcdb610ce8e2721dd832'
        
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
        
        this.update()

    }
    

    async update() {

        //get the response from marvel fetch class and assign to heroes variable
        const heroes = await MarvelApi.search();

        heroes.forEach((heroeItem) => {
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