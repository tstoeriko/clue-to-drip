import jsonexport from "jsonexport/dist";

const jsonToCSV = (json) =>
  new Promise((resolve, reject) => {
    jsonexport(json, function (err, csv) {
      if (err) return reject(err);

      resolve(csv);
    });
  });

const valueMAP = {
  period: {
    light: { "bleeding.value": 1, "bleeding.exclude": false },
    medium: { "bleeding.value": 2, "bleeding.exclude": false },
    heavy: { "bleeding.value": 3, "bleeding.exclude": false },
    very_heavy: { "bleeding.value": 3, "bleeding.exclude": false },
  },
  spotting: {
    red: { "bleeding.value": 0, "bleeding.exclude": true },
    brown: { "bleeding.value": 0, "bleeding.exclude": true },
  },
  pain: {
    period_cramps: { "pain.cramps": true },
    ovulation: { "pain.ovulationPain": true },
    breast_tenderness: { "pain.tenderBreasts": true },
    lower_back: { "pain.backache": true },
    headache: { "pain.headache": true },
  },
  mood: {
    happy: { "mood.happy": true },
    sad: { "mood.sad": true },
    sensitive: { "mood.anxious": true },
  },
  energy: {
    exhausted: { "mood.fatigue": true },
    tired: { "mood.fatigue": true },
    fully_energized: { "mood.energetic": true },
  },
  discharge: {
    atypical: { "mucus.texture": 1, "mucus.exclude": false },
    sticky: { "mucus.texture": 1, "mucus.exclude": false },
    creamy: { "mucus.texture": 1, "mucus.exclude": false },
    egg_white: {"mucus.texture": 2, "mucus.exclude": false },
  }
};

export const formatClueJson = (data) => {
  let dataMap = {};
  data.forEach((entry) => {
    try {
      const date = entry.date;
      const type = entry.type;
      const values = Array.isArray(entry.value) ? entry.value : [entry.value];
      values.forEach((value) => {
        const option = value.option;
        if (valueMAP[type] && valueMAP[type][option]) {
          dataMap[date] = { ...dataMap[date], ...valueMAP[type][option] };
        }
      });
    } catch (error) {
      console.error(error);
    }
  });

  const headers = Object.values(dataMap)
    .flatMap((entry) => Object.keys(entry))
    .filter((value, index, self) => self.indexOf(value) === index);
  const emptyRow = headers.reduce((acc, header) => ({ ...acc, [header]: "" }), {});

  const dataCSV = Object.entries(dataMap)
    .map(([date, value]) => ({ date: date, ...emptyRow, ...value }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return jsonToCSV(dataCSV);
};
