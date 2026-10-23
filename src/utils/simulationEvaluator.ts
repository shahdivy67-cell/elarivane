import { SimulatorItem } from '../types/simulator';

export interface EvaluationResult {
  metrics: { [key: string]: number };
  statusNote: string;
  isEquilibriumReached: boolean;
  lessonInsight: string;
}

export function evaluateSimulationModel(
  simulator: SimulatorItem,
  values: { [key: string]: number }
): EvaluationResult {
  const resultMetrics: { [key: string]: number } = { ...simulator.initialMetrics };
  let statusNote = 'System responding to adjusted parameters.';
  let isEquilibriumReached = true;
  let lessonInsight = simulator.coreLesson;

  switch (simulator.evaluatorFnKey) {
    case 'game-theory-trust': {
      const trust = values.initialTrust ?? 70;
      const forgive = values.forgivenessRate ?? 80;
      const firm = values.retaliationStrength ?? 60;

      // Mathematical Axelrod tit-for-tat formulation
      const wellbeing = Math.min(100, Math.round(trust * 0.45 + forgive * 0.4 + (100 - Math.abs(firm - 50)) * 0.15));
      const exploit = Math.max(5, Math.min(95, Math.round((100 - firm) * 0.5 + (100 - forgive) * 0.2)));
      const synergy = Math.min(100, Math.round((wellbeing * 0.7) + (100 - exploit) * 0.3));

      resultMetrics.collectiveWellbeing = wellbeing;
      resultMetrics.exploitationRisk = exploit;
      resultMetrics.longTermSynergy = synergy;

      if (forgive < 30) {
        statusNote = 'Low forgiveness leads to perpetual cycles of retaliation and exhaustion.';
        lessonInsight = 'When nobody forgives, a single misunderstanding triggers endless cycles of punishment.';
        isEquilibriumReached = false;
      } else if (firm < 20 && trust > 80) {
        statusNote = 'Blind trust without healthy boundaries attracts parasitic exploitation.';
        lessonInsight = 'Kindness without boundaries is not virtue; it is naive vulnerability.';
      } else {
        statusNote = 'Optimal tit-for-tat with generous forgiveness flourishing smoothly.';
        lessonInsight = 'Being clear, generous, forgiving, and transparent consistently maximizes long-term peace.';
      }
      break;
    }

    case 'compound-patience': {
      const daily = values.dailyEffort ?? 1.0;
      const distraction = values.distractionTax ?? 15;
      const months = values.timeHorizonMonths ?? 24;

      const netDailyGrowth = Math.max(0.1, (daily - (distraction / 100) * 0.8));
      const compounded = Math.min(100, Math.round(Math.pow(1 + netDailyGrowth / 10, months / 3) * 6));
      const reserves = Math.min(100, Math.round(80 - distraction * 0.6 + (months * 0.4)));
      const freedom = Math.min(100, Math.round(compounded * 0.6 + reserves * 0.4));

      resultMetrics.skillGrowthMultiplier = Number((compounded / 5).toFixed(1));
      resultMetrics.mentalReserve = reserves;
      resultMetrics.freedomQuotient = freedom;

      if (distraction > 35) {
        statusNote = 'High digital distraction is siphoning away compound growth before momentum starts.';
        lessonInsight = 'Reels scrolling does not just cost minutes; it siphons the mental energy required for compounding.';
      } else if (months >= 24) {
        statusNote = 'Exponential inflection point reached. The hockey-stick curve is visible.';
        lessonInsight = 'The most profound accomplishments of your life will come from ordinary unhurried days.';
      }
      break;
    }

    case 'dopamine-reset': {
      const reels = values.reelFrequencyHours ?? 1.5;
      const analog = values.analogPresenceHours ?? 4.5;
      const rest = values.sleepRestQuality ?? 7.5;

      const baseline = Math.min(100, Math.max(15, Math.round(95 - reels * 14 + analog * 4 + rest * 3)));
      const vibrancy = Math.min(100, Math.max(10, Math.round(analog * 12 + rest * 4 - reels * 10)));
      const resistance = Math.min(100, Math.max(15, Math.round(85 - reels * 12 + analog * 3)));

      resultMetrics.baselineHappiness = baseline;
      resultMetrics.sensoryVibrancy = vibrancy;
      resultMetrics.cravingsResistance = resistance;

      if (reels > 3.0) {
        statusNote = 'Dopamine receptor downregulation detected. Everyday tasks feel devoid of reward.';
        lessonInsight = 'Flooding your neurochemistry with rapid novel clips makes peaceful reality feel flat and grey.';
        isEquilibriumReached = false;
      } else {
        statusNote = 'Sensory baseline recalibrated. Sunlight, food, and paper books feel vivid again.';
        lessonInsight = 'A brief period of boredom restores your capacity to feel deep, sustained satisfaction.';
      }
      break;
    }

    case 'commons-stewardship': {
      const harvest = values.harvestRate ?? 35;
      const restore = values.restorationInvestment ?? 55;
      const trust = values.transparencyLevel ?? 75;

      const longevity = Math.min(100, Math.max(5, Math.round(110 - harvest * 0.9 + restore * 0.6 + trust * 0.2)));
      const yieldAmt = Math.min(100, Math.max(10, Math.round(harvest * 0.7 + (longevity > 50 ? 40 : 10))));
      const stability = Math.min(100, Math.max(10, Math.round(trust * 0.6 + restore * 0.4)));

      resultMetrics.ecosystemLongevity = longevity;
      resultMetrics.aggregateYield = yieldAmt;
      resultMetrics.stabilityIndex = stability;

      if (harvest > 65 && restore < 30) {
        statusNote = 'Over-extraction pasture collapse. Topsoil and living resources exhausted.';
        lessonInsight = 'When everyone takes maximum immediate profit, the common ground withers and all perish.';
        isEquilibriumReached = false;
      } else {
        statusNote = 'Living regenerative equilibrium maintained across generations.';
        lessonInsight = 'Stewardship is not sacrifice; it is ensuring there is a harvest tomorrow.';
      }
      break;
    }

    case 'stoic-balance': {
      const internal = values.internalFocusWeight ?? 80;
      const external = values.externalOutcomesFixation ?? 20;

      const fortress = Math.min(100, Math.round(internal * 0.85 + (100 - external) * 0.15));
      const volatility = Math.min(100, Math.round(external * 0.9 + (100 - internal) * 0.1));
      const clarity = Math.min(100, Math.round(internal * 0.9));

      resultMetrics.innerFortress = fortress;
      resultMetrics.emotionalVolatility = volatility;
      resultMetrics.clarityOfAction = clarity;

      if (external > 60) {
        statusNote = 'Paralyzed by external metrics: comments, weather, stock blips, and gossip.';
        lessonInsight = 'You surrender your freedom every time you demand that the outside world behave to your liking.';
        isEquilibriumReached = false;
      } else {
        statusNote = 'Unshakeable internal citadel active. Events happen; your response is pure choice.';
        lessonInsight = 'No external person can damage your character unless you voluntarily consent to it.';
      }
      break;
    }

    case 'attention-residue': {
      const notifs = values.notificationFrequencyPerHour ?? 3;
      const block = values.deepBlockMinutes ?? 75;
      const distance = values.phonePhysicalDistance ?? 90;

      const insight = Math.min(100, Math.max(10, Math.round((block / 120) * 55 + (distance / 100) * 35 - notifs * 1.5)));
      const fatigue = Math.min(100, Math.max(15, Math.round(notifs * 3.2 - (block / 120) * 10 + (100 - distance) * 0.2)));
      const fulfillment = Math.min(100, Math.max(10, Math.round(insight * 0.6 + (100 - fatigue) * 0.4)));

      resultMetrics.deepInsightBreakthrough = insight;
      resultMetrics.mentalFatigue = fatigue;
      resultMetrics.craftsmanshipFulfillment = fulfillment;

      if (notifs > 15) {
        statusNote = 'Continuous partial attention syndrome. The brain is unable to assemble deep concepts.';
        lessonInsight = 'Checking a ping for three seconds fragments the neural working memory buffer for over 20 minutes.';
        isEquilibriumReached = false;
      } else {
        statusNote = 'Profound cognitive immersion achieved. Flow state and architectural clarity active.';
        lessonInsight = 'Mastery belongs to those who guard their attention as their most sacred earthly treasure.';
      }
      break;
    }

    default: {
      // General dynamic model for generated ecosystem simulators
      const p1 = values.primaryLever ?? 60;
      const p2 = values.distractionResistance ?? 60;
      const p3 = values.patienceHorizon ?? 18;

      const harmony = Math.min(100, Math.round(p1 * 0.45 + p2 * 0.35 + (p3 / 36) * 20));
      const friction = Math.min(100, Math.max(5, Math.round(100 - p2 * 0.7 - (p3 / 36) * 25)));
      const maturity = Math.min(100, Math.round(harmony * 0.6 + (100 - friction) * 0.4));

      resultMetrics.systemicHarmony = harmony;
      resultMetrics.frictionVulnerability = friction;
      resultMetrics.insightMaturity = maturity;

      statusNote = harmony > 70
        ? 'Harmonic equilibrium demonstrated across systemic parameters.'
        : 'Suboptimal balance. Review the core lesson to tune variables.';
      break;
    }
  }

  return {
    metrics: resultMetrics,
    statusNote,
    isEquilibriumReached,
    lessonInsight
  };
}
