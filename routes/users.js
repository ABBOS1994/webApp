//routes/users.js

const {Sequelize} = require("sequelize");

const express = require('express');
const router = express.Router();

// Import the Sequelize instance from models/index.js
const { sequelize } = require('../models/index');

// Models
const User = require('../models/user')(sequelize, Sequelize);

// Migration support
sequelize.sync({ force: false })
    .then(async () => await User.create({}))
    .catch(err => console.error('Error creating tables:', err?.message));

router.get('/balance/:userId', async (req, res) => {
  const {userId} = req?.params;
  try {
    const user = await User?.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ success: true, balance: user.balance });
  }catch (err) {console.error('Error creating user: ', err.message)}
})
/* POST user amount by id. */
router.post('/updateBalance/:userId/:amount', async (req, res) => {
  const {userId, amount} = await req?.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

      // Update balance
       if (user.balance - amount < 0) {
           return res.status(400).json({ error: 'Insufficient funds' });
      }

       await sequelize.transaction(async (t) => {
           user.balance -= amount;
           await user?.save({ transaction: t });
       });

       res.status(200).json({ success: true, newBalance: user.balance });

    } catch ({message}) {
        return  res.status(500).json({ error: message });
    }
});

module.exports = router;
