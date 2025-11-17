/*
 * alerts.js
 * Alert system for follows, subscriptions, donations, and cheers
 * NASCAR 25 themed with animated in/out transitions
 */

/* ============================================================
   CONFIGURATION
   ============================================================ */

const ALERT_CONFIG = {
  // How long each alert stays on screen (milliseconds)
  ALERT_LIFETIME: 8000,
  
  // Maximum number of alerts to show at once
  MAX_ALERTS: 3,
  
  // Demo mode interval (set to 0 to disable)
  DEMO_INTERVAL: 12000,
  
  // Alert type configurations
  types: {
    follow: {
      icon: '👤',
      header: 'New Follower',
      color: 'var(--racing-blue)',
      sound: null // Add sound file path if available
    },
    subscribe: {
      icon: '⭐',
      header: 'New Subscriber',
      color: 'var(--racing-yellow)',
      sound: null
    },
    donation: {
      icon: '💵',
      header: 'Donation',
      color: 'var(--racing-red)',
      sound: null
    },
    cheer: {
      icon: '💎',
      header: 'Bits Cheered',
      color: 'var(--neon-color)',
      sound: null
    }
  }
};

/* ============================================================
   STATE MANAGEMENT
   ============================================================ */

let alertQueue = [];
let activeAlerts = [];
let alertContainer = null;
let demoInterval = null;

/* ============================================================
   ALERT CREATION & MANAGEMENT
   ============================================================ */

/**
 * Create and display an alert
 * @param {Object} alertData - Alert configuration
 * @param {string} alertData.type - Alert type: 'follow', 'subscribe', 'donation', 'cheer'
 * @param {string} alertData.username - Username of the user
 * @param {string} alertData.message - Optional custom message
 * @param {number} alertData.amount - Amount (for donations)
 * @param {number} alertData.bits - Bits amount (for cheers)
 * @param {number} alertData.months - Subscription months
 * @param {boolean} alertData.mega - Whether this is a "mega" alert (high value)
 */
function createAlert(alertData) {
  const {
    type = 'follow',
    username = 'Anonymous',
    message = '',
    amount = 0,
    bits = 0,
    months = 1,
    mega = false
  } = alertData;
  
  // Validate type
  if (!ALERT_CONFIG.types[type]) {
    console.error(`Invalid alert type: ${type}`);
    return;
  }
  
  const config = ALERT_CONFIG.types[type];
  
  // Create alert element
  const alert = createElement('div', {
    classes: ['alert', mega ? 'mega' : ''].filter(Boolean),
    attrs: { 'data-type': type }
  });
  
  // Create accent stripe
  const accentStripe = createElement('div', {
    classes: 'alert-accent-stripe'
  });
  
  // Create alert content wrapper
  const content = createElement('div', {
    classes: 'alert-content'
  });
  
  // Create icon
  const icon = createElement('div', {
    classes: 'alert-icon',
    text: config.icon
  });
  
  // Create header
  const header = createElement('div', {
    classes: 'alert-header',
    text: config.header
  });
  
  // Create main message (username)
  const mainMessage = createElement('div', {
    classes: 'alert-message',
    text: username
  });
  
  // Build content
  content.appendChild(icon);
  content.appendChild(header);
  content.appendChild(mainMessage);
  
  // Add type-specific content
  if (type === 'subscribe' && months > 1) {
    const subMessage = createElement('div', {
      classes: 'alert-sub-message',
      text: `${months} month${months > 1 ? 's' : ''}!`
    });
    content.appendChild(subMessage);
  }
  
  if (type === 'donation' && amount > 0) {
    const amountDisplay = createElement('div', {
      classes: 'alert-amount',
      text: formatCurrency(amount)
    });
    content.appendChild(amountDisplay);
  }
  
  if (type === 'cheer' && bits > 0) {
    const bitsDisplay = createElement('div', {
      classes: 'alert-amount',
      text: `${formatNumber(bits)} bits`
    });
    content.appendChild(bitsDisplay);
  }
  
  if (message) {
    const customMessage = createElement('div', {
      classes: 'alert-sub-message',
      text: escapeHtml(message)
    });
    content.appendChild(customMessage);
  }
  
  // Assemble alert
  alert.appendChild(accentStripe);
  alert.appendChild(content);
  
  // Add alert to queue or display immediately
  if (activeAlerts.length < ALERT_CONFIG.MAX_ALERTS) {
    displayAlert(alert);
  } else {
    alertQueue.push(alert);
  }
  
  // Play sound if configured
  if (config.sound) {
    playAlertSound(config.sound);
  }
}

/**
 * Display an alert on screen
 * @param {HTMLElement} alert - Alert element
 */
function displayAlert(alert) {
  if (!alertContainer) {
    console.error('Alert container not found');
    return;
  }
  
  // Add to active alerts
  activeAlerts.push(alert);
  
  // Append to container
  alertContainer.appendChild(alert);
  
  // Schedule removal
  setTimeout(() => {
    removeAlert(alert);
  }, ALERT_CONFIG.ALERT_LIFETIME);
}

/**
 * Remove an alert from display
 * @param {HTMLElement} alert - Alert element to remove
 */
function removeAlert(alert) {
  // Add exit animation
  alert.classList.add('exiting');
  
  // Wait for animation to complete
  setTimeout(() => {
    // Remove from DOM
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
    
    // Remove from active alerts
    activeAlerts = activeAlerts.filter(a => a !== alert);
    
    // Show next alert in queue
    if (alertQueue.length > 0) {
      const nextAlert = alertQueue.shift();
      displayAlert(nextAlert);
    }
  }, 600); // Match animation duration
}

/**
 * Clear all alerts
 */
function clearAlerts() {
  activeAlerts.forEach(alert => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  });
  activeAlerts = [];
  alertQueue = [];
}

/**
 * Play alert sound
 * @param {string} soundPath - Path to sound file
 */
function playAlertSound(soundPath) {
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.5; // Adjust as needed
    audio.play().catch(err => {
      console.error('Error playing alert sound:', err);
    });
  } catch (err) {
    console.error('Error creating audio:', err);
  }
}

/* ============================================================
   DEMO MODE (For Testing)
   ============================================================ */

const DEMO_DATA = {
  usernames: [
    'SpeedRacer88', 'TurboDriver', 'NitroBoost', 'CheckeredFlag',
    'PitCrewPro', 'FastLane99', 'RacingLegend', 'TrackStar',
    'ThrottleMax', 'VictoryLap', 'PolesPosition', 'DraftMaster'
  ],
  messages: [
    'Great stream!',
    'Love the content!',
    'Keep it up!',
    'Amazing race!',
    'You got this!',
    'GG WP',
    'Hype!',
    'Let\'s go!'
  ]
};

/**
 * Generate random demo alert
 */
function generateDemoAlert() {
  const types = ['follow', 'subscribe', 'donation', 'cheer'];
  const type = randomItem(types);
  const username = randomItem(DEMO_DATA.usernames);
  const message = Math.random() > 0.7 ? randomItem(DEMO_DATA.messages) : '';
  
  const alertData = {
    type,
    username,
    message
  };
  
  // Add type-specific data
  if (type === 'subscribe') {
    alertData.months = randomInt(1, 24);
  } else if (type === 'donation') {
    alertData.amount = randomInt(1, 100);
    alertData.mega = alertData.amount >= 50;
  } else if (type === 'cheer') {
    alertData.bits = randomInt(100, 10000);
    alertData.mega = alertData.bits >= 5000;
  }
  
  createAlert(alertData);
}

/**
 * Start demo mode
 */
function startDemoMode() {
  if (ALERT_CONFIG.DEMO_INTERVAL > 0 && !demoInterval) {
    console.log('Starting alert demo mode...');
    
    // Create initial alert
    generateDemoAlert();
    
    // Set interval for more alerts
    demoInterval = setInterval(() => {
      generateDemoAlert();
    }, ALERT_CONFIG.DEMO_INTERVAL);
  }
}

/**
 * Stop demo mode
 */
function stopDemoMode() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
    console.log('Alert demo mode stopped');
  }
}

/* ============================================================
   INITIALIZATION
   ============================================================ */

/**
 * Initialize alerts system
 */
function initAlerts() {
  // Find or create alert container
  alertContainer = document.getElementById('alerts-container');
  
  if (!alertContainer) {
    console.error('Alert container not found. Creating one...');
    alertContainer = createElement('div', {
      attrs: { id: 'alerts-container' }
    });
    document.body.appendChild(alertContainer);
  }
  
  logInit('Alerts System');
  
  // Start demo mode if configured
  if (ALERT_CONFIG.DEMO_INTERVAL > 0) {
    // Delay demo start slightly to allow page to fully load
    setTimeout(startDemoMode, 2000);
  }
  
  // Make createAlert available globally
  window.createAlert = createAlert;
  window.clearAlerts = clearAlerts;
  window.startDemoMode = startDemoMode;
  window.stopDemoMode = stopDemoMode;
}

// Auto-initialize when DOM is ready
onReady(initAlerts);

/* ============================================================
   EXPORTS (for ES6 modules)
   ============================================================ */

// If using ES6 modules, uncomment below:
/*
export {
  createAlert,
  clearAlerts,
  startDemoMode,
  stopDemoMode,
  initAlerts
};
*/

console.log('%c[NASCAR 25 Stream Overlay] alerts.js loaded', 
  'color: #0033A0; font-weight: bold; font-size: 12px;');
