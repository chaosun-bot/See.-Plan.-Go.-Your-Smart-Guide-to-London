document.addEventListener('DOMContentLoaded', function() {
    // Hover effect is already implemented through CSS, only keeping the DOM load event here
    console.log('London attractions gallery loaded');
    
    // Get elements
    const gallery = document.querySelector('.gallery');
    const photoItems = document.querySelectorAll('.photo-item');
    const container = document.querySelector('.container');
    const exploreButton = document.querySelector('.explore-text');
    
    // Set current active photo index, -1 means no photo is active
    let activeIndex = -1;
    
    // Add click handler for explore button
    if (exploreButton) {
        exploreButton.addEventListener('click', function() {
            // Send message to parent window
            window.parent.postMessage('exploreClicked', '*');
        });
    }
    
    // Listen for message from parent window
    window.addEventListener('message', function(event) {
        if (event.data === 'ready') {
            console.log('Parent page is ready to receive messages');
        }
    });
    
    // Function to activate a photo
    function activatePhoto(index) {
        // If there is an active photo, remove its active class first
        if (activeIndex >= 0) {
            photoItems[activeIndex].classList.remove('active');
        }
        
        // Set new active index and add active class
        activeIndex = index;
        photoItems[activeIndex].classList.add('active');
        
        // Scroll to the current photo
        photoItems[activeIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
    
    // Clear all active states
    function clearActiveState() {
        if (activeIndex >= 0) {
            photoItems[activeIndex].classList.remove('active');
            activeIndex = -1;
        }
    }
    
    // Clear all active states when clicking on empty space in the container
    container.addEventListener('click', clearActiveState);
    
    // Prevent click events in the gallery from bubbling up to the container
    gallery.addEventListener('click', function(e) {
        // Only trigger clearing if clicking on empty space in the gallery (not on photo items)
        if (e.target === gallery) {
            clearActiveState();
        }
        e.stopPropagation();
    });
    
    // Add click handlers for photo links to navigate to corresponding landmark
    photoItems.forEach((item) => {
        const link = item.querySelector('a');
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            e.stopPropagation(); // Prevent event bubbling
            
            // Get the landmark index from data attribute
            const landmarkIndex = parseInt(this.getAttribute('data-landmark-index'));
            console.log('Clicked on landmark with index:', landmarkIndex);
            
            // IMPROVED METHOD: Use postMessage instead of changing location
            // This prevents losing the main index.html context
            try {
                // First, send message to navigate to Top10 section
                window.parent.postMessage('exploreClicked', '*');
                
                // Then, after a short delay, send message with landmark navigation details
                setTimeout(function() {
                    // Send the navigation message to Top10 Plus parent
                    window.parent.postMessage({
                        action: 'navigateToLandmark',
                        index: landmarkIndex
                    }, '*');
                    
                    console.log('Sent landmark navigation message:', landmarkIndex);
                }, 800);
            } catch (error) {
                console.error('Error navigating to landmark:', error);
            }
        });
    });
}); 