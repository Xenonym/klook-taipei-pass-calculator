function getChoicesData() {
  return fetch('./data/choices.json').then((response) => response.json());
}
const choices = {
  async init() {
    this.all = (await getChoicesData()).sort((c1, c2) => c2.Price - c1.Price);
  },
  getChoice(name) {
    return this.all.find((choice) => choice.Choice === name);
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
  },
  all: []
}

function getPassesData() {
  return fetch('./data/passes.json').then((response) => response.json());
}
const passes = {
  async init() {
    const data = await getPassesData();
    this.all = data.passes;
    this.types = data.passTypes;
  },
  getPassesOfType(type) {
    return this.all.filter((p) => p.type === type);
  },
  getPassForChoices(choices) {
    const requiredPassType = choices.some((c) => c.Category === 'Premium') ? 'Premium' : 'Standard';
    return this.all.find((p) => p.type === requiredPassType && p.num_acts === choices.length);
  },
  all: [],
  types: []
}

const chosen = [];

export default function createStores() {
  document.addEventListener('alpine:init', async () => {
    Alpine.store('chosen', chosen);
    Alpine.store('choices', choices);
    Alpine.store('passes', passes);
  });
}
