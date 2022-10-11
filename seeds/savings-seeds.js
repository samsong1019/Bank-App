const { Savings } = require('../models');

const savingsData =
[
    {
        id: 1,
        balance: 3000,
        user_id: 1
    },
    {
        id: 2,
        balance: 3000,
        user_id: 2
    },
    {
        id: 3,
        balance: 3000,
        user_id: 3
    },
    {
        id: 4,
        balance: 3000,
        user_id: 4
    }
]

const seedSavings = () => Savings.bulkCreate(savingsData);

module.exports = seedSavings;