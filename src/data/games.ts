import { Module } from "@/types";

export const MOCK_GAME_DATA: Record<string, Module> = {
  '1': {
    id: '1',
    title: 'Month 1: The Unexpected',
    category: 'Monthly Simulation',
    description: 'Manage your budget through life’s surprises.',
    scenarios: [
      {
        id: 'budget_1',
        module_id: '1',
        title: 'Unexpected Expense',
        prompt: "Your car (or transit situation) hits a major snag. Repairs or replacement costs are looming. What do you do?",
        choices: [
          {
            id: 'c1',
            scenario_id: 'budget_1',
            text: 'Pay using savings ($800)',
            consequence: "Your savings decrease by $800, but you avoid taking on any high-interest debt.",
            score_delta: -800, 
            next_scenario_id: 'social_choice'
          },
          {
            id: 'c2',
            scenario_id: 'budget_1',
            text: 'Put it on credit card ($800)',
            consequence: "You keep your cash, but your debt increases by $800 and you will owe interest next month.",
            score_delta: -800, 
            next_scenario_id: 'social_choice'
          },
          {
            id: 'c3',
            scenario_id: 'budget_1',
            text: 'Delay repair',
            consequence: "You save money now, but you might face much larger issues or job problems in the future.",
            score_delta: 0,
            next_scenario_id: 'social_choice'
          }
        ]
      },
      {
        id: 'social_choice',
        module_id: '1',
        title: 'The Weekend Dilemma',
        prompt: "Friends are going out for a nice dinner and then a concert. It will cost about $150 total. Your 'Utilities' bill is due in 3 days. What do you do?",
        choices: [
          {
            id: 'c4',
            scenario_id: 'social_choice',
            text: 'Go out and enjoy ($150)',
            consequence: "You had a great time! But your bank balance is lower, and you'll need to be very careful with groceries next week.",
            score_delta: -150, 
            next_scenario_id: 'dental_emergency'
          },
          {
            id: 'c5',
            scenario_id: 'social_choice',
            text: 'Stay in and save',
            consequence: "You saved $150. Your utility bill will be easy to pay, but you feel a bit of 'Social FOMO'.",
            score_delta: 0, 
            next_scenario_id: 'dental_emergency'
          }
        ]
      },
      {
        id: 'dental_emergency',
        module_id: '1',
        title: 'Unexpected Health Cost',
        prompt: "A sudden toothache requires an emergency filling. It isn't covered by your basic benefits. How do you handle it?",
        choices: [
          {
            id: 'c6',
            scenario_id: 'dental_emergency',
            text: 'Pay Private Dentist ($400)',
            consequence: "You handled the pain immediately. Your balance is lower, but your long-term health is protected.",
            score_delta: 10, 
            logic: "Investing in health prevents minor issues from becoming major crises later. It shows a commitment to self-responsibility.",
            reflection: "Does having emergency savings make this decision easier to handle?",
            next_scenario_id: 'end'
          },
          {
            id: 'c7',
            scenario_id: 'dental_emergency',
            text: 'Wait for a Public Clinic (3 weeks)',
            consequence: "You saved the $400, but the prolonged pain and risk of infection have negatively impacted your life stability score.",
            score_delta: -15, 
            logic: "Delaying essential care to save cash often results in higher costs later—both in health and lost productivity.",
            reflection: "What were the potential risks of waiting those extra three weeks?",
            next_scenario_id: 'end'
          }
        ]
      }
    ]
  }
};
