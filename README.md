# NASCAR 25 Stream Overlay Asset Pack

A complete, production-ready stream overlay asset pack designed for NASCAR 25 streaming with ultrawide (21:9) resolution support. Features NASCAR-themed design motifs including racing stripes, carbon fiber textures, neon accents, and bold high-contrast panels.

## 🏁 Features

- **Main Overlay Frame**: Top & bottom HUD bars with stats, branding, and game info
- **Camera Frame Widget**: Driver camera with animated borders and status indicators
- **Alerts Widget**: Animated popups for follows, subs, donations, and cheers
- **Chat Box Widget**: Styled chat display with badges, scrollbar, and auto-scroll
- **Scrolling Ticker Bar**: Infinite scrolling event marquee
- **Responsive Design**: Fluid layouts for 2560x1080 and 3440x1440 resolutions
- **Theme Customization**: Easy color token system for brand matching
- **Pure HTML/CSS/JS**: No external frameworks or dependencies
- **Demo Mode**: Built-in simulation for testing without live data

## 📁 Repository Structure

```
├── assets/
│   ├── css/
│   │   ├── shared.css      # Global styles, variables, animations
│   │   ├── overlay.css     # Main overlay layout (top/bottom bars)
│   │   ├── camera.css      # Camera frame styling
│   │   ├── alerts.css      # Alert popup animations
│   │   ├── chat.css        # Chat box styling
│   │   └── ticker.css      # Ticker scroll styling
│   └── js/
│       ├── shared.js       # Utility functions and helpers
│       ├── alerts.js       # Alert system logic
│       ├── chat.js         # Chat management
│       └── ticker.js       # Ticker scroll logic
├── overlays/
│   ├── main-overlay.html   # Main stream overlay
│   └── camera-frame.html   # Driver camera frame
├── widgets/
│   ├── alerts.html         # Alerts widget
│   ├── chat-box.html       # Chat box widget
│   └── ticker.html         # Ticker bar widget
└── README.md               # This file
```

## 🎨 Theme Customization

All visual theming is centralized in `assets/css/shared.css` using CSS variables. Replace the placeholder tokens with your channel brand colors:

```css
:root {
  --primary-color: YOUR_PRIMARY_COLOR;      /* e.g., #E10600 (NASCAR Red) */
  --secondary-color: YOUR_SECONDARY_COLOR;  /* e.g., #0033A0 (Blue) */
  --accent-color: YOUR_ACCENT_COLOR;        /* e.g., #FDB813 (Yellow) */
  --neon-color: YOUR_NEON_COLOR;            /* e.g., #00FFFF (Cyan) */
  --text-color: YOUR_TEXT_COLOR;            /* e.g., #FFFFFF (White) */
  --bg-dark: YOUR_BG_DARK;                  /* e.g., #1a1a1a (Dark Gray) */
}
```

### Example Color Schemes

**Classic NASCAR**:
```css
--primary-color: #E10600;
--secondary-color: #0033A0;
--accent-color: #FDB813;
--neon-color: #00FFFF;
--text-color: #FFFFFF;
--bg-dark: #1a1a1a;
```

**Neon Night**:
```css
--primary-color: #FF006E;
--secondary-color: #8338EC;
--accent-color: #3A86FF;
--neon-color: #00F5FF;
--text-color: #FFFFFF;
--bg-dark: #0D0D0D;
```

## 🚀 Quick Start

### Option 1: Individual Browser Sources (Recommended for flexibility)

1. **Open OBS Studio** and add Browser Sources for each component:

2. **Main Overlay** (`overlays/main-overlay.html`):
   - Width: 3440 (or 2560 for lower res)
   - Height: 1440 (or 1080 for lower res)
   - Set as topmost overlay layer
   - Disable "Shutdown source when not visible" for smooth transitions

3. **Alerts Widget** (`widgets/alerts.html`):
   - Width: 3440, Height: 1440
   - Position: Center of screen
   - Layer above game capture

4. **Chat Box** (`widgets/chat-box.html`):
   - Width: 480, Height: 600 (adjustable)
   - Position: Left or right side
   - Layer above game capture

5. **Camera Frame** (`overlays/camera-frame.html`):
   - Width: 480, Height: 270 (adjustable)
   - Position: Bottom right corner
   - Add webcam as separate source behind this frame

6. **Ticker Bar** (`widgets/ticker.html`):
   - Width: 3440, Height: 60
   - Position: Bottom or top edge
   - Layer above main overlay

### Option 2: Local File Access

If OBS has permission to access local files:

```
file:///path/to/Nascar-25-Stream-Elements/overlays/main-overlay.html
```

Replace `/path/to/` with your actual directory path.

### Option 3: HTTP Server (for advanced users)

Serve files via a local HTTP server:

```bash
# Using Python 3
cd /path/to/Nascar-25-Stream-Elements
python3 -m http.server 8080

# Or using Node.js (npx http-server)
npx http-server -p 8080
```

Then use in OBS:
```
http://localhost:8080/overlays/main-overlay.html
```

## 🔧 Customization Guide

### Updating Text Content

Edit the HTML files to change static text:

**Main Overlay** (`overlays/main-overlay.html`):
- Line 24: Change "NASCAR 25" logo text
- Line 27: Update "Now Streaming" title
- Line 56: Change broadcaster name
- Line 80-94: Update social media handles

**Camera Frame** (`overlays/camera-frame.html`):
- Line 30: Change driver name
- Line 35: Update camera label

### Adjusting Layout & Sizing

Modify CSS variables in `assets/css/shared.css`:

```css
:root {
  --bar-height: clamp(60px, 5vh, 100px);  /* Top/bottom bar height */
  --padding-md: clamp(12px, 1.5vw, 24px); /* Standard padding */
  --border-radius: 4px;                    /* Corner roundness */
  --border-width: 2px;                     /* Border thickness */
}
```

### Disabling Demo Mode

Demo mode generates fake events for testing. To disable:

**Alerts** (`assets/js/alerts.js`, line 14):
```javascript
DEMO_INTERVAL: 0,  // Set to 0 to disable
```

**Chat** (`assets/js/chat.js`, line 12):
```javascript
DEMO_INTERVAL: 0,  // Set to 0 to disable
```

**Ticker** (`assets/js/ticker.js`, line 14):
```javascript
DEMO_INTERVAL: 0,  // Set to 0 to disable
```

Or call stop functions from browser console:
```javascript
stopDemoMode();      // Alerts
stopChatDemo();      // Chat
stopTickerDemo();    // Ticker
```

## 🔌 Integration with Live Data

### StreamElements Integration

Replace placeholder event connection in `assets/js/shared.js`:

```javascript
function connectEvents(config) {
  const ws = new WebSocket('wss://realtime.streamelements.com/socket.io/?token=YOUR_JWT_TOKEN');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'follower':
        createAlert({ type: 'follow', username: data.data.displayName });
        addTickerItem({ type: 'follow', username: data.data.displayName, action: 'followed' });
        break;
        
      case 'subscriber':
        createAlert({ 
          type: 'subscribe', 
          username: data.data.displayName,
          months: data.data.months || 1
        });
        break;
        
      case 'tip':
        createAlert({ 
          type: 'donation', 
          username: data.data.username,
          amount: data.data.amount,
          message: data.data.message
        });
        break;
    }
  };
}

// Call with your configuration
connectEvents({ token: 'YOUR_JWT_TOKEN' });
```

### Twitch EventSub Integration

For Twitch EventSub WebSocket (recommended for new integrations):

```javascript
const ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.metadata.message_type === 'notification') {
    const eventType = message.metadata.subscription_type;
    const eventData = message.payload.event;
    
    if (eventType === 'channel.follow') {
      createAlert({ type: 'follow', username: eventData.user_name });
    }
    
    if (eventType === 'channel.subscribe') {
      createAlert({ type: 'subscribe', username: eventData.user_name });
    }
  }
};
```

### Twitch IRC Chat Integration

For chat messages, use TMI.js library:

```html
<!-- Add to chat-box.html -->
<script src="https://cdn.jsdelivr.net/npm/tmi.js@1.8.5/dist/tmi.min.js"></script>
<script>
const client = new tmi.Client({
  channels: ['your_channel_name']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  const badges = [];
  if (tags.badges) {
    if (tags.badges.broadcaster) badges.push('broadcaster');
    if (tags.badges.moderator) badges.push('moderator');
    if (tags.badges.subscriber) badges.push('subscriber');
    if (tags.badges.vip) badges.push('vip');
  }
  
  addChatLine({
    username: tags['display-name'],
    message: message,
    badges: badges,
    color: tags.color
  });
});

client.on('connected', () => setChatStatus(true));
</script>
```

## 🎮 OBS Setup Tips

### Layer Order (Bottom to Top)

1. **Background/Wallpaper** (if any)
2. **Game Capture** (NASCAR 25 gameplay)
3. **Webcam** (if using camera-frame.html overlay)
4. **Camera Frame** (`camera-frame.html`)
5. **Chat Box** (`chat-box.html`)
6. **Main Overlay** (`main-overlay.html`)
7. **Alerts** (`alerts.html`)
8. **Ticker** (`ticker.html`)

### Browser Source Settings

- ✅ Enable "Refresh browser when scene becomes active" (for reliability)
- ✅ Enable "Shutdown source when not visible" (for performance, except main overlay)
- ❌ Disable "Control audio via OBS" (unless you want alert sounds)
- Set FPS to 30 (60 for smooth animations, but uses more CPU)

### Performance Optimization

- Use CSS animations (GPU-accelerated) instead of JS animations
- Limit MAX_MESSAGES in chat to 50 or less
- Disable demo modes when going live
- Use OBS Studio version 28+ for better browser source performance
- Consider rendering at canvas resolution (native stream resolution)

## 📱 Responsive Behavior

The overlay automatically scales for different ultrawide resolutions:

- **2560x1080**: Optimized text sizes and compact spacing
- **3440x1440**: Default target resolution with full detail
- **Other 21:9 ratios**: Fluid scaling using `clamp()` and viewport units

To test responsiveness:
1. Open HTML file in browser
2. Resize window to different widths
3. Use browser DevTools responsive mode

## 🎨 NASCAR Design Elements

### Visual Motifs

- **Racing Stripes**: Animated edge decorations and accent bars
- **Carbon Fiber**: Background texture pattern
- **Neon Glow**: Pulsing borders and text shadows
- **Angled Cuts**: Skewed elements with clip-path polygons
- **Metallic Gradient**: Subtle shimmer on panels
- **Bold Typography**: High-contrast, uppercase text

### Color Psychology

- **Red** (#E10600): Energy, speed, danger (alerts, donations)
- **Yellow** (#FDB813): Caution, attention (subscriptions, highlights)
- **Blue** (#0033A0): Trust, reliability (follows, moderators)
- **Neon Cyan**: Tech, modern, racing aesthetic

## 🔊 Adding Sound Effects

To add alert sounds:

1. Place audio files in `assets/sounds/` directory
2. Update `ALERT_CONFIG` in `assets/js/alerts.js`:

```javascript
types: {
  follow: {
    icon: '👤',
    header: 'New Follower',
    color: 'var(--racing-blue)',
    sound: '../assets/sounds/follow.mp3'
  },
  // ... other types
}
```

Recommended audio formats: MP3 or OGG (broadly supported)

## 🧪 Testing

### Manual Testing

1. Open each HTML file in browser (Chrome/Firefox recommended)
2. Open DevTools Console to see initialization messages
3. Demo mode will automatically generate events
4. Test at both 2560x1080 and 3440x1440 resolutions

### Console Commands

Use browser console to test functions:

```javascript
// Alerts
createAlert({ type: 'follow', username: 'TestUser' });
createAlert({ type: 'donation', username: 'BigDonor', amount: 100, mega: true });

// Chat
addChatLine({ username: 'TestUser', message: 'Hello world!', badges: ['moderator'] });
addSystemMessage('This is a system message');

// Ticker
addTickerItem({ type: 'subscribe', username: 'NewSub', action: 'subscribed', detail: '6 months' });

// Control demo modes
stopDemoMode();   // Stop alert demos
stopChatDemo();   // Stop chat demos
stopTickerDemo(); // Stop ticker demos
```

## 🚧 Known Limitations

- Alert sound playback may be blocked by browser autoplay policies (requires user interaction)
- Local file access may be restricted by CORS policies (use HTTP server if needed)
- CSS animations may stutter on low-end systems (reduce animation complexity)
- Maximum 3 alerts displayed simultaneously (configurable in `alerts.js`)

## 🔮 Future Enhancements

Potential additions (not included in this release):

- [ ] Unified overlay file (all widgets in single page with URL toggles)
- [ ] WebSocket configuration UI panel
- [ ] Multiple color theme presets with JSON loader
- [ ] Telemetry data integration (lap times, positions)
- [ ] Goal tracker widget (sub goals, follower goals)
- [ ] Recently followed/subbed lists
- [ ] Sound effect library with volume controls
- [ ] Animation speed/style customization panel

## 📄 License

This project is released as open source. Feel free to modify and use for your streams.

## 🤝 Contributing

Contributions welcome! Suggested areas:

- Additional widget types (goals, polls, etc.)
- More color theme presets
- Performance optimizations
- Accessibility improvements
- Documentation enhancements

## 💬 Support

For issues or questions:
- Check browser console for error messages
- Verify file paths are correct (relative paths)
- Test with demo mode before connecting live data
- Ensure OBS Browser Source settings are correct

## 🏆 Credits

Designed for NASCAR 25 streamers with ❤️ by the community.

Racing stripes, carbon fiber, and neon aesthetics inspired by NASCAR design language.

---

**Happy Streaming! 🏁**