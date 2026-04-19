import { seedCatalog } from "./catalog-seeding";

seedCatalog("additive").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
