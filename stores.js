function getChoicesData() {
  return fetch('./data/choices.json').then((response) => response.json());
}
const choices = {
  all: [],
  last_updated: null,
  async init() {
    const data = await getChoicesData()
    this.all = data.choices.sort((c1, c2) => c2.Price - c1.Price);
    this.last_updated = new Date(Date.parse(data.last_updated));
  },
  getChoice(name) {
    return this.all.find((choice) => choice.Choice === name);
  },
  getChoices(names) {
    return this.all.filter((choice) => names.some((name) => choice.Choice === name));
  },
  getChoicesInCategory(category) {
    return this.all.filter((choice) => choice.Category === category);
  },
  getTopChoicesInCategory(category, num_acts) {
    return this.getChoicesInCategory(category).toSorted((c1, c2) => c2.Price - c1.Price).slice(0, num_acts);
  },
  filterChoices(categories, search) {
    return this.all
      .filter((choice) => categories.some((cat) => cat === choice.Category))
      .filter((choice) => {
        const searchables = [choice.Choice.toLowerCase(), choice['Package option'].toLowerCase()];
        return searchables.some((s) => s.includes(search.toLowerCase()));
      });
  }
}

function getPassesData() {
  return fetch('./data/passes.json').then((response) => response.json());
}
const passes = {
  all: [],
  types: [],
  last_updated: null,
  async init() {
    const data = await getPassesData();
    this.all = data.passes;
    this.types = data.pass_types;
    this.last_updated = new Date(Date.parse(data.last_updated));
  },
  getPass(type, numActs) {
    return this.all.find((p) => p.type === type && p.num_acts === numActs);
  },
  getPassesOfType(type) {
    return this.all.filter((p) => p.type === type);
  },
}

const chosen = {
  all: [],
  clear() {
    this.all = [];
  },
  getTotalPrice() {
    const choiceInfo = choices.getChoices(this.all);
    return choiceInfo.reduce((total, current) => total + current.Price, 0);
  },
  getPassForChoices() {
    if (this.all.length < 3) {
      // No valid pass for less than three chosen activities.
      return {'type': 'Invalid', num_acts: 0, price: 0}
    }

    const requiredPassType = this.all.some((c) => choices.getChoice(c).Category === 'Premium') ? 'Premium' : 'Standard';
    return passes.getPass(requiredPassType, this.all.length);
  },
  getPassSavings() {
    return this.getTotalPrice() - this.getPassForChoices().price;
  }
};

export default function createStores() {
  document.addEventListener('alpine:init', () => {
    Alpine.store('chosen', chosen);
    Alpine.store('choices', choices);
    Alpine.store('passes', passes);
  });
}
