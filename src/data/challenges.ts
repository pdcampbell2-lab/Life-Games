import { Choice } from "@/types";

export interface FinalChallenge {
  id: string;
  player_id?: string;
  household_id?: string;
  title: string;
  description: string;
  choices: {
    id: string;
    text: string;
    description: string;
    balance_impact: number;
    budget_impact?: number; // Monthly income/expense change
    score_delta: number;
    outcome_text: string;
  }[];
}

export const FINAL_CHALLENGES: FinalChallenge[] = [
  {
    id: 'fc-1',
    player_id: '1',
    title: 'The Mansion Move & Rental Pivot',
    description: "You've met someone and are moving into a mansion. You now have a decision to make about your current Brampton home: do you sell it for a lump sum or convert it into a rental property to build long-term wealth?",
    choices: [
      {
        id: 'fc-1-a',
        text: 'Convert to Rental ($2,500/mo)',
        description: 'Keep the asset and generate passive income.',
        balance_impact: -5000, // Prep costs
        budget_impact: 2500,
        score_delta: 20,
        outcome_text: "Expert move. You now have a recurring income stream that covers your new expenses."
      },
      {
        id: 'fc-1-b',
        text: 'Sell Property ($200k Profit)',
        description: 'Take the cash now and pay off all debts.',
        balance_impact: 200000,
        score_delta: 10,
        outcome_text: "You are debt-free! However, you've lost a long-term appreciating asset."
      }
    ]
  },
  {
    id: 'fc-2',
    player_id: '2',
    title: 'The Executive Chef Promotion',
    description: "Your hard work paid off. You've been offered an Executive Chef position ($124,000) but it requires a relocation. Your current partner cannot move yet. Do you take the career leap or prioritize the relationship?",
    choices: [
      {
        id: 'fc-2-a',
        text: 'Take Promotion & Relocate',
        description: 'Prioritize career growth and the $124k salary.',
        balance_impact: 5000, // Relocation bonus
        budget_impact: 4000, // Monthly increase
        score_delta: 15,
        outcome_text: "Your income has tripled! But the long-distance strain will be a new challenge."
      },
      {
        id: 'fc-2-b',
        text: 'Stay & Negotiate Raise',
        description: 'Stay for the relationship and get a $10k raise.',
        balance_impact: 0,
        budget_impact: 800,
        score_delta: 25,
        outcome_text: "You prioritized your life stability and relationship. Your income grew modestly but safely."
      }
    ]
  },
  {
    id: 'fc-3',
    player_id: '3',
    title: 'The $3.2M Lottery Paradox',
    description: "In an incredible stroke of luck, you've won $3.2 Million. Simultaneously, the studio you worked at has closed. You are now being sued for back-dated alimony and child support based on your new wealth.",
    choices: [
      {
        id: 'fc-3-a',
        text: 'Invest Everything & Settle',
        description: 'Pay the $500k legal settlement and invest the rest.',
        balance_impact: 2700000,
        budget_impact: 10000, // Dividend income
        score_delta: 30,
        outcome_text: "Brilliant. You are financially independent and your children's future is secured."
      },
      {
        id: 'fc-3-b',
        text: 'Luxury Spree & Fight Court',
        description: 'Buy a yacht and fight the alimony increase.',
        balance_impact: 1000000,
        budget_impact: -5000, // Maintenance costs
        score_delta: -40,
        outcome_text: "You're living large, but the court ruled against you. Your wealth is draining fast."
      }
    ]
  },
  {
    id: 'fc-10',
    household_id: 'household_10_11',
    title: 'The "4 Weddings" Competition',
    description: "You've been invited to the '4 Weddings' TV competition! You can either blow your budget to win the $10,000 prize or keep it modest and risk the loss.",
    choices: [
      {
        id: 'fc-10-a',
        text: 'Grand Wedding ($40,000)',
        description: 'Go all out. High risk of debt, but 50% chance of $10k.',
        balance_impact: -30000, // Net after hypothetical win
        score_delta: -20,
        outcome_text: "You won! But you spent $40k to win $10k. Your debt has skyrocketed."
      },
      {
        id: 'fc-10-b',
        text: 'Backyard Wedding ($5,000)',
        description: 'Keep it simple and stay debt-free.',
        balance_impact: -5000,
        score_delta: 35,
        outcome_text: "You lost the show, but you've started your marriage with zero debt. A true win."
      }
    ]
  }
  // Data for players 4/5, 12/13, 16/17, 18, 6/7, 14/15, 8/9 would follow.
];
