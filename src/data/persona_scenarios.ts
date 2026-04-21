import { Scenario } from "@/types";

export const PERSONA_SCENARIOS: Record<string, Scenario[]> = {
  // 1: High School Teacher
  '1': [
    {
      id: 'teacher_strike',
      module_id: '1',
      title: 'Union Strike Looming',
      prompt: "The teachers' union is planning a strike. You need to decide whether to participate (sacrificing pay but gaining long-term benefits) or cross the line to keep your paycheck.",
      choices: [
        {
          id: 'ts1',
          scenario_id: 'teacher_strike',
          text: 'Participate (Cost: $500/week)',
          consequence: "You show solidarity. You lose some immediate income, but your union standing increases.",
          score_delta: 10,
          next_scenario_id: 'end'
        },
        {
          id: 'ts2',
          scenario_id: 'teacher_strike',
          text: 'Cross the line (Keep pay)',
          consequence: "You kept your income, but you feel the social strain in the staff room.",
          score_delta: -5,
          next_scenario_id: 'end'
        }
      ]
    }
  ],
  // 10: Restaurant Owner
  '10': [
    {
      id: 'health_inspector',
      module_id: '1',
      title: 'Surprise Health Inspection',
      prompt: "A surprise inspection reveals your grease trap needs an emergency cleaning that costs $1,200 immediately, or you face a $5,000 fine and closure.",
      choices: [
        {
          id: 'hi1',
          scenario_id: 'health_inspector',
          text: 'Immediate Repair ($1,200)',
          consequence: "You pass the inspection and stay open. Your balance takes a hit, but your business reputation is safe.",
          score_delta: 20,
          next_scenario_id: 'end'
        },
        {
          id: 'hi2',
          scenario_id: 'health_inspector',
          text: 'Risk the fine',
          consequence: "The inspector issues a closure notice. You lose 3 days of revenue and pay the $5,000 fine later.",
          score_delta: -50,
          next_scenario_id: 'end'
        }
      ]
    }
  ],
  // 13: Electrician
  '13': [
    {
      id: 'safety_upgrade',
      module_id: '1',
      title: 'New Safety Standards',
      prompt: "Ontario safety codes have updated. You need to upgrade your testing equipment for $850 to keep your insurance valid for independent contracts.",
      choices: [
        {
          id: 'su1',
          scenario_id: 'safety_upgrade',
          text: 'Upgrade Gear ($850)',
          consequence: "You stay fully compliant and can take on more lucrative commercial contracts.",
          score_delta: 15,
          next_scenario_id: 'end'
        },
        {
          id: 'su2',
          scenario_id: 'safety_upgrade',
          text: 'Wait for next year',
          consequence: "You save the cash, but you are limited to residential work only.",
          score_delta: -5,
          next_scenario_id: 'end'
        }
      ]
    }
  ],
  // 3: Line Cook
  '3': [
    {
      id: 'overtime_burnout',
      module_id: '1',
      title: 'Double Shift Offer',
      prompt: "The Head Chef offers you a double shift. It's an extra $120, but you're already exhausted and might risk an injury or burnout. Do you take it?",
      choices: [
        {
          id: 'oc1',
          scenario_id: 'overtime_burnout',
          text: 'Take the shift (+$120)',
          consequence: "You made the money, but your energy levels are dangerously low.",
          score_delta: 5,
          next_scenario_id: 'end'
        },
        {
          id: 'oc2',
          scenario_id: 'overtime_burnout',
          text: 'Prioritize rest',
          consequence: "You lost the extra pay, but you're fresh for the busy weekend service.",
          score_delta: 10,
          next_scenario_id: 'end'
        }
      ]
    }
  ],
  // 17: Criminal Lawyer
  '17': [
    {
      id: 'lawyer_settlement',
      module_id: '1',
      title: 'The Settlement Trap',
      prompt: "Your client is offering a $50,000 settlement to avoid a trial that could cost $200,000 in legal fees. However, if you win, you'd net a $500,000 judgment. Your billable hours are at risk. Advice?",
      choices: [
        {
          id: 'ls1',
          scenario_id: 'lawyer_settlement',
          text: 'Settle now ($50k)',
          consequence: "Guaranteed income, but you missed a potential massive win for your firm's reputation.",
          score_delta: 20,
          next_scenario_id: 'end'
        },
        {
          id: 'ls2',
          scenario_id: 'lawyer_settlement',
          text: 'Proceed to trial',
          consequence: "Your firm is under pressure. The outcome is uncertain, and your debt exposure is high.",
          score_delta: -10,
          next_scenario_id: 'end'
        }
      ]
    }
  ],
  // 16: Dentist
  '16': [
    {
      id: 'dental_laser',
      module_id: '1',
      title: 'High-Tech Upgrade',
      prompt: "A specialized dental laser is available for a $15,000 lease. It promises to reduce procedure time by 30%, potentially increasing your patient throughput.",
      choices: [
        {
          id: 'dl1',
          scenario_id: 'dental_laser',
          text: 'Sign Lease ($15,000)',
          consequence: "You are the most tech-forward office in town. Monthly expenses increase, but revenue potential is higher.",
          score_delta: 15,
          next_scenario_id: 'end'
        },
        {
          id: 'dl2',
          scenario_id: 'dental_laser',
          text: 'Stick to traditional',
          consequence: "You avoid the debt, but your younger competitors are pulling ahead in efficiency.",
          score_delta: -5,
          next_scenario_id: 'end'
        }
      ]
    }
  ],
  // 11: Sculpting Artist
  '11': [
    {
      id: 'gallery_cut',
      module_id: '1',
      title: 'Gallery Representation',
      prompt: "A top Yorkville gallery wants to represent you, but they take a 60% commission. A local collective offers 20% commission but has much lower foot traffic.",
      choices: [
        {
          id: 'gc1',
          scenario_id: 'gallery_cut',
          text: 'Sign with Yorkville',
          consequence: "Your prestige skyrockets, but your take-home pay per piece is significantly lower.",
          score_delta: 25,
          next_scenario_id: 'end'
        },
        {
          id: 'gc2',
          scenario_id: 'gallery_cut',
          text: 'Join the Collective',
          consequence: "You keep more of your money, but building a brand will take much longer.",
          score_delta: 5,
          next_scenario_id: 'end'
        }
      ]
    }
  ],
  // 15: Makeup Artist
  '15': [
    {
      id: 'influencer_collab',
      module_id: '1',
      title: 'The Influencer Wedding',
      prompt: "A viral influencer wants you to do their wedding for 'Exposure' instead of your $2,500 fee. They have 2M followers. This could make or break your booking season.",
      choices: [
        {
          id: 'ic1',
          scenario_id: 'influencer_collab',
          text: 'Accept for Exposure',
          consequence: "You lost $2,500 in immediate cash, but your inbox is now flooded with new inquiries.",
          score_delta: 30,
          next_scenario_id: 'end'
        },
        {
          id: 'ic2',
          scenario_id: 'influencer_collab',
          text: 'Demand Full Fee',
          consequence: "You got your money, but the influencer went with a competitor and posted a rant about you.",
          score_delta: -10,
          next_scenario_id: 'end'
        }
      ]
    }
  ]
};
