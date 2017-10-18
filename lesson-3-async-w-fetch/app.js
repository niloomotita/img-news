(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        fetch(`https://api.unsplash.com/search/photos?page=${Math.round(Math.random() * 20)}&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 5de00ca53e86cd859cbe81351d8beeebb4b082ac0cbf49b916a5194352e0d89e'
            }
        }).then(response => response.json())
        .then(addImage)
        .catch(err => requestError(err, 'image'))
       
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=0c8e38753e53456aa02b916bd55daf59`, {
        }).then(response => response.json())
        .then(addArticles)
        .catch(err => requestError(err, 'articles'))
    })

    function requestError (err, part){
        responseContainer.insertAdjacentHTML('beforeend', `<p class='network-warning'>Oh no! There was an error making a request for the ${part}.</p>`)
    }

    function addImage(images) {
        let htmlContent = '';
        if (images && images.results && images.results[0]) {
            const firstImage = images.results[0];

            htmlContent = document.createElement('div');
            htmlContent.innerHTML = `<figure>
               <img src="${firstImage.urls.regular}" alt="${searchedForText}"/>
               <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;


        } else {
            htmlContent = document.createElement('div');
            htmlContent.innerHTML = '<div class="error-no-img"> No images available </div>';
        }


        responseContainer.insertAdjacentElement('afterbegin', htmlContent);
    }
    function addArticles(artic) {

        let htmlContent = '';

        if (artic && artic.response && artic.response.docs && artic.response.docs.length > 1) {
            htmlContent = document.createElement('div');
            htmlContent.innerHTML = `
            <ul> ${ artic.response.docs.map(article =>
                    `<li class="article">
                <div> 
                <h2>${article.headline.main}</h2>
                <p>${article.byline && article.byline.original || ''}</p>  
                ${article.snippet} 
                <div>
                <a href="${article.web_url}" target="blank"> Read more </a>
                </div>
                </div></br>
                </li>`)} 
              </ul>`;
        } else {
            htmlContent = document.createElement('div');
            htmlContent.innerHTML = '<div class="error-no-img"> No article available </div>';
        }


        responseContainer.insertAdjacentElement('beforeend', htmlContent);
    }
})();
