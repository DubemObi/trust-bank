// Type definitions as JSDoc for reference (not runtime enforceable, but good for understanding)

/**
 * @typedef {string} UUID
 */

/**
 * @typedef {Object} User
 * @property {UUID} id
 * @property {string} email
 * @property {string} [fullName]
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [phoneNumber]
 * @property {boolean} [isEmailVerified]
 * @property {string[]} [roles]
 */

/**
 * @typedef {Object} BankAccount
 * @property {UUID} id
 * @property {string} accountNumber
 * @property {string} [accountType]
 * @property {number} balance
 * @property {string} [currency]
 * @property {boolean} [isActive]
 * @property {UUID} [userId]
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} Transaction
 * @property {UUID} id
 * @property {'Deposit' | 'Withdraw' | 'Transfer' | 'Credit' | 'Debit' | string} type
 * @property {number} amount
 * @property {string} [description]
 * @property {UUID} [fromAccountId]
 * @property {UUID} [toAccountId]
 * @property {UUID} [accountId]
 * @property {string} createdAt
 * @property {string} [status]
 */

/**
 * @typedef {Object} Card
 * @property {UUID} id
 * @property {string} cardNumber
 * @property {string} [cardHolderName]
 * @property {string} [expiryDate]
 * @property {string} [cardType]
 * @property {string} [status]
 * @property {UUID} [accountId]
 */

/**
 * @typedef {Object} CardRequest
 * @property {UUID} id
 * @property {string} [cardType]
 * @property {'Pending' | 'Approved' | 'Rejected' | string} status
 * @property {UUID} [accountId]
 * @property {string} [createdAt]
 * @property {string} [reason]
 */

/**
 * @typedef {Object} Loan
 * @property {UUID} id
 * @property {number} amount
 * @property {number} [interestRate]
 * @property {number} [termMonths]
 * @property {string} [status]
 * @property {string} [startDate]
 * @property {string} [endDate]
 * @property {number} [remainingBalance]
 */

/**
 * @typedef {Object} LoanRequest
 * @property {UUID} id
 * @property {number} amount
 * @property {number} [termMonths]
 * @property {string} [purpose]
 * @property {'Pending' | 'Approved' | 'Rejected' | string} status
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {User} [user]
 * @property {string} [expiresAt]
 */