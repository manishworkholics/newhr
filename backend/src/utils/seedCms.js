import { City } from "../models/City.js";
import { Event } from "../models/Event.js";
import { GalleryImage } from "../models/GalleryImage.js";
import { Roadshow } from "../models/Roadshow.js";
import { AboutPage } from "../models/AboutPage.js";
import { Testimonial } from "../models/Testimonial.js";
import { Journey } from "../models/Journey.js";
import { defaultAboutPage, defaultCities, defaultEvents, defaultGallery, defaultJourney, defaultRoadshow, defaultTestimonials } from "../data/defaultCms.js";

export async function seedCmsIfEmpty() {
  const [roadshowCount, eventCount, cityCount, galleryCount, aboutCount, testimonialCount, journeyCount] = await Promise.all([
    Roadshow.countDocuments(),
    Event.countDocuments(),
    City.countDocuments(),
    GalleryImage.countDocuments(),
    AboutPage.countDocuments(),
    Testimonial.countDocuments(),
    Journey.countDocuments()
  ]);

  if (!roadshowCount) {
    await Roadshow.create(defaultRoadshow);
  } else {
    const roadshow = await Roadshow.findOne().sort({ createdAt: 1 });
    const missingSections = {};
    if (!roadshow?.citySection?.title) missingSections.citySection = defaultRoadshow.citySection;
    if (!roadshow?.eventSection?.title) missingSections.eventSection = defaultRoadshow.eventSection;
    if (Object.keys(missingSections).length) {
      await Roadshow.updateOne({ _id: roadshow._id }, { $set: missingSections });
    }
  }

  if (!eventCount) {
    await Event.insertMany(defaultEvents);
  }

  if (!cityCount) {
    await City.insertMany(defaultCities);
  }

  if (!galleryCount) {
    await GalleryImage.insertMany(defaultGallery);
  }

  if (!aboutCount) {
    await AboutPage.create(defaultAboutPage);
  }

  if (!testimonialCount) {
    await Testimonial.insertMany(defaultTestimonials);
  }

  if (!journeyCount) {
    await Journey.insertMany(defaultJourney);
  }
}
