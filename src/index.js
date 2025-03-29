document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list");
    const quoteForm = document.getElementById("new-quote-form");

    // Fetch and display quotes
    function fetchQuotes() {
        fetch("http://localhost:3000/quotes?_embed=likes")
            .then((res) => res.json())
            .then((quotes) => {
                quoteList.innerHTML = "";
                quotes.forEach(displayQuote);
            });
    }

    // Display a quote
    function displayQuote(quote) {
        const li = document.createElement("li");
        li.classList.add("quote-card");

        const blockquote = document.createElement("blockquote");
        blockquote.classList.add("blockquote");

        blockquote.innerHTML = `
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class="btn-success">Likes: <span>${quote.likes.length}</span></button>
            <button class="btn-danger">Delete</button>
            <button class="btn-edit">Edit</button>
        `;

        // Like button event
        const likeButton = blockquote.querySelector(".btn-success");
        likeButton.addEventListener("click", () => likeQuote(quote, likeButton));

        // Delete button event
        const deleteButton = blockquote.querySelector(".btn-danger");
        deleteButton.addEventListener("click", () => deleteQuote(quote.id, li));

        // Edit button event
        const editButton = blockquote.querySelector(".btn-edit");
        editButton.addEventListener("click", () => editQuote(quote, li));

        li.appendChild(blockquote);
        quoteList.appendChild(li);
    }

    // Add new quote
    quoteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newQuote = document.getElementById("new-quote").value;
        const author = document.getElementById("author").value;

        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quote: newQuote, author }),
        })
            .then((res) => res.json())
            .then(displayQuote);

        quoteForm.reset();
    });

    // Like a quote
    function likeQuote(quote, button) {
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quoteId: quote.id }),
        })
            .then(() => {
                let likeCount = parseInt(button.querySelector("span").innerText);
                button.querySelector("span").innerText = likeCount + 1;
            });
    }

    // Delete a quote
    function deleteQuote(id, li) {
        fetch(`http://localhost:3000/quotes/${id}`, { method: "DELETE" })
            .then(() => li.remove());
    }

    // Edit a quote
    function editQuote(quote, li) {
        const newQuoteText = prompt("Edit quote:", quote.quote);
        const newAuthor = prompt("Edit author:", quote.author);
        
        if (newQuoteText && newAuthor) {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quote: newQuoteText, author: newAuthor }),
            })
                .then((res) => res.json())
                .then(() => {
                    li.querySelector("p").innerText = newQuoteText;
                    li.querySelector("footer").innerText = newAuthor;
                });
        }
    }

    // Fetch and display quotes on page load
    fetchQuotes();
});
