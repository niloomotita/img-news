(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.onload = addImage;
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 5de00ca53e86cd859cbe81351d8beeebb4b082ac0cbf49b916a5194352e0d89e');
        unsplashRequest.send();
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=0c8e38753e53456aa02b916bd55daf59`);
        articleRequest.send();
    });


    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];

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

    function addArticles() {

        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.response && data.response.docs && data.response.docs.length>1) {
            htmlContent = document.createElement('div');
            htmlContent.innerHTML = `<ul> ${ data.response.docs.map(article =>`<li class="article"><div> <h2>${article.headline.main}</h2> <p>${article.byline && article.byline.original || ''}</p>  ${article.snippet} 
            <div><a href="${article.web_url}"> Read more </a></div>
              </div></br></li>`)} </ul>`;
        } else {
            htmlContent = document.createElement('div');
            htmlContent.innerHTML = '<div class="error-no-img"> No article available </div>';
        }


        responseContainer.insertAdjacentElement('beforeend', htmlContent);
    }


})();


