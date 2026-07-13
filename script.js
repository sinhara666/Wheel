const express = require('express');
const app = express();
app.use(express.json());

// 1. THE AUTOMATED DIGITAL LINE (QUEUE ARRAY)
let spinQueue = [];

// Track whatever is currently taking place live on stream
let activeLiveGameSession = {
  currentAuthorizedUser: "No Active Spin",
  unlockedTier: "w1", 
  canSpin: false,
  queueCount: 0
};

// 2. INBOUND WHOP PAYMENTS WEBHOOK RECEIVER
app.post('/api/whop-webhook', (req, res) => {
  const incomingEvent = req.body;
  
  if (incomingEvent.action === 'payment.succeeded') {
    const paymentData = incomingEvent.data;
    const userEmail = paymentData.email;
    const purchasedPlanId = paymentData.plan_id;

    console.log(`📥 Webhook Received: Payment from ${userEmail}. Pushing them into the line array.`);

    // Match the Plan ID to your specific tier layout settings
    let assignedTier = "w1";
    if (purchasedPlanId === 'plan_XYZ789_tier2') assignedTier = "w2";
    if (purchasedPlanId === 'plan_GOLD999_tier3') assignedTier = "w3";

    // PUSH THE PLAYER INTO THE LINE ARRAY
    spinQueue.push({
      email: userEmail,
      tier: assignedTier
    });

    // Check if the machine is idling, if so, process this player instantly
    if (!activeLiveGameSession.canSpin) {
      advanceToNextPlayerInQueue();
    }

    return res.status(200).json({ status: "queued", position: spinQueue.length });
  }

  res.status(200).send("Event acknowledged");
});

// 3. INTERNAL MACHINE SWITCHER ENGINE
function advanceToNextPlayerInQueue() {
  if (spinQueue.length > 0) {
    // Take the very first person out of the line (First In, First Out logic)
    const nextContestant = spinQueue.shift(); 
    
    activeLiveGameSession.currentAuthorizedUser = nextContestant.email;
    activeLiveGameSession.unlockedTier = nextContestant.tier;
    activeLiveGameSession.canSpin = true;
    activeLiveGameSession.queueCount = spinQueue.length;
    
    console.log(`🎯 Next up: ${nextContestant.email} on wheel tier: ${nextContestant.tier}`);
  } else {
    // If the line is empty, lock the controls down and wait for a payment
    activeLiveGameSession.currentAuthorizedUser = "No Active Spin";
    activeLiveGameSession.canSpin = false;
    activeLiveGameSession.queueCount = 0;
    console.log("💤 Game show line is currently empty. Awaiting new payments...");
  }
}

// 4. FRONTEND SYNC ENDPOINT (POLLING ROUTE)
app.get('/api/current-game-state', (req, res) => {
  res.json(activeLiveGameSession);
});

// 5. CONSUME SIGNAL: TRIGGERED FROM FRONTEND SCRIPT RIGHT WHEN SPIN STARTS
app.post('/api/consume-spin', (req, res) => {
  // Lock the button down immediately so nobody can spam it
  activeLiveGameSession.canSpin = false;
  
  // Wait 12 seconds for the spin animation to complete and the player to click open boxes
  // Then automatically shift to the next player waiting in the line!
  setTimeout(() => {
    advanceToNextPlayerInQueue();
  }, 12000); 

  res.json({ status: "processing_spin" });
});

app.listen(3000, () => console.log('Lucky AI Spin Automated Queue Engine online on port 3000!'));

