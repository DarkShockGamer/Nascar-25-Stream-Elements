/*
 * shared.js
 * Shared utility functions and helpers for NASCAR 25 Stream Overlay
 * Includes element creation, animation utilities, and placeholder event connection
 */

/* ============================================================
   DOM UTILITY FUNCTIONS
   ============================================================ */

/**
 * Create a DOM element with optional classes, attributes, and text content
 * @param {string} tag - HTML tag name
 * @param {Object} options - Configuration object
 * @param {string|string[]} options.classes - CSS class(es) to add
 * @param {Object} options.attrs - Attributes to set on element
 * @param {string} options.text - Text content
 * @param {string} options.html - Inner HTML content
 * @returns {HTMLElement}
 */
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  
  // Add classes
  if (options.classes) {
    const classes = Array.isArray(options.classes) ? options.classes : [options.classes];
    element.classList.add(...classes);
  }
  
  // Set attributes
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  // Set text content
  if (options.text) {
    element.textContent = options.text;
  }
  
  // Set HTML content
  if (options.html) {
    element.innerHTML = options.html;
  }
  
  return element;
}

/**
 * Safely escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format timestamp to HH:MM:SS or HH:MM
 * @param {Date} date - Date object
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string}
 */
function formatTimestamp(date = new Date(), includeSeconds = true) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
}

/**
 * Format number with commas (e.g., 1234567 -> 1,234,567)
 * @param {number} num - Number to format
 * @returns {string}
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: $)
 * @returns {string}
 */
function formatCurrency(amount, currency = '$') {
  return `${currency}${amount.toFixed(2)}`;
}

/* ============================================================
   ANIMATION UTILITIES
   ============================================================ */

/**
 * Add a CSS animation class and optionally remove it after completion
 * @param {HTMLElement} element - Target element
 * @param {string} animationClass - CSS class to add
 * @param {boolean} removeAfter - Remove class after animation ends
 * @returns {Promise}
 */
function animateElement(element, animationClass, removeAfter = true) {
  return new Promise((resolve) => {
    element.classList.add(animationClass);
    
    const handleAnimationEnd = () => {
      if (removeAfter) {
        element.classList.remove(animationClass);
      }
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
  });
}

/**
 * Fade in an element
 * @param {HTMLElement} element - Target element
 * @param {number} duration - Duration in milliseconds
 */
function fadeIn(element, duration = 400) {
  element.style.opacity = '0';
  element.style.display = 'block';
  element.style.transition = `opacity ${duration}ms ease`;
  
  // Force reflow
  void element.offsetWidth;
  
  element.style.opacity = '1';
}

/**
 * Fade out an element
 * @param {HTMLElement} element - Target element
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise}
 */
function fadeOut(element, duration = 400) {
  return new Promise((resolve) => {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';
    
    setTimeout(() => {
      element.style.display = 'none';
      resolve();
    }, duration);
  });
}

/**
 * Slide element in from direction
 * @param {HTMLElement} element - Target element
 * @param {string} direction - 'left', 'right', 'top', 'bottom'
 * @param {number} duration - Duration in milliseconds
 */
function slideIn(element, direction = 'left', duration = 600) {
  const animations = {
    left: 'slideInLeft',
    right: 'slideInRight',
    top: 'slideInDown',
    bottom: 'slideInUp'
  };
  
  const animationName = animations[direction] || animations.left;
  element.style.animation = `${animationName} ${duration}ms ease forwards`;
}

/* ============================================================
   ARRAY & DATA UTILITIES
   ============================================================ */

/**
 * Shuffle array randomly (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array}
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 * @param {Array} array - Source array
 * @returns {*}
 */
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ============================================================
   DEBOUNCE & THROTTLE
   ============================================================ */

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ============================================================
   EVENT CONNECTION PLACEHOLDER
   ============================================================ */

/**
 * Placeholder function for connecting to real stream events
 * Replace this with actual StreamElements, Twitch EventSub, or other service connection
 * @param {Object} config - Configuration object with API keys, channels, etc.
 */
function connectEvents(config = {}) {
  console.log('connectEvents called with config:', config);
  console.log('PLACEHOLDER: Replace this function with actual event connection logic');
  console.log('Options:');
  console.log('- StreamElements WebSocket API');
  console.log('- Twitch EventSub WebSocket');
  console.log('- OBS WebSocket (for local testing)');
  console.log('- Custom webhook endpoint');
  
  // Example structure for real implementation:
  /*
  const ws = new WebSocket(config.websocketUrl);
  
  ws.onopen = () => {
    console.log('Connected to event stream');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'follow':
        // Trigger alert: createAlert({ type: 'follow', username: data.username });
        break;
      case 'subscribe':
        // Trigger alert: createAlert({ type: 'subscribe', username: data.username, months: data.months });
        break;
      case 'donation':
        // Trigger alert: createAlert({ type: 'donation', username: data.username, amount: data.amount });
        break;
      case 'cheer':
        // Trigger alert: createAlert({ type: 'cheer', username: data.username, bits: data.bits });
        break;
      case 'chat':
        // Add to chat: addChatLine({ username: data.username, message: data.message });
        break;
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('Disconnected from event stream');
    // Implement reconnection logic
  };
  */
}

/* ============================================================
   INITIALIZATION
   ============================================================ */

/**
 * Wait for DOM to be ready
 * @param {Function} callback - Function to execute when DOM is ready
 */
function onReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Log initialization message
 */
function logInit(componentName) {
  console.log(`%c[NASCAR 25 Stream Overlay] ${componentName} initialized`, 
    'color: #FDB813; font-weight: bold; font-size: 14px;');
}

/* ============================================================
   EXPORTS (for ES6 modules)
   ============================================================ */

// If using ES6 modules, uncomment below:
/*
export {
  createElement,
  escapeHtml,
  formatTimestamp,
  formatNumber,
  formatCurrency,
  animateElement,
  fadeIn,
  fadeOut,
  slideIn,
  shuffleArray,
  randomItem,
  randomInt,
  debounce,
  throttle,
  connectEvents,
  onReady,
  logInit
};
*/

// For inline script usage, functions are available globally
console.log('%c[NASCAR 25 Stream Overlay] shared.js loaded', 
  'color: #E10600; font-weight: bold; font-size: 12px;');
