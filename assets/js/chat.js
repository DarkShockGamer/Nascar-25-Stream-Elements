/*
 * chat.js
 * Chat box widget functionality
 * Handles message display, scrolling, and demo simulation
 */

/* ============================================================
   CONFIGURATION
   ============================================================ */

const CHAT_CONFIG = {
  // Maximum messages to keep in DOM (older messages get removed)
  MAX_MESSAGES: 50,
  
  // Auto-scroll behavior
  AUTO_SCROLL: true,
  
  // Demo mode interval (set to 0 to disable)
  DEMO_INTERVAL: 5000,
  
  // Badge colors
  badges: {
    broadcaster: { bg: 'var(--neon-color)', color: 'var(--bg-dark)' },
    moderator: { bg: 'var(--racing-blue)', color: 'var(--text-color)' },
    subscriber: { bg: 'var(--racing-yellow)', color: 'var(--bg-dark)' },
    vip: { bg: 'var(--racing-red)', color: 'var(--text-color)' }
  }
};

/* ============================================================
   STATE MANAGEMENT
   ============================================================ */

let chatMessages = [];
let chatContainer = null;
let demoInterval = null;
let isAutoScrollEnabled = CHAT_CONFIG.AUTO_SCROLL;

/* ============================================================
   CHAT MESSAGE MANAGEMENT
   ============================================================ */

/**
 * Add a chat message to the display
 * @param {Object} messageData - Message configuration
 * @param {string} messageData.username - Username of sender
 * @param {string} messageData.message - Message content
 * @param {string[]} messageData.badges - Array of badge types
 * @param {boolean} messageData.highlighted - Whether message is highlighted
 * @param {boolean} messageData.system - Whether this is a system message
 * @param {boolean} messageData.cheer - Whether this is a cheer message
 * @param {number} messageData.bits - Bits amount (if cheer)
 * @param {string} messageData.color - Username color (hex)
 */
function addChatLine(messageData) {
  const {
    username = 'Anonymous',
    message = '',
    badges = [],
    highlighted = false,
    system = false,
    cheer = false,
    bits = 0,
    color = null
  } = messageData;
  
  if (!chatContainer) {
    console.error('Chat container not found');
    return;
  }
  
  // Create message element
  const messageClasses = ['chat-message'];
  if (highlighted) messageClasses.push('highlighted');
  if (system) messageClasses.push('system');
  if (cheer) messageClasses.push('cheer');
  
  const messageElement = createElement('div', {
    classes: messageClasses
  });
  
  // Create message header
  const messageHeader = createElement('div', {
    classes: 'message-header'
  });
  
  // Create username section with badges
  const usernameSection = createElement('div', {
    classes: 'message-username-section'
  });
  
  // Add badges
  if (badges.length > 0) {
    const badgesContainer = createElement('div', {
      classes: 'message-badges'
    });
    
    badges.forEach(badgeType => {
      const badge = createElement('span', {
        classes: ['badge', badgeType],
        text: badgeType.toUpperCase()
      });
      badgesContainer.appendChild(badge);
    });
    
    usernameSection.appendChild(badgesContainer);
  }
  
  // Add username
  const usernameElement = createElement('span', {
    classes: 'message-username',
    text: username
  });
  
  // Apply custom color if provided
  if (color) {
    usernameElement.style.color = color;
  }
  
  usernameSection.appendChild(usernameElement);
  messageHeader.appendChild(usernameSection);
  
  // Add timestamp
  const timestamp = createElement('span', {
    classes: 'message-timestamp',
    text: formatTimestamp(new Date(), false)
  });
  messageHeader.appendChild(timestamp);
  
  // Create message content
  const contentElement = createElement('div', {
    classes: 'message-content'
  });
  
  // Process message (escape HTML and handle emotes)
  let processedMessage = escapeHtml(message);
  
  // Add bits amount if cheer
  if (cheer && bits > 0) {
    processedMessage = `Cheered ${formatNumber(bits)} bits: ${processedMessage}`;
  }
  
  contentElement.innerHTML = processedMessage;
  
  // Assemble message
  messageElement.appendChild(messageHeader);
  messageElement.appendChild(contentElement);
  
  // Add to container
  chatContainer.appendChild(messageElement);
  chatMessages.push(messageElement);
  
  // Limit message count
  if (chatMessages.length > CHAT_CONFIG.MAX_MESSAGES) {
    const oldMessage = chatMessages.shift();
    if (oldMessage.parentNode) {
      oldMessage.parentNode.removeChild(oldMessage);
    }
  }
  
  // Auto-scroll to bottom if enabled
  if (isAutoScrollEnabled) {
    scrollToBottom();
  }
}

/**
 * Add a system message (follow, sub, etc.)
 * @param {string} message - System message text
 */
function addSystemMessage(message) {
  addChatLine({
    username: 'System',
    message: message,
    badges: [],
    system: true
  });
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

/**
 * Clear all chat messages
 */
function clearChat() {
  if (chatContainer) {
    chatContainer.innerHTML = '';
  }
  chatMessages = [];
}

/**
 * Toggle auto-scroll
 * @param {boolean} enabled - Whether to enable auto-scroll
 */
function setAutoScroll(enabled) {
  isAutoScrollEnabled = enabled;
}

/* ============================================================
   DEMO MODE (For Testing)
   ============================================================ */

const DEMO_DATA = {
  usernames: [
    { name: 'SpeedRacer88', badges: ['subscriber'], color: '#FF6B6B' },
    { name: 'TurboDriver', badges: ['moderator'], color: '#4ECDC4' },
    { name: 'NitroBoost', badges: ['vip'], color: '#FFE66D' },
    { name: 'CheckeredFlag', badges: [], color: '#95E1D3' },
    { name: 'PitCrewPro', badges: ['subscriber'], color: '#FF8B94' },
    { name: 'FastLane99', badges: [], color: '#C7CEEA' },
    { name: 'RacingLegend', badges: ['subscriber', 'vip'], color: '#FECA57' },
    { name: 'TrackStar', badges: [], color: '#48DBFB' },
    { name: 'ThrottleMax', badges: ['moderator', 'subscriber'], color: '#FF9FF3' },
    { name: 'VictoryLap', badges: [], color: '#54A0FF' }
  ],
  messages: [
    'Great race!',
    'Nice overtake!',
    'What setup are you using?',
    'That was close!',
    'GG!',
    'Love this track',
    'You got this!',
    'Clean racing 👍',
    'Amazing driving!',
    'Hype!',
    'Let\'s go!',
    'Good pit strategy',
    'Watch out for turn 3',
    'Great stream!',
    'First time here, enjoying the content!',
    'What\'s the lap time?',
    'You\'re in P1!',
    'Don\'t give up!',
    'Incredible save!',
    'That was intense!'
  ],
  systemMessages: [
    '{user} just followed!',
    '{user} subscribed!',
    '{user} is gifting subs!',
    '{user} raided with 50 viewers!'
  ]
};

/**
 * Generate random demo chat message
 */
function generateDemoMessage() {
  const userObj = randomItem(DEMO_DATA.usernames);
  const message = randomItem(DEMO_DATA.messages);
  
  // Random chance for special message types
  const rand = Math.random();
  
  if (rand < 0.05) {
    // System message (5% chance)
    const systemMsg = randomItem(DEMO_DATA.systemMessages);
    const systemUser = randomItem(DEMO_DATA.usernames).name;
    addSystemMessage(systemMsg.replace('{user}', systemUser));
  } else if (rand < 0.1) {
    // Cheer message (5% chance)
    addChatLine({
      username: userObj.name,
      message: message,
      badges: userObj.badges,
      cheer: true,
      bits: randomInt(100, 5000),
      color: userObj.color
    });
  } else if (rand < 0.15) {
    // Highlighted message (5% chance)
    addChatLine({
      username: userObj.name,
      message: message,
      badges: userObj.badges,
      highlighted: true,
      color: userObj.color
    });
  } else {
    // Normal message (85% chance)
    addChatLine({
      username: userObj.name,
      message: message,
      badges: userObj.badges,
      color: userObj.color
    });
  }
}

/**
 * Start demo mode
 */
function startDemoMode() {
  if (CHAT_CONFIG.DEMO_INTERVAL > 0 && !demoInterval) {
    console.log('Starting chat demo mode...');
    
    // Add initial welcome message
    addSystemMessage('Welcome to the stream! Chat demo mode active.');
    
    // Generate initial messages
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        generateDemoMessage();
      }, i * 500);
    }
    
    // Set interval for ongoing messages
    demoInterval = setInterval(() => {
      generateDemoMessage();
    }, CHAT_CONFIG.DEMO_INTERVAL);
  }
}

/**
 * Stop demo mode
 */
function stopDemoMode() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
    console.log('Chat demo mode stopped');
  }
}

/* ============================================================
   CHAT STATUS INDICATOR
   ============================================================ */

/**
 * Update chat connection status
 * @param {boolean} connected - Whether chat is connected
 */
function setChatStatus(connected) {
  const statusElement = document.querySelector('.chat-status');
  if (statusElement) {
    if (connected) {
      statusElement.classList.add('connected');
    } else {
      statusElement.classList.remove('connected');
    }
  }
}

/* ============================================================
   INITIALIZATION
   ============================================================ */

/**
 * Initialize chat system
 */
function initChat() {
  // Find chat messages container
  chatContainer = document.querySelector('.chat-messages');
  
  if (!chatContainer) {
    console.error('Chat messages container not found');
    return;
  }
  
  // Set initial status
  setChatStatus(false);
  
  logInit('Chat System');
  
  // Start demo mode if configured
  if (CHAT_CONFIG.DEMO_INTERVAL > 0) {
    // Delay demo start slightly to allow page to fully load
    setTimeout(startDemoMode, 1000);
  }
  
  // Make functions available globally
  window.addChatLine = addChatLine;
  window.addSystemMessage = addSystemMessage;
  window.clearChat = clearChat;
  window.setAutoScroll = setAutoScroll;
  window.setChatStatus = setChatStatus;
  window.startChatDemo = startDemoMode;
  window.stopChatDemo = stopDemoMode;
}

// Auto-initialize when DOM is ready
onReady(initChat);

/* ============================================================
   EXPORTS (for ES6 modules)
   ============================================================ */

// If using ES6 modules, uncomment below:
/*
export {
  addChatLine,
  addSystemMessage,
  clearChat,
  setAutoScroll,
  setChatStatus,
  startDemoMode,
  stopDemoMode,
  initChat
};
*/

console.log('%c[NASCAR 25 Stream Overlay] chat.js loaded', 
  'color: #FDB813; font-weight: bold; font-size: 12px;');
