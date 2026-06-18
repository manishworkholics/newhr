import { City } from "../models/City.js";
import { Event } from "../models/Event.js";
import { Roadshow } from "../models/Roadshow.js";
import { defaultCities, defaultEvents, defaultRoadshow } from "../data/defaultCms.js";

export async function seedCmsIfEmpty() {
  const [roadshowCount, eventCount, cityCount] = await Promise.all([
    Roadshow.countDocuments(),
    Event.countDocuments(),
    City.countDocuments()
  ]);

  if (!roadshowCount) {
    await Roadshow.create(defaultRoadshow);
  }

  if (!eventCount) {
    await Event.insertMany(defaultEvents);
  }

  if (!cityCount) {
    await City.insertMany(defaultCities);
  }
}
