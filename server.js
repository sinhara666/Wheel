const express = require('express');
const app = express();
app.use(express.json());

// Allow your frontend site on GitHub Pages to safely talk to your backend machine
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// The line list array that handles multiple users checking out at once
let spinQueue = [];

// Track whatever is currently actively running on your stream view
let activeLiveGameSession = {
  currentAuthorizedUser: "No Active Spin",
  unlockedTier: "w1", 
  canSpin: false,
  queueCount: 0
};

// 1. ENDPOINT THAT RECEIVES REAL-TIME WEBHOOK PAYMENTS FROM WHOP
app.post('/api/whop-webhook', (req, res) => {
  const incomingEvent = req.body;
  
  if (incomingEvent.action === 'payment.succeeded') {
    const paymentData = incomingEvent.data;
    const userEmail = paymentData.email;
    const purchasedPlanId = paymentData.plan_id;

    console.log(`📥 Incoming Payment: ${userEmail} for Plan: ${purchasedPlanId}`);

    // Map your Whop Plan IDs to your internal wheel tier tags
    let assignedTier = "w1";
    if (purchasedPlanId === 'plan_XYZ789_tier2') assignedTier = "w2";
    if (purchasedPlanId === 'plan_GOLD999_tier3') assignedTier = "w3";

    // Safely line the player up in the array queue
    spinQueue.push({
      email: userEmail,
      tier: assignedTier
    });

    // If the machine is empty and idling, push the new player to the stage immediately
    if (!activeLiveGameSession.canSpin) {
      advanceToNextPlayerInQueue();
    }

    return res.status(200).json({ status: "queued", position: spinQueue.length });
  }

  res.status(200).send("Event acknowledged");
});

// 2. INTERNAL AUTOMATION CONTROLLER
function advanceToNextPlayerInQueue() {
  if (spinQueue.length > 0) {
    const nextContestant = spinQueue.shift(); // First In, First Out logic
    
    activeLiveGameSession.currentAuthorizedUser = nextContestant.email;
    activeLiveGameSession.unlockedTier = nextContestant.tier;
    activeLiveGameSession.canSpin = true;
    activeLiveGameSession.queueCount = spinQueue.length;
    
    console.log(`🎯 Next up on stage: ${nextContestant.email} playing Tier: ${nextContestant.tier}`);
  } else {
    // Zero out access states if the line clears out
    activeLiveGameSession.currentAuthorizedUser = "No Active Spin";
    activeLiveGameSession.canSpin = false;
    activeLiveGameSession.queueCount = 0;
    console.log("💤 The line is empty. Awaiting new Whop checkouts...");
  }
}

// 3. ENPOINT FOR THE FRONTEND WHEEL TO MONITOR GAME APP STATES EVERY SECOND
app.get('/api/current-game-state', (req, res) => {
  res.json(activeLiveGameSession);
});

// 4. FRONTEND ACTION TERMINAL: CALLED INSTANTLY WHEN THE STREAM PUSHES SPIN
app.post('/api/consume-spin', (req, res) => {
  activeLiveGameSession.canSpin = false;
  
  // Wait exactly 12 seconds for the transition animations and box clicks to wrap up
  // Then slide the next paid customer up automatically!
  setTimeout(() => {
    advanceToNextPlayerInQueue();
  }, 12000); 

  res.json({ status: "processing_spin" });
});

app.listen(3000, () => console.log('Lucky AI Spin Server running smoothly on port 3000!'));

