export function getChoicesFromNames(choiceNames) {
  return choiceNames.map(
    (name) => Alpine.store('choices').getChoice(name)
  );
}
export function getPassForChoices(choiceNames) {
  // Dummy return to workaround Alpine.js evaluating expressions in templates even though they are not supposed
  // to be rendered based on their x-if condition.
  if (choiceNames.length < 2) {
    return {'type': 'Standard', num_acts: 0, price: 0}
  }

  return Alpine.store('passes').getPassForChoices(getChoicesFromNames(choiceNames));
}
export function getChoicesTotalPrice(choiceNames) {
  const choiceInfo = getChoicesFromNames(choiceNames);
  return choiceInfo.reduce((total, current) => total + current.Price, 0);
}

export function getPassSavingsForChoices(choiceNames, pass) {
  const choiceTotalPrice = getChoicesTotalPrice(choiceNames);
  return choiceTotalPrice - pass.price;
}

export function installGlobally() {
  const functions = [getChoicesFromNames, getPassForChoices, getChoicesTotalPrice, getPassSavingsForChoices];
  for (const func of functions) {
    window[func.name] = func;
  }
}
