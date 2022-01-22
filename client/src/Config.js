const config = {
    backend: 'https://uutisahti.herokuapp.com', //for local development use: http://localhost:5000
    language: 'en',
    strings: {
        'fi': {
            main_title: "Uutisten massahakija",
            secondary_title: "Löydä uutiset vaivatta",
            no_input: "Ei vielä tiedostoa tai tekstiä",
            no_data_set: "Et ole vielä syöttänyt tekstiä tai tiedostoa!",
            searching_with_image: "Artikkeli etsitään valitulla kuvalla",
            searching_with_text: "Artikkeli etsitään tekstin avulla",
            server_error: "Palvelin antoi virheen",
            request_ratelimit_error: "Odota hieman kunnes haet uudestaan...",
            unknown_request_error: "Pyyntö epäonnistui tuntemattomasta syystä...",
            request_pending: "Lähetimme pyynnön, odota...",
            error_request_in_progress: "Viimeinen pyyntösi on vielä kesken, odota hetki...",
            no_results: "Yhtään artikkelia ei löytynyt!",
            text_input_placeholder: "Pätkä uutisesta tähän...",
            drag_and_drop: "Vedä & Pudota",
            drag_and_drop_filetype: "Ainoastaan kuvia",
            instructions: "Kirjoita pätkä uutisesta, tai syötä kuvankaappaus",
            fetch_button_search: "Etsi",
            results: "Tulokset",
            points: "Pistettä",
            header_about: "Tietoja"
        },
        'en': {
            main_title: "Article Mass Searcher",
            secondary_title: "Find Finnish news articles effortlessly",
            no_input: "No file or text selected yet",
            no_data_set: "You haven't set any text or images yet!",
            searching_with_image: "Article will be searched with the selected image",
            searching_with_text: "Article will be searched with the text",
            server_error: "The server returned an error",
            request_ratelimit_error: "Please wait a bit until searching again...",
            unknown_request_error: "Something wrong happened with the request...",
            request_pending: "Request has been sent, please wait...",
            error_request_in_progress: "Your last request is still processing, please wait a bit...",
            no_results: "No articles were found!",
            text_input_placeholder: "A piece from the article here...",
            drag_and_drop: "Drag & Drop",
            drag_and_drop_filetype: "Only pictures",
            instructions: "Write a paragraph from the article, or select an image",
            fetch_button_search: "Search",
            results: "Results",
            points: "points",
            header_about: "About"
        }
    }
};

export default config;