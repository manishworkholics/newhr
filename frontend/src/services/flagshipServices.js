import { apiRequest, resolveApiAssetUrl } from "../api";

const normalizeService = (service) => ({
  ...service,
  id: service.slug || service.id,
  image: resolveApiAssetUrl(service.image),
  details: Array.isArray(service.details) ? service.details : []
});

// Flagship experiences are managed as CMS events. Keeping this adapter in one
// place lets the homepage and Services module share exactly the same source.
export async function getFlagshipServices() {
  const data = await apiRequest("/cms");
  return getFlagshipServicesFromCms(data);
}

export function getFlagshipServicesFromCms(cms) {
  return (cms?.events || [])
    .filter((service) => service.status !== "Draft")
    .map(normalizeService);
}

export async function getServiceGallery(serviceTitle) {
  const data = await apiRequest("/gallery-events");
  const title = serviceTitle.trim().toLowerCase();
  return (data.gallery || []).filter((item) =>
    [item.eventName, item.eventTitle].some((name) => name?.trim().toLowerCase() === title)
  );
}
