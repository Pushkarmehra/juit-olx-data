// Enhanced JavaScript for JUIT OLX with WhatsApp and GitHub Integration
class JUITOLXApp {
    constructor() {
        this.products = [];
        this.githubConfig = {
            owner: 'Pushkarmehra', // Replace with your GitHub username
            repo: 'juit-olx-data', // Replace with your repository name
            token: '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', // Replace with your GitHub personal access token
            branch: 'main'
        };
        
        this.init();
    }

    async init() {
        await this.loadProductsFromGitHub();
        this.setupEventListeners();
        this.updateProductDisplay();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Setup navigation
        this.setupNavigation();
        
        // Setup product interactions
        this.setupProductInteractions();
        
        // Setup animations
        this.setupAnimations();
    }

    setupNavigation() {
        const sellLink = document.querySelector('.nav a[href=""]');
        if (sellLink) {
            sellLink.textContent = 'SELL';
            sellLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSellModal();
            });
        }

        // Navigation animations
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                link.style.color = '#00ff2f';
                setTimeout(() => {
                    link.style.color = '#ffffff';
                }, 200);
            });
        });
    }

    setupProductInteractions() {
        // We'll dynamically add event listeners when products are loaded
        this.updateProductEventListeners();
    }

    updateProductEventListeners() {
        // Remove existing listeners and add new ones
        const products = document.querySelectorAll('[id^="product"]');
        
        products.forEach((product, index) => {
            const chatButton = product.querySelector('button');
            const productData = this.products[index];
            
            if (chatButton && productData) {
                // Remove existing listener
                const newButton = chatButton.cloneNode(true);
                chatButton.parentNode.replaceChild(newButton, chatButton);
                
                // Add WhatsApp functionality
                newButton.addEventListener('click', () => {
                    this.openWhatsAppChat(productData);
                });
            }

            // Add hover effects
            this.setupProductHoverEffect(product);
        });
    }

    openWhatsAppChat(product) {
        const message = `Hi! I'm interested in your ${product.name} listed for ₹${product.price}. Is it still available?`;
        const whatsappUrl = `https://wa.me/${product.whatsapp}?text=${encodeURIComponent(message)}`;
        
        // Add click animation
        const button = event.target;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show notification
        this.showNotification('Opening WhatsApp...', 'success');
    }

    showSellModal() {
        // Remove existing modal if present
        const existingModal = document.querySelector('.sell-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'sell-modal';
        modal.innerHTML = `
            <div class="sell-modal-content">
                <div class="sell-modal-header">
                    <h2>Sell Your Product</h2>
                    <span class="close-sell-modal">&times;</span>
                </div>
                <form id="sellForm" class="sell-form">
                    <div class="form-group">
                        <label for="productName">Product Name *</label>
                        <input type="text" id="productName" name="productName" required 
                               placeholder="e.g., Gaming Laptop, Study Table...">
                    </div>
                    
                    <div class="form-group">
                        <label for="productPrice">Price (in ₹) *</label>
                        <input type="number" id="productPrice" name="productPrice" required 
                               placeholder="0" min="1">
                    </div>
                    
                    <div class="form-group">
                        <label for="sellerName">Your Name *</label>
                        <input type="text" id="sellerName" name="sellerName" required 
                               placeholder="Your full name">
                    </div>
                    
                    <div class="form-group">
                        <label for="whatsappNumber">WhatsApp Number *</label>
                        <input type="tel" id="whatsappNumber" name="whatsappNumber" required 
                               placeholder="e.g., 919876543210 (with country code)">
                        <small>Include country code (e.g., 91 for India)</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="productCondition">Condition *</label>
                        <select id="productCondition" name="productCondition" required>
                            <option value="">Select condition</option>
                            <option value="Brand New">Brand New</option>
                            <option value="Like New">Like New</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="productDescription">Description</label>
                        <textarea id="productDescription" name="productDescription" 
                                  placeholder="Describe your product..." rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="productImage">Product Image *</label>
                        <input type="file" id="productImage" name="productImage" 
                               accept="image/*" required>
                        <div id="imagePreview" class="image-preview"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="submit-btn">
                            <span class="btn-text">Publish Product</span>
                            <span class="btn-loading" style="display: none;">Publishing...</span>
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.addSellModalStyles();
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Setup modal events
        this.setupSellModalEvents(modal);
    }

    setupSellModalEvents(modal) {
        const closeBtn = modal.querySelector('.close-sell-modal');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const form = modal.querySelector('#sellForm');
        const imageInput = modal.querySelector('#productImage');
        const imagePreview = modal.querySelector('#imagePreview');

        // Close modal events
        closeBtn.addEventListener('click', () => this.closeSellModal(modal));
        cancelBtn.addEventListener('click', () => this.closeSellModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeSellModal(modal);
        });

        // Image preview
        imageInput.addEventListener('change', (e) => {
            this.handleImagePreview(e.target.files[0], imagePreview);
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSellFormSubmit(form, modal);
        });

        // Focus first input
        modal.querySelector('#productName').focus();
    }

    handleImagePreview(file, previewContainer) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                    <p>Image selected: ${file.name}</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    }

    async handleSellFormSubmit(form, modal) {
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        try {
            const formData = new FormData(form);
            const productData = {
                name: formData.get('productName'),
                price: parseInt(formData.get('productPrice')),
                seller: formData.get('sellerName'),
                whatsapp: formData.get('whatsappNumber'),
                condition: formData.get('productCondition'),
                description: formData.get('productDescription') || 'No description provided',
                id: Date.now(), // Simple ID generation
                dateAdded: new Date().toISOString()
            };

            const imageFile = formData.get('productImage');
            
            // Save to GitHub
            await this.saveProductToGitHub(productData, imageFile);
            
            // Add to local products array
            this.products.push(productData);
            
            // Update display
            this.updateProductDisplay();
            
            // Close modal
            this.closeSellModal(modal);
            
            // Show success message
            this.showNotification('Product published successfully!', 'success');
            
        } catch (error) {
            console.error('Error publishing product:', error);
            this.showNotification('Error publishing product. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    async saveProductToGitHub(productData, imageFile) {
        try {
            // Convert image to base64
            const imageBase64 = await this.fileToBase64(imageFile);
            
            // Save image to GitHub
            const imagePath = `images/product_${productData.id}.${imageFile.name.split('.').pop()}`;
            await this.saveFileToGitHub(imagePath, imageBase64, `Add product image ${productData.id}`);
            
            // Add image path to product data
            productData.imagePath = imagePath;
            
            // Load existing products
            let existingProducts = [];
            try {
                const productsFile = await this.getFileFromGitHub('products.json');
                existingProducts = JSON.parse(atob(productsFile.content));
            } catch (e) {
                // File doesn't exist yet, start with empty array
            }
            
            // Add new product
            existingProducts.push(productData);
            
            // Save updated products list
            const productsJson = JSON.stringify(existingProducts, null, 2);
            await this.saveFileToGitHub('products.json', btoa(productsJson), `Add product: ${productData.name}`);
            
        } catch (error) {
            console.error('GitHub save error:', error);
            throw error;
        }
    }

    async loadProductsFromGitHub() {
        try {
            const productsFile = await this.getFileFromGitHub('products.json');
            const products = JSON.parse(atob(productsFile.content));
            this.products = products;
        } catch (error) {
            console.log('No existing products found or error loading:', error);
            // Start with default products if GitHub load fails
            this.products = [
                {
                    id: 1,
                    name: "test 1",
                    price: 850,
                    seller: "Alex Kumar",
                    whatsapp: "919876543210",
                    condition: "Like New",
                    description: "High-performance gaming laptop with RTX graphics",
                    imagePath: "image/Product1.png"
                },
                {
                    id: 2,
                    name: "Test 2",
                    price: 120,
                    seller: "Priya Singh",
                    whatsapp: "919876543211",
                    condition: "Good",
                    description: "Wooden study desk perfect for dorm rooms",
                    imagePath: "image/Product2.png"
                },
                {
                    id: 3,
                    name: "Test 3",
                    price: 200,
                    seller: "Rahul Sharma",
                    whatsapp: "919876543212",
                    condition: "Excellent",
                    description: "Mountain bike in excellent condition",
                    imagePath: "image/Product3.png"
                }
            ];
        }
    }

    async getFileFromGitHub(path) {
        const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${path}`, {
            headers: {
                'Authorization': `token ${this.githubConfig.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        return await response.json();
    }

    async saveFileToGitHub(path, content, message) {
        let sha = null;
        
        // Try to get existing file SHA
        try {
            const existingFile = await this.getFileFromGitHub(path);
            sha = existingFile.sha;
        } catch (e) {
            // File doesn't exist, no SHA needed
        }
        
        const body = {
            message: message,
            content: content,
            branch: this.githubConfig.branch
        };
        
        if (sha) {
            body.sha = sha;
        }
        
        const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.githubConfig.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        return await response.json();
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }

    updateProductDisplay() {
        const container = document.querySelector('.container');
        
        // Clear existing products
        container.innerHTML = '';
        
        // Add products dynamically
        this.products.forEach((product, index) => {
            const productElement = this.createProductElement(product, index + 1);
            container.appendChild(productElement);
        });
        
        // Update event listeners
        this.updateProductEventListeners();
        
        // Add animations
        this.setupProductAnimations();
    }

    createProductElement(product, displayIndex) {
        const productDiv = document.createElement('div');
        productDiv.className = `product${displayIndex}`;
        productDiv.id = `product${displayIndex}`;
        
        // Use GitHub raw URL for images stored in GitHub, or local path for default images
        const imageUrl = product.imagePath.includes('image/') 
            ? product.imagePath 
            : `https://raw.githubusercontent.com/${this.githubConfig.owner}/${this.githubConfig.repo}/${this.githubConfig.branch}/${product.imagePath}`;
        
        productDiv.style.backgroundImage = `
            linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.85) 65%, rgba(255,255,255,0.95) 100%), 
            url('${imageUrl}')
        `;
        
        productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p class="seller-info"><small>Seller: ${product.seller}</small></p>
            <p>Condition: <span class="condition">${product.condition}</span></p>
            <p>Price: <span class="price">₹${product.price}</span></p>
            <button>Chat Now</button>
        `;
        
        return productDiv;
    }

    setupProductAnimations() {
        const products = document.querySelectorAll('[id^="product"]');
        
        products.forEach((product, index) => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                product.style.transition = 'all 0.6s ease';
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    setupProductHoverEffect(product) {
        product.addEventListener('mouseenter', () => {
            product.style.transform = 'translateY(-5px) scale(1.02)';
            product.style.boxShadow = '0 8px 80px rgba(255, 255, 255, 0.6)';
        });
        
        product.addEventListener('mouseleave', () => {
            product.style.transform = 'translateY(0) scale(1)';
            product.style.boxShadow = '0 2px 60px rgba(255, 255, 255, 0.441)';
        });
    }

    setupAnimations() {
        // Logo animations
        const logoSpans = document.querySelectorAll('.logo h1 span');
        
        logoSpans.forEach((span, index) => {
            span.addEventListener('mouseenter', () => {
                span.style.transform = 'scale(1.1) rotate(5deg)';
                span.style.transition = 'transform 0.3s ease';
            });
            
            span.addEventListener('mouseleave', () => {
                span.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    closeSellModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const bgColor = type === 'success' ? '#00ff2f' : type === 'error' ? '#ff4444' : '#333';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${bgColor};
            color: white;
            border-radius: 5px;
            z-index: 10001;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    addSellModalStyles() {
        if (document.querySelector('#sell-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'sell-modal-styles';
        styles.textContent = `
            .sell-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                overflow-y: auto;
                padding: 20px;
            }
            
            .sell-modal.show {
                opacity: 1;
            }
            
            .sell-modal-content {
                background: #fff;
                border-radius: 15px;
                width: 100%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .sell-modal.show .sell-modal-content {
                transform: scale(1);
            }
            
            .sell-modal-header {
                padding: 20px 30px;
                border-bottom: 2px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #00ff2f, #00cc25);
                color: white;
                border-radius: 15px 15px 0 0;
            }
            
            .sell-modal-header h2 {
                margin: 0;
                font-size: 24px;
            }
            
            .close-sell-modal {
                font-size: 28px;
                cursor: pointer;
                color: white;
                transition: color 0.3s ease;
                line-height: 1;
            }
            
            .close-sell-modal:hover {
                color: #ffcccc;
            }
            
            .sell-form {
                padding: 30px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
                font-size: 14px;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.3s ease;
                font-family: inherit;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #00ff2f;
                box-shadow: 0 0 0 3px rgba(0, 255, 47, 0.1);
            }
            
            .form-group small {
                display: block;
                margin-top: 5px;
                color: #666;
                font-size: 12px;
            }
            
            .image-preview {
                margin-top: 10px;
                text-align: center;
                padding: 10px;
                border: 2px dashed #e0e0e0;
                border-radius: 8px;
                background: #f9f9f9;
            }
            
            .image-preview img {
                margin-bottom: 10px;
            }
            
            .form-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .cancel-btn,
            .submit-btn {
                padding: 12px 30px;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 120px;
            }
            
            .cancel-btn {
                background: #f0f0f0;
                color: #666;
            }
            
            .cancel-btn:hover {
                background: #e0e0e0;
                color: #333;
            }
            
            .submit-btn {
                background: linear-gradient(135deg, #00ff2f, #00cc25);
                color: white;
            }
            
            .submit-btn:hover:not(:disabled) {
                background: linear-gradient(135deg, #00cc25, #00aa20);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 255, 47, 0.4);
            }
            
            .submit-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            @media (max-width: 768px) {
                .sell-modal {
                    padding: 10px;
                }
                
                .sell-modal-header {
                    padding: 15px 20px;
                }
                
                .sell-modal-header h2 {
                    font-size: 20px;
                }
                
                .sell-form {
                    padding: 20px;
                }
                
                .form-actions {
                    flex-direction: column-reverse;
                }
                
                .cancel-btn,
                .submit-btn {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JUITOLXApp();
});

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    [id^="product"] {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
    
    .logo h1 span {
        display: inline-block;
        transition: all 0.3s ease;
    }
`;

document.head.appendChild(animationStyles);