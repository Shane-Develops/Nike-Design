document.addEventListener('DOMContentLoaded', () => {
    const shoes = [
        { id: 1, name: "Mocha Air Jordan 1's", image: "imgs/TravisScottAirJordan1Mocha.png", price: "$150", stars: 4.5, reviews: 120 },
        { id: 2, name: "Fragments Air Jordan 1's", image: "imgs/TravisScottXAirJordan1Fragments.png", price: "$130", stars: 4.0, reviews: 90 },
        { id: 3, name: "R-Mocha's Air Jordan 1's", image: "imgs/TravisScottXAirJordan1Reverse.png", price: "$200", stars: 4.8, reviews: 200 },
        { id: 4, name: "Mocha-High Air Jordan", image: "imgs/TravisScottXAirJordan1RetroHigh.png", price: "$130", stars: 4.0, reviews: 90 },
        { id: 5, name: "Phantoms Air Jordan 1's", image: "imgs/TravisScottXAirJordan1Phantoms.png", price: "$130", stars: 4.0, reviews: 90 },
        { id: 6, name: "Olive Air Jordan 1's", image: "imgs/1049526_00.png.png", price: "$130", stars: 4.0, reviews: 90 },
    ];

    let likedShoes = JSON.parse(localStorage.getItem('likedShoes')) || [];
    const likeCountElement = document.getElementById('like-count');
    const shoesContainer = document.querySelector('.Shoes');

    function updateLikeCount() {
        likeCountElement.textContent = likedShoes.length;
        localStorage.setItem('likeCount', likedShoes.length);
    }
    updateLikeCount()

    function updateHeartAlert() {
        const heartAlert = document.getElementById('heart-alert');
        heartAlert.textContent = `You have liked ${likedShoes.length} shoes.`;
    }

    function generateShoeCard(shoe) {
        const card = document.createElement('div');
        card.className = 'shoe-card w-64 mx-auto mt-4 rounded-lg overflow-hidden';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container relative bg-gray-200 p-4 flex justify-center';

        const img = document.createElement('img');
        img.src = shoe.image;
        img.alt = shoe.name;
        img.className = 'w-full h-55 drop-shadow-md';

        const likeButton = document.createElement('button');
        likeButton.className = 'absolute top-2 right-2 text-gray-600 text-2xl';
        likeButton.innerHTML = '<i class="fas fa-heart like-shoe" data-id="' + shoe.id + '"></i>';

        if (likedShoes.some(likedShoe => likedShoe.id === shoe.id)) {
            likeButton.querySelector('.like-shoe').classList.add('text-red-500');
        }

        imgContainer.appendChild(img);
        imgContainer.appendChild(likeButton);

        const addToCartButton = document.createElement('button');
        addToCartButton.className = 'add-to-cart absolute bottom-0 left-0 w-full bg-black text-white py-2 opacity-0 transition-opacity duration-300';
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(shoe);
        });

        imgContainer.appendChild(addToCartButton);

        imgContainer.addEventListener('mouseenter', () => {
            addToCartButton.style.opacity = '1';
        });

        imgContainer.addEventListener('mouseleave', () => {
            addToCartButton.style.opacity = '0';
        });

        const cardBody = document.createElement('div');
        cardBody.className = 'p-4 text-left';
        cardBody.style.backgroundColor = '#faf9f6';

        const name = document.createElement('h2');
        name.textContent = shoe.name;
        name.className = 'text-lg font-bold text-gray-800';

        const price = document.createElement('p');
        price.textContent = shoe.price;
        price.className = 'text-lg text-gray-700';

        const starsContainer = document.createElement('div');
        starsContainer.className = 'flex items-center text-yellow-500 space-x-1 mt-1';

        const fullStars = Math.floor(shoe.stars);
        const halfStar = shoe.stars % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement('span');
            star.innerHTML = '&#9733;';
            starsContainer.appendChild(star);
        }

        if (halfStar) {
            const halfStarElement = document.createElement('span');
            halfStarElement.innerHTML = '&#9733;';
            starsContainer.appendChild(halfStarElement);
        }

        const reviews = document.createElement('p');
        reviews.textContent = `(${shoe.reviews})`;
        reviews.className = 'text-gray-600 ml-2';

        starsContainer.appendChild(reviews);

        cardBody.appendChild(name);
        cardBody.appendChild(price);
        cardBody.appendChild(starsContainer);

        card.appendChild(imgContainer);
        card.appendChild(cardBody);

        return card;
    }

    function addToCart(shoe) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.name === shoe.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            shoe.quantity = 1;
            cart.push(shoe);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateDropdown();
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function updateDropdown() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const dropdown = document.getElementById('cart-dropdown');
        dropdown.innerHTML = '';

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center';

            const itemName = document.createElement('span');
            itemName.textContent = item.name;

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity;
            quantityInput.min = 1;
            quantityInput.className = 'quantity-input w-12 text-center';
            quantityInput.addEventListener('change', (event) => {
                item.quantity = parseInt(event.target.value);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateSubtotal();
                updateTotal();
                updatePriceOnCard(item);
            });

            listItem.appendChild(itemName);
            listItem.appendChild(quantityInput);
            dropdown.appendChild(listItem);
        });

        updateSubtotal();
        updateTotal();
    }

    function updateSubtotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((total, item) => total + item.quantity * parseFloat(item.price.replace('$', '')), 0);
        document.getElementById('subtotal').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    }

    function updateTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((total, item) => total + item.quantity * parseFloat(item.price.replace('$', '')), 0);
        document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
    }

    function updatePriceOnCard(item) {
        const shoeCards = document.querySelectorAll('.shoe-card');
        shoeCards.forEach(card => {
            const nameElement = card.querySelector('h2');
            if (nameElement.textContent === item.name) {
                const priceElement = card.querySelector('.text-lg.text-gray-700');
                priceElement.textContent = `$${(item.quantity * parseFloat(item.price.replace('$', ''))).toFixed(2)}`;
            }
        });
    }

    shoesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('like-shoe')) {
            const shoeId = event.target.getAttribute('data-id');
            const shoe = shoes.find(shoe => shoe.id == shoeId);
            const existingItem = likedShoes.find(item => item.id === shoe.id);
            if (existingItem) {
                likedShoes = likedShoes.filter(item => item.id !== shoe.id);
                event.target.classList.remove('text-red-500');
            } else {
                likedShoes.push(shoe);
                event.target.classList.add('text-red-500');
            }
            localStorage.setItem('likedShoes', JSON.stringify(likedShoes));
            updateLikeCount();
            updateHeartAlert();
        }
    });

    shoes.forEach(shoe => {
        const shoeCard = generateShoeCard(shoe);
        shoesContainer.appendChild(shoeCard);
    });

    const bestSellingShoesContainer = document.querySelector('.BestSellingShoes');
    shoes.forEach(shoe => {
        const shoeCard = generateShoeCard(shoe);
        bestSellingShoesContainer.appendChild(shoeCard);
    });

    updateCartCount();
    updateDropdown();
    updateLikeCount();
    updateHeartAlert();
});