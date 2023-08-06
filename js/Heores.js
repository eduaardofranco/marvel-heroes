export class MarvelApi {
    static search() {
        const endPoint = 'http://gateway.marvel.com/v1/public/comics?ts=1&apikey=deee09649e76da698be9309401af1ab5&hash=88aba53821d4be560f6d637dd1d5bbd4'
        
        return fetch(endPoint)
        .then(data => data.json())
        .then(data => console.log(data))
        // .then(({ name, author, thumbnail }) => ({
        //     thumbnail,
        //     name
        // }))
deee09649e76da698be9309401af1ab5
    }
}
export class Heores {
    constructor(root) {

        this.root = document.getElementById(root)

        this.container = document.querySelector('.character-container')

        MarvelApi.search()
    }
}

export class HeroesView extends Heores {
    constructor(root) {
        super(root)
    

       this.update()

    }
    entries = []
    update() {
        this.entries.forEach((user) => {
            const heroe = this.createHeroe()
            heroe.querySelector('.character img').src = user.thumbnail
            heroe.querySelector('.character img').alt = user.name +' photo'
            heroe.querySelector('.character p').textContent = user.author
            heroe.querySelector('.character h3').textContent = user.name

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