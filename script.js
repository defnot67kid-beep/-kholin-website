document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Active State Switching
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');
        });
    });

    // 2. "View Changes" Button Interaction
    const viewChangesBtn = document.querySelector('.btn-view-changes');
    viewChangesBtn.addEventListener('click', () => {
        // In a real app, this would open the changelog popup/modal
        alert('Changelog feature coming soon!');
    });

    // 3. "Show More Features" Toggle
    const featureBtns = document.querySelectorAll('.btn-features');
    
    featureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.innerText;
            
            // Simple toggle logic for demonstration
            if(originalText === "Show More Features") {
                this.innerText = "Show Less";
                // Here you would append hidden list items dynamically
                // alert('Expanding feature list (logic placeholder)');
            } else {
                this.innerText = "Show More Features";
            }
        });
    });

    // 4. Subscription Buttons (Placeholder)
    const subBtns = document.querySelectorAll('.btn-subscribe');
    subBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real app, this would redirect to Stripe/Paddle checkout
            alert('Redirecting to subscription checkout...');
        });
    });
});