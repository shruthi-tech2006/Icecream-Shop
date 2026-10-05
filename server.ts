import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { INITIAL_FLAVORS, INITIAL_VESSELS, INITIAL_DRIZZLES, INITIAL_TOPPINGS } from './src/data/menuData.ts';
import { Order, OrderStatus, LoyaltyProfile } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database
let flavors = [...INITIAL_FLAVORS];
let vessels = [...INITIAL_VESSELS];
let drizzles = [...INITIAL_DRIZZLES];
let toppings = [...INITIAL_TOPPINGS];

let loyaltyProfiles: Record<string, LoyaltyProfile> = {
  '5552345678': {
    phone: '5552345678',
    name: 'Eleanor Vance',
    referralCode: 'VELUTO-ELEANOR-77',
    points: 340,
    tier: 'Sundae Connoisseur',
    lifetimeOrders: 8,
    friendsInvited: 3,
    bonusEarnedDollars: 15.00,
  },
  '5559876543': {
    phone: '5559876543',
    name: 'Julian Hayes',
    referralCode: 'VELUTO-JULIAN-42',
    points: 620,
    tier: 'Gelato Royale',
    lifetimeOrders: 15,
    friendsInvited: 6,
    bonusEarnedDollars: 30.00,
  }
};

let orders: Order[] = [
  {
    id: 'VC-8841',
    customerName: 'Sophia Chen',
    customerPhone: '5551234567',
    customerEmail: 'sophia.chen@example.com',
    orderType: 'delivery',
    deliveryAddress: '742 Evergreen Terrace, Apt 4B',
    items: [
      {
        id: 'item-demo-1',
        customName: 'The Sicilian Sunset',
        vessel: vessels[0],
        scoopCount: 3,
        flavors: [flavors[0], flavors[4], flavors[5]],
        drizzles: [drizzles[0]],
        toppings: [toppings[0], toppings[4]],
        unitPrice: 12.85,
        quantity: 1,
      }
    ],
    subtotal: 12.85,
    discount: 0,
    tax: 1.15,
    tip: 2.50,
    deliveryFee: 2.99,
    total: 19.49,
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    loyaltyPointsEarned: 130,
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    estimatedDeliveryMinutes: 9,
    riderName: 'Marco Bianchi',
    riderPhone: '+1 (555) 349-8812',
    riderLat: 37.7749,
    riderLng: -122.4194,
    freezerBagTempCelsius: -15.4,
    timeline: [
      {
        status: 'received',
        title: 'Order Confirmed',
        description: 'Payment authorized & queued for crafting.',
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'crafting',
        title: 'Artisanal Hand-Scooping',
        description: 'Chef artisan layered your custom scoops and warm drizzle.',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'chilling',
        title: 'Cryo-Lock Deep Freeze',
        description: 'Stabilized at -16°C in thermal vacuum canister.',
        timestamp: new Date(Date.now() - 6 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'out_for_delivery',
        title: 'Courier En Route',
        description: 'Courier Marco is in transit with cryo-insulated pack.',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'completed',
        title: 'Delivered',
        description: 'Handed over fresh & frosty.',
        timestamp: '',
        completed: false,
      }
    ]
  },
  {
    id: 'VC-8842',
    customerName: 'Marcus Sterling',
    customerPhone: '5552345678',
    customerEmail: 'marcus@example.com',
    orderType: 'pickup',
    pickupTable: 'Boutique Bar - Stool 03',
    items: [
      {
        id: 'item-demo-2',
        customName: 'Velvet Midnight Ganache',
        vessel: vessels[2], // Brioche Bun
        scoopCount: 2,
        flavors: [flavors[2], flavors[1]],
        drizzles: [drizzles[1]],
        toppings: [toppings[1]],
        unitPrice: 11.25,
        quantity: 1,
      }
    ],
    subtotal: 11.25,
    discount: 1.50,
    tax: 0.98,
    tip: 2.00,
    deliveryFee: 0,
    total: 12.73,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    loyaltyPointsEarned: 110,
    status: 'crafting',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    estimatedDeliveryMinutes: 4,
    timeline: [
      {
        status: 'received',
        title: 'Order Confirmed',
        description: 'Order placed at counter register.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'crafting',
        title: 'Artisanal Hand-Scooping',
        description: 'Toasting warm brioche and layering gelato.',
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'completed',
        title: 'Ready for Counter Pickup',
        description: 'Your creation is waiting at the pick-up arch.',
        timestamp: '',
        completed: false,
      }
    ]
  }
];

// API Routes
app.get('/api/menu', (req, res) => {
  res.json({
    flavors,
    vessels,
    drizzles,
    toppings,
  });
});

app.get('/api/inventory', (req, res) => {
  const lowStockFlavors = flavors.filter(f => f.scoopsRemaining <= 25);
  res.json({
    flavors,
    vessels,
    drizzles,
    toppings,
    lowStockFlavors,
    totalTubsActive: flavors.filter(f => f.inStock).length,
  });
});

app.patch('/api/inventory/flavor/:id', (req, res) => {
  const { id } = req.params;
  const { scoopsRemaining, inStock } = req.body;
  const flavor = flavors.find(f => f.id === id);
  if (!flavor) {
    return res.status(404).json({ error: 'Flavor not found' });
  }
  if (typeof scoopsRemaining === 'number') {
    flavor.scoopsRemaining = Math.max(0, scoopsRemaining);
    if (flavor.scoopsRemaining === 0) flavor.inStock = false;
  }
  if (typeof inStock === 'boolean') {
    flavor.inStock = inStock;
  }
  res.json(flavor);
});

app.patch('/api/inventory/restock-tub/:id', (req, res) => {
  const { id } = req.params;
  const flavor = flavors.find(f => f.id === id);
  if (!flavor) {
    return res.status(404).json({ error: 'Flavor not found' });
  }
  flavor.scoopsRemaining += 45;
  flavor.inStock = true;
  res.json(flavor);
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const body = req.body;
  const orderId = `VC-${Math.floor(1000 + Math.random() * 9000)}`;

  // Deduct inventory for flavors used
  if (Array.isArray(body.items)) {
    for (const item of body.items) {
      if (Array.isArray(item.flavors)) {
        for (const fl of item.flavors) {
          const match = flavors.find(f => f.id === fl.id);
          if (match && match.scoopsRemaining > 0) {
            match.scoopsRemaining -= (item.quantity || 1);
            if (match.scoopsRemaining <= 0) {
              match.scoopsRemaining = 0;
              match.inStock = false;
            }
          }
        }
      }
    }
  }

  // Update or credit loyalty profile
  const cleanPhone = (body.customerPhone || '').replace(/\D/g, '');
  const pointsEarned = Math.floor((body.total || 10) * 10);
  
  if (cleanPhone) {
    if (!loyaltyProfiles[cleanPhone]) {
      const nameParts = (body.customerName || 'Gelato Lover').split(' ');
      loyaltyProfiles[cleanPhone] = {
        phone: cleanPhone,
        name: body.customerName || 'Loyal Patron',
        referralCode: `VELUTO-${nameParts[0].toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`,
        points: 50 + pointsEarned, // 50 welcome bonus
        tier: 'Sprinkle Scout',
        lifetimeOrders: 1,
        friendsInvited: 0,
        bonusEarnedDollars: 0,
      };
    } else {
      const prof = loyaltyProfiles[cleanPhone];
      prof.points += pointsEarned;
      prof.lifetimeOrders += 1;
      if (prof.points > 500) prof.tier = 'Gelato Royale';
      else if (prof.points > 200) prof.tier = 'Sundae Connoisseur';
    }
  }

  const newOrder: Order = {
    id: orderId,
    customerName: body.customerName || 'Valued Guest',
    customerPhone: body.customerPhone || '',
    customerEmail: body.customerEmail || '',
    orderType: body.orderType || 'delivery',
    deliveryAddress: body.deliveryAddress || '742 Evergreen Terrace',
    pickupTable: body.pickupTable || 'Bar Stool #1',
    items: body.items || [],
    subtotal: body.subtotal || 0,
    discount: body.discount || 0,
    tax: body.tax || 0,
    tip: body.tip || 0,
    deliveryFee: body.deliveryFee || 0,
    total: body.total || 0,
    paymentMethod: body.paymentMethod || 'card',
    paymentStatus: 'paid',
    loyaltyPointsEarned: pointsEarned,
    loyaltyCodeApplied: body.loyaltyCodeApplied,
    status: 'received',
    createdAt: new Date().toISOString(),
    estimatedDeliveryMinutes: body.orderType === 'delivery' ? 18 : 6,
    riderName: body.orderType === 'delivery' ? 'Marco Bianchi' : undefined,
    riderPhone: body.orderType === 'delivery' ? '+1 (555) 349-8812' : undefined,
    riderLat: 37.7749,
    riderLng: -122.4194,
    freezerBagTempCelsius: -16.2,
    timeline: [
      {
        status: 'received',
        title: 'Order Received',
        description: 'Payment verified. Our master churner is preparing your order.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'crafting',
        title: 'Artisanal Hand-Scooping',
        description: 'Scooping to precise velvety texture and applying drizzles.',
        timestamp: '',
        completed: false,
      },
      {
        status: 'chilling',
        title: 'Cryo-Thermal Lock',
        description: 'Stabilizing scoops in zero-degree sub-zero holding unit.',
        timestamp: '',
        completed: false,
      },
      {
        status: 'out_for_delivery',
        title: body.orderType === 'delivery' ? 'Dispatched with Courier' : 'Ready at Boutique Counter',
        description: body.orderType === 'delivery' ? 'On its way with live temperature telemetry.' : 'Waiting for pickup.',
        timestamp: '',
        completed: false,
      },
      {
        status: 'completed',
        title: 'Delivered & Enjoyed',
        description: 'Bon Appétit!',
        timestamp: '',
        completed: false,
      }
    ]
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status: OrderStatus };
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Update timeline
  const stepIndex = order.timeline.findIndex(s => s.status === status);
  if (stepIndex !== -1) {
    for (let i = 0; i <= stepIndex; i++) {
      order.timeline[i].completed = true;
      if (!order.timeline[i].timestamp) {
        order.timeline[i].timestamp = nowStr;
      }
    }
  }

  if (status === 'out_for_delivery') {
    order.estimatedDeliveryMinutes = 12;
  } else if (status === 'completed') {
    order.estimatedDeliveryMinutes = 0;
  }

  res.json(order);
});

// Loyalty endpoints
app.get('/api/loyalty/:phone', (req, res) => {
  const cleanPhone = req.params.phone.replace(/\D/g, '');
  if (loyaltyProfiles[cleanPhone]) {
    return res.json(loyaltyProfiles[cleanPhone]);
  }
  // Create guest profile
  const newProf: LoyaltyProfile = {
    phone: cleanPhone,
    name: 'Scoop Club Member',
    referralCode: `VELUTO-GUEST-${Math.floor(10 + Math.random() * 89)}`,
    points: 80,
    tier: 'Sprinkle Scout',
    lifetimeOrders: 0,
    friendsInvited: 0,
    bonusEarnedDollars: 0,
  };
  loyaltyProfiles[cleanPhone] = newProf;
  res.json(newProf);
});

app.post('/api/loyalty/redeem', (req, res) => {
  const { phone, pointsCost } = req.body;
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const prof = loyaltyProfiles[cleanPhone];
  if (!prof) {
    return res.status(404).json({ error: 'Member profile not found' });
  }
  if (prof.points < pointsCost) {
    return res.status(400).json({ error: 'Insufficient Cone Coins balance' });
  }
  prof.points -= pointsCost;
  res.json({ success: true, remainingPoints: prof.points });
});

app.post('/api/referrals/validate', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Referral code is required' });
  }
  const cleanCode = String(code).trim().toUpperCase();
  if (cleanCode.startsWith('VELUTO') || cleanCode === 'SWEETFRIEND' || cleanCode === 'SCOOP5') {
    return res.json({
      valid: true,
      discountDollars: 5.00,
      message: 'Friend Referral Applied: $5.00 off your first artisanal creation!',
    });
  }
  res.status(400).json({ valid: false, error: 'Invalid or expired referral code' });
});

// Analytics
app.get('/api/analytics', (req, res) => {
  const todayRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 184.20);
  const totalOrders = orders.length + 14;
  const avgOrderValue = totalOrders > 0 ? (todayRevenue / totalOrders) : 13.80;

  res.json({
    todayRevenue,
    todayOrdersCount: totalOrders,
    averageOrderValue: avgOrderValue,
    totalLoyaltyMembers: Object.keys(loyaltyProfiles).length + 42,
    topFlavors: [
      { name: 'Sicilian Bronte Pistachio', scoopsSold: 84, percentage: 32 },
      { name: 'Belgian 72% Noir Ganache', scoopsSold: 65, percentage: 25 },
      { name: 'Salted Butter Caramel', scoopsSold: 51, percentage: 20 },
      { name: 'Alfonso Mango & Yuzu', scoopsSold: 36, percentage: 14 },
      { name: 'Madagascar Bourbon Vanilla', scoopsSold: 24, percentage: 9 },
    ],
    hourlyTraffic: [
      { hour: '12 PM', orders: 8 },
      { hour: '2 PM', orders: 14 },
      { hour: '4 PM', orders: 19 },
      { hour: '6 PM', orders: 28 },
      { hour: '8 PM', orders: 34 },
      { hour: '10 PM', orders: 16 },
    ]
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🍦 Veluto Creamery server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
