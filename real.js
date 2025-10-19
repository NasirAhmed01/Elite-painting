
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true
        });
        
        // Enhanced Slider Functionality
        const slider = document.getElementById('main-slider');
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        const dotsContainer = document.getElementById('slider-dots');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        const dots = document.querySelectorAll('.dot');
        
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        }
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Auto slide
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause auto slide on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Cart functionality
        const cartToggle = document.getElementById('cart-toggle');
        const closeCart = document.getElementById('close-cart');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartShipping = document.getElementById('cart-shipping');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        let cart = [];
        const shippingCost = 200; // Fixed shipping cost
        
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('show');
        });
        
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('show');
        });
        
        cartOverlay.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('show');
        });
        
        // Add to cart functionality
        document.querySelectorAll('.btn-add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = parseInt(this.getAttribute('data-price'));
                const image = this.getAttribute('data-image');
                
                addToCart(id, name, price, image);
                
                // Visual feedback
                this.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
                this.style.background = '#28a745';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>Add to Cart';
                    this.style.background = '';
                }, 1500);
            });
        });
        
        function addToCart(id, name, price, image) {
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            updateCart();
        }
        
        function updateCart() {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="text-center py-5 text-muted">
                        <i class="fas fa-shopping-cart fa-3x mb-3"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                cartSubtotal.textContent = '₹0';
                cartShipping.textContent = '₹0';
                cartTotal.textContent = '₹0';
                checkoutBtn.disabled = true;
            } else {
                let subtotal = 0;
                cartItems.innerHTML = '';
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;
                    
                    cartItems.innerHTML += `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-item-details">
                                <h6>${item.name}</h6>
                                <div class="cart-item-price">₹${item.price}</div>
                                <div class="cart-quantity">
                                    <button class="quantity-btn decrease-quantity" data-index="${index}">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span>${item.quantity}</span>
                                    <button class="quantity-btn increase-quantity" data-index="${index}">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <button class="remove-item" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                });
                
                const total = subtotal + (subtotal > 0 ? shippingCost : 0);
                
                cartSubtotal.textContent = `₹${subtotal}`;
                cartShipping.textContent = subtotal > 0 ? `₹${shippingCost}` : '₹0';
                cartTotal.textContent = `₹${total}`;
                checkoutBtn.disabled = false;
                
                // Add event listeners to quantity buttons and remove buttons
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        if (cart[index].quantity > 1) {
                            cart[index].quantity -= 1;
                        } else {
                            cart.splice(index, 1);
                        }
                        updateCart();
                    });
                });
                
                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        cart[index].quantity += 1;
                        updateCart();
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        cart.splice(index, 1);
                        updateCart();
                    });
                });
            }
        }
        
        // Checkout functionality
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Thank you for your purchase! Your order has been placed.');
                cart = [];
                updateCart();
                cartSidebar.classList.remove('open');
                cartOverlay.classList.remove('show');
            }
        });
        
        // Modal functionality
        const accountModal = document.getElementById('accountModal');
        const openModalBtn = document.getElementById('openModalBtn');
        const openContactModal = document.getElementById('openContactModal');
        const closeModal = document.querySelector('.close');
        
        openModalBtn.addEventListener('click', () => {
            accountModal.style.display = 'flex';
        });
        
        openContactModal.addEventListener('click', () => {
            accountModal.style.display = 'flex';
        });
        
        closeModal.addEventListener('click', () => {
            accountModal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === accountModal) {
                accountModal.style.display = 'none';
            }
        });
        
        // Tab functionality
        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show the selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Update active state of buttons
            const buttons = document.querySelectorAll('.modal-content .btn');
            buttons.forEach(btn => {
                if (btn.textContent.toLowerCase().includes(tabName)) {
                    btn.classList.add('active');
                    btn.classList.remove('btn-outline-primary');
                    btn.classList.add('btn-primary');
                } else {
                    btn.classList.remove('active');
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-primary');
                }
            });
        }
        
        // Form submission
        const loginForm = document.querySelector('#login form');
        const signupForm = document.querySelector('#signup form');
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login functionality would be implemented here');
            accountModal.style.display = 'none';
        });
        
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Sign up functionality would be implemented here');
            accountModal.style.display = 'none';
        });
        
        // Rating counter animation
        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerHTML = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
        
        // Initialize rating counters when in view
        const ratings = document.querySelectorAll('.rating');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-target'));
                    animateValue(target, 0, finalValue, 2000);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        ratings.forEach(rating => {
            observer.observe(rating);
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    

// new about

  function initMap() {
            const location = { lat: 40.7128, lng: -74.0060 }; // Replace with your company's lat/lng
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: location,
            });
            const marker = new google.maps.Marker({
                position: location,
                map: map,
            });
        }
        window.onload = initMap;

        // Simple form submission (alert for demo)
        function submitForm(event) {
            event.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            document.getElementById('contact-form').reset();
        }





        // Mobile/Touch Support: Toggle on click
        function toggleCard(card) {
            if (window.innerWidth <= 768) {
                card.classList.toggle('active');
            }
        }

        // Close on outside click (for mobile)
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.card')) {
                document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            }
        });



        // card ka kam
        const button = document.getElementById("toggleBtn");
        const hiddenCards = document.querySelectorAll(".card.hidden");

        button.addEventListener("click", () => {
            hiddenCards.forEach(card => {
                card.classList.toggle("hidden");
            });

            // Button text change
            if (button.textContent === "Show More") {
                button.textContent = "Show Less";
            } else {
                button.textContent = "Show More";
            }
        });

