import { render, screen } from "@testing-library/react";
import AssetURL from "./helpers/asset_url";
import currency_service from "./services/currency";
import CollectionCard from "./components/collectionCard";
import CategoryCard from "./components/category-card";

test("Check IPFS links", () => {
  expect(AssetURL.convert_img("ipfs://trial")).toBe(
    "https://cf-ipfs.com/ipfs/trial"
  );
});

test("Check HTTP links", () => {
  expect(AssetURL.convert_img("https://cf-ipfs.com/ipfs/trial")).toBe(
    "https://cf-ipfs.com/ipfs/trial"
  );
});

test("Check Currency API", async () => {
  await expect(await currency_service.get_current_rate()).toHaveProperty("TRY");
  await expect(await currency_service.get_current_rate()).toHaveProperty("USD");
});
