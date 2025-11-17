/*
 * ticker.js
 * Scrolling ticker bar for latest events
 * Implements infinite scroll with duplicated content
 */

/* ============================================================
   CONFIGURATION
   ============================================================ */

const TICKER_CONFIG = {
  // Maximum ticker items to display
  MAX_ITEMS: 20,
  
  // Demo mode interval (set to 0 to disable)
  DEMO_INTERVAL: 8000,
  
  // Scroll speed (CSS animation duration in seconds)
  SCROLL_SPEED: 30,
  
  // Ticker item type icons
  icons: {
    follow: '👤',
    subscribe: '⭐',
    donation: '💵',
    cheer: '💎',
    raid: '🚀',
    host: '📺'
  }
};

/* ============================================================
   STATE MANAGEMENT
   ============================================================ */

let tickerItems = [];
let tickerTrack = null;
let demoInterval = null;

// Make items globally accessible for external updates
window.tickerItems = tickerItems;

/* ============================================================
   TICKER RENDERING
   ============================================================ */

/**
 * Create a ticker item element
 * @param {Object} itemData - Ticker item data
 * @param {string} itemData.type - Event type
 * @param {string} itemData.username - Username
 * @param {string} itemData.action - Action text
 * @param {string} itemData.detail - Additional detail (amount, months, etc.)
 * @returns {HTMLElement}
 */
function createTickerItem(itemData) {
  const {
    type = 'follow',
    username = 'Anonymous',
    action = 'followed',
    detail = ''
  } = itemData;
  
  const item = createElement('div', {
    classes: 'ticker-item',
    attrs: { 'data-type': type }
  });
  
  // Create icon
  const icon = createElement('div', {
    classes: 'ticker-icon',
    text: TICKER_CONFIG.icons[type] || '●'
  });
  
  // Create text content
  const textContent = createElement('div', {
    classes: 'ticker-text'
  });
  
  const usernameSpan = createElement('span', {
    classes: 'ticker-username',
    text: username
  });
  
  const actionSpan = createElement('span', {
    classes: 'ticker-action',
    text: action
  });
  
  textContent.appendChild(usernameSpan);
  textContent.appendChild(actionSpan);
  
  if (detail) {
    const detailSpan = createElement('span', {
      classes: 'ticker-detail',
      text: detail
    });
    textContent.appendChild(detailSpan);
  }
  
  // Assemble item
  item.appendChild(icon);
  item.appendChild(textContent);
  
  return item;
}

/**
 * Render ticker with all items (duplicated for infinite scroll)
 * @param {Array} items - Array of ticker item data objects
 */
function renderTicker(items = tickerItems) {
  if (!tickerTrack) {
    console.error('Ticker track not found');
    return;
  }
  
  // Clear existing content
  tickerTrack.innerHTML = '';
  
  // If no items, show empty message
  if (items.length === 0) {
    const emptyMessage = createElement('div', {
      classes: 'ticker-empty',
      text: 'No recent events'
    });
    tickerTrack.parentElement.appendChild(emptyMessage);
    return;
  }
  
  // Remove empty message if it exists
  const emptyMsg = tickerTrack.parentElement.querySelector('.ticker-empty');
  if (emptyMsg) {
    emptyMsg.remove();
  }
  
  // Create ticker items (original set)
  items.forEach(itemData => {
    const item = createTickerItem(itemData);
    tickerTrack.appendChild(item);
    
    // Add separator
    const separator = createElement('span', {
      classes: 'ticker-separator'
    });
    tickerTrack.appendChild(separator);
  });
  
  // Duplicate items for seamless infinite scroll
  // We need at least 2 complete sets for smooth looping
  items.forEach(itemData => {
    const item = createTickerItem(itemData);
    tickerTrack.appendChild(item);
    
    // Add separator
    const separator = createElement('span', {
      classes: 'ticker-separator'
    });
    tickerTrack.appendChild(separator);
  });
  
  // Set animation duration based on content width
  updateScrollSpeed();
}

/**
 * Add a new item to the ticker
 * @param {Object} itemData - Ticker item data
 */
function addTickerItem(itemData) {
  // Add to beginning of array
  tickerItems.unshift(itemData);
  
  // Limit number of items
  if (tickerItems.length > TICKER_CONFIG.MAX_ITEMS) {
    tickerItems = tickerItems.slice(0, TICKER_CONFIG.MAX_ITEMS);
  }
  
  // Update global reference
  window.tickerItems = tickerItems;
  
  // Re-render ticker
  renderTicker(tickerItems);
}

/**
 * Clear all ticker items
 */
function clearTicker() {
  tickerItems = [];
  window.tickerItems = tickerItems;
  renderTicker(tickerItems);
}

/**
 * Update scroll speed based on content
 */
function updateScrollSpeed() {
  if (tickerTrack) {
    // Adjust animation duration based on number of items
    const duration = Math.max(TICKER_CONFIG.SCROLL_SPEED, tickerItems.length * 2);
    tickerTrack.style.animationDuration = `${duration}s`;
  }
}

/* ============================================================
   DEMO MODE (For Testing)
   ============================================================ */

const DEMO_DATA = {
  events: [
    { type: 'follow', username: 'SpeedRacer88', action: 'followed', detail: '' },
    { type: 'subscribe', username: 'TurboDriver', action: 'subscribed', detail: '' },
    { type: 'subscribe', username: 'NitroBoost', action: 'subscribed for', detail: '6 months' },
    { type: 'donation', username: 'CheckeredFlag', action: 'donated', detail: '$25.00' },
    { type: 'cheer', username: 'PitCrewPro', action: 'cheered', detail: '500 bits' },
    { type: 'raid', username: 'FastLane99', action: 'raided with', detail: '100 viewers' },
    { type: 'follow', username: 'RacingLegend', action: 'followed', detail: '' },
    { type: 'subscribe', username: 'TrackStar', action: 'gifted', detail: '5 subs' },
    { type: 'donation', username: 'ThrottleMax', action: 'donated', detail: '$10.00' },
    { type: 'cheer', username: 'VictoryLap', action: 'cheered', detail: '1000 bits' }
  ],
  usernames: [
    'SpeedDemon', 'RoadRunner', 'FastFurious', 'NOS_Master',
    'DriftKing', 'ApexHunter', 'GridStartPro', 'Overtaker',
    'SlipstreamAce', 'PolePosition', 'PitStop', 'FuelStrategy'
  ]
};

/**
 * Generate random demo ticker event
 */
function generateDemoEvent() {
  const types = ['follow', 'subscribe', 'donation', 'cheer', 'raid'];
  const type = randomItem(types);
  const username = randomItem(DEMO_DATA.usernames);
  
  let action = '';
  let detail = '';
  
  switch (type) {
    case 'follow':
      action = 'followed';
      break;
    case 'subscribe':
      const months = randomInt(1, 24);
      if (months === 1) {
        action = 'subscribed';
      } else {
        action = 'subscribed for';
        detail = `${months} months`;
      }
      break;
    case 'donation':
      action = 'donated';
      detail = formatCurrency(randomInt(5, 100));
      break;
    case 'cheer':
      action = 'cheered';
      detail = `${formatNumber(randomInt(100, 5000))} bits`;
      break;
    case 'raid':
      action = 'raided with';
      detail = `${formatNumber(randomInt(10, 500))} viewers`;
      break;
  }
  
  addTickerItem({ type, username, action, detail });
}

/**
 * Start demo mode
 */
function startDemoMode() {
  if (TICKER_CONFIG.DEMO_INTERVAL > 0 && !demoInterval) {
    console.log('Starting ticker demo mode...');
    
    // Add initial events
    DEMO_DATA.events.forEach(event => {
      addTickerItem(event);
    });
    
    // Set interval for new events
    demoInterval = setInterval(() => {
      generateDemoEvent();
    }, TICKER_CONFIG.DEMO_INTERVAL);
  }
}

/**
 * Stop demo mode
 */
function stopDemoMode() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
    console.log('Ticker demo mode stopped');
  }
}

/* ============================================================
   SPEED CONTROL
   ============================================================ */

/**
 * Set ticker scroll speed
 * @param {string} speed - 'slow', 'normal', or 'fast'
 */
function setTickerSpeed(speed) {
  if (!tickerTrack) return;
  
  // Remove existing speed classes
  tickerTrack.classList.remove('slow', 'fast');
  
  if (speed === 'slow') {
    tickerTrack.classList.add('slow');
  } else if (speed === 'fast') {
    tickerTrack.classList.add('fast');
  }
}

/**
 * Pause ticker scroll
 */
function pauseTicker() {
  if (tickerTrack) {
    tickerTrack.style.animationPlayState = 'paused';
  }
}

/**
 * Resume ticker scroll
 */
function resumeTicker() {
  if (tickerTrack) {
    tickerTrack.style.animationPlayState = 'running';
  }
}

/* ============================================================
   INITIALIZATION
   ============================================================ */

/**
 * Initialize ticker system
 */
function initTicker() {
  // Find ticker track
  tickerTrack = document.querySelector('.ticker-track');
  
  if (!tickerTrack) {
    console.error('Ticker track not found');
    return;
  }
  
  logInit('Ticker System');
  
  // Start demo mode if configured
  if (TICKER_CONFIG.DEMO_INTERVAL > 0) {
    // Delay demo start slightly to allow page to fully load
    setTimeout(startDemoMode, 1500);
  }
  
  // Make functions available globally
  window.addTickerItem = addTickerItem;
  window.renderTicker = renderTicker;
  window.clearTicker = clearTicker;
  window.setTickerSpeed = setTickerSpeed;
  window.pauseTicker = pauseTicker;
  window.resumeTicker = resumeTicker;
  window.startTickerDemo = startDemoMode;
  window.stopTickerDemo = stopDemoMode;
}

// Auto-initialize when DOM is ready
onReady(initTicker);

/* ============================================================
   EXPORTS (for ES6 modules)
   ============================================================ */

// If using ES6 modules, uncomment below:
/*
export {
  addTickerItem,
  renderTicker,
  clearTicker,
  setTickerSpeed,
  pauseTicker,
  resumeTicker,
  startDemoMode,
  stopDemoMode,
  initTicker
};
*/

console.log('%c[NASCAR 25 Stream Overlay] ticker.js loaded', 
  'color: #E10600; font-weight: bold; font-size: 12px;');
