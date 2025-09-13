// Strategy Pattern for payment processing

export class PaymentContext {
  constructor(strategy) {
    this.setStrategy(strategy);
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  pay(amount) {
    return this.strategy.pay(amount);
  }
}

export class CreditCardStrategy {
  pay(amount) {
    return `Paid ₹${amount} with Credit Card.`;
  }
}

export class UPIStrategy {
  pay(amount) {
    return `Paid ₹${amount} with UPI.`;
  }
}

export class WalletStrategy {
  pay(amount) {
    return `Paid ₹${amount} with Digital Wallet.`;
  }
}
