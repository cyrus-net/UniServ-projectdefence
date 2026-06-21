# Code Citations

## License: unknown
https://github.com/Rafal-Doranczyk/gym-client/blob/39a0fce547aac8e78fd290d48037020a50b8b5c2/app/api/auth/%5B...nextauth%5D/route.ts

```
Yes, absolutely! You can store Google tokens in MongoDB and retrieve them later. Here are the steps:

## **Step 1: Extend User Model to Store Tokens**

Update [backend/models/User.js](backend/models/User.js) to include Google token fields:

```javascript
const userSchema = new mongoose.Schema(
  {
    // ... existing fields ...
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    googleAccessToken: {
      type: String,
      default: null,
    },
    googleRefreshToken: {
      type: String,
      default: null,
    },
    googleTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
```

## **Step 2: Modify Auth Controller**

Update [backend/controllers/authController.js](backend/controllers/authController.js) to save tokens when user logs in with Google:

```javascript
async function googleAuth(req, res) {
  try {
    const { idToken } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        photoBase64: picture,
        googleId,
        role: "client",
      });
    } else {
      // Update existing user with Google info
      user.googleId = googleId;
      user.googleAccessToken = req.body.accessToken || null;
      user.googleRefreshToken = req.body.refreshToken || null;
      user.googleTokenExpiry = req.body.expiresIn ? new Date(Date.now() + req.body.expiresIn * 1000) : null;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: "Google authentication failed" });
  }
}
```

## **Step 3: Add Endpoint to Retrieve Google Tokens**

Add this to [backend/controllers/authController.js](backend/controllers/authController.js):

```javascript
async function getGoogleTokens(req, res) {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.googleAccessToken) {
      return res.status(404).json({ message: "No Google tokens found" });
    }

    // Check if token is expired and refresh if needed
    if (user.googleTokenExpiry && new Date() > user.googleTokenExpiry) {
      if (user.googleRefreshToken) {
        // Refresh the token
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: user.googleRefreshToken,
            grant_type: 'refresh_token',
          
```


## License: unknown
https://github.com/Rafal-Doranczyk/gym-client/blob/39a0fce547aac8e78fd290d48037020a50b8b5c2/app/api/auth/%5B...nextauth%5D/route.ts

```
Yes, absolutely! You can store Google tokens in MongoDB and retrieve them later. Here are the steps:

## **Step 1: Extend User Model to Store Tokens**

Update [backend/models/User.js](backend/models/User.js) to include Google token fields:

```javascript
const userSchema = new mongoose.Schema(
  {
    // ... existing fields ...
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    googleAccessToken: {
      type: String,
      default: null,
    },
    googleRefreshToken: {
      type: String,
      default: null,
    },
    googleTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
```

## **Step 2: Modify Auth Controller**

Update [backend/controllers/authController.js](backend/controllers/authController.js) to save tokens when user logs in with Google:

```javascript
async function googleAuth(req, res) {
  try {
    const { idToken } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        photoBase64: picture,
        googleId,
        role: "client",
      });
    } else {
      // Update existing user with Google info
      user.googleId = googleId;
      user.googleAccessToken = req.body.accessToken || null;
      user.googleRefreshToken = req.body.refreshToken || null;
      user.googleTokenExpiry = req.body.expiresIn ? new Date(Date.now() + req.body.expiresIn * 1000) : null;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: "Google authentication failed" });
  }
}
```

## **Step 3: Add Endpoint to Retrieve Google Tokens**

Add this to [backend/controllers/authController.js](backend/controllers/authController.js):

```javascript
async function getGoogleTokens(req, res) {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.googleAccessToken) {
      return res.status(404).json({ message: "No Google tokens found" });
    }

    // Check if token is expired and refresh if needed
    if (user.googleTokenExpiry && new Date() > user.googleTokenExpiry) {
      if (user.googleRefreshToken) {
        // Refresh the token
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: user.googleRefreshToken,
            grant_type: 'refresh_token',
          
```


## License: unknown
https://github.com/Rafal-Doranczyk/gym-client/blob/39a0fce547aac8e78fd290d48037020a50b8b5c2/app/api/auth/%5B...nextauth%5D/route.ts

```
Yes, absolutely! You can store Google tokens in MongoDB and retrieve them later. Here are the steps:

## **Step 1: Extend User Model to Store Tokens**

Update [backend/models/User.js](backend/models/User.js) to include Google token fields:

```javascript
const userSchema = new mongoose.Schema(
  {
    // ... existing fields ...
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    googleAccessToken: {
      type: String,
      default: null,
    },
    googleRefreshToken: {
      type: String,
      default: null,
    },
    googleTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
```

## **Step 2: Modify Auth Controller**

Update [backend/controllers/authController.js](backend/controllers/authController.js) to save tokens when user logs in with Google:

```javascript
async function googleAuth(req, res) {
  try {
    const { idToken } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        photoBase64: picture,
        googleId,
        role: "client",
      });
    } else {
      // Update existing user with Google info
      user.googleId = googleId;
      user.googleAccessToken = req.body.accessToken || null;
      user.googleRefreshToken = req.body.refreshToken || null;
      user.googleTokenExpiry = req.body.expiresIn ? new Date(Date.now() + req.body.expiresIn * 1000) : null;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: "Google authentication failed" });
  }
}
```

## **Step 3: Add Endpoint to Retrieve Google Tokens**

Add this to [backend/controllers/authController.js](backend/controllers/authController.js):

```javascript
async function getGoogleTokens(req, res) {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.googleAccessToken) {
      return res.status(404).json({ message: "No Google tokens found" });
    }

    // Check if token is expired and refresh if needed
    if (user.googleTokenExpiry && new Date() > user.googleTokenExpiry) {
      if (user.googleRefreshToken) {
        // Refresh the token
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: user.googleRefreshToken,
            grant_type: 'refresh_token',
          
```

