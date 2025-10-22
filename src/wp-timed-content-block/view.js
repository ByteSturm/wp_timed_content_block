/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

// Import styles
import './style.scss';

/**
 * Check if the current time is within the specified time range
 * 
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {string} currentTime - Current time in HH:MM format
 * @returns {boolean} Whether current time is within the range
 */
function isTimeInRange(startTime, endTime, currentTime) {
    // Handle overnight ranges (e.g., 22:00 to 06:00)
    if (startTime > endTime) {
        return currentTime >= startTime || currentTime <= endTime;
    }
    return currentTime >= startTime && currentTime <= endTime;
}

/**
 * Format time to HH:MM for comparison
 * 
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    }).substring(0, 5);
}

/**
 * Initialize the Timed Content Block
 */
function initTimedContentBlocks() {
    // Find all timed content blocks
    const blocks = document.querySelectorAll('.wp-block-wp-timed-content-block');
    
    if (!blocks.length) {
        return;
    }
    
    // Process each block
    blocks.forEach(block => {
        try {
            // Get attributes from data attributes
            const startDateTime = block.dataset.startDatetime;
            const endDateTime = block.dataset.endDatetime;
            const isRecurring = block.dataset.recurring === 'true';
            const daysOfWeek = JSON.parse(block.dataset.daysOfWeek || '[]');
            const timezone = block.dataset.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // If required data is missing, show the block and exit
            if ((!startDateTime || !endDateTime) && !isRecurring) {
                block.classList.remove('timed-content-hidden');
                return;
            }
            
            // Create dates in the specified timezone
            const options = { timeZone: timezone };
            const now = new Date();
            const currentTimeStr = now.toLocaleTimeString('en-US', { ...options, hour12: false, hour: '2-digit', minute: '2-digit' });
            const currentTime = formatTime(new Date(`1970-01-01T${currentTimeStr}`));
            const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
            
            let shouldShow = false;
            
            if (isRecurring) {
                // For recurring events, check if current day is in the selected days
                // and if current time is within the specified time range
                const startDate = new Date(startDateTime);
                const endDate = new Date(endDateTime);
                
                const startTime = formatTime(startDate);
                const endTime = formatTime(endDate);
                
                const isDaySelected = daysOfWeek.length === 0 || daysOfWeek.includes(currentDay);
                const isTimeInRangeValue = isTimeInRange(startTime, endTime, currentTime);
                
                shouldShow = isDaySelected && isTimeInRangeValue;
            } else {
                // For one-time events, check if current time is within the date range
                const startDate = new Date(startDateTime);
                const endDate = new Date(endDateTime);
                
                // Adjust dates to the same timezone for comparison
                const startTime = new Date(startDate.toLocaleString('en-US', { timeZone: timezone }));
                const endTime = new Date(endDate.toLocaleString('en-US', { timeZone: timezone }));
                const currentTimeDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
                
                shouldShow = currentTimeDate >= startTime && currentTimeDate <= endTime;
            }
            
            // Toggle visibility
            if (shouldShow) {
                block.classList.remove('timed-content-hidden');
            } else {
                block.classList.add('timed-content-hidden');
            }
            
        } catch (error) {
            console.error('Error processing timed content block:', error);
            // Show the block if there's an error
            block.classList.remove('timed-content-hidden');
        }
    });
    
    // Set up an interval to check the time periodically (every minute)
    // Only set the interval if we have blocks to monitor
    if (blocks.length > 0) {
        // Check immediately
        initTimedContentBlocks.checkInterval = setInterval(initTimedContentBlocks, 60000);
    }
}

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimedContentBlocks);
} else {
    initTimedContentBlocks();
}

// Export for potential programmatic use
window.TimedContentBlock = {
    init: initTimedContentBlocks
};
