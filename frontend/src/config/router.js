import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Explore from "../pages/explore";
import Profile from "../pages/profile";
import CollectionPage from "../pages/collection";
import Artwork from "../pages/nft-artwork";
import CreateArt from "../pages/create-art";
import CreateCollection from "../pages/create-collection";
import MyCollection from "../pages/mycollections";
import SearchPage from "../pages/search";
import WatchlistPage from "../pages/watchlist";
import Favorites from "../pages/favorites";
import MyNft from "../pages/my_nfts";
import ExploreCategory from "../pages/explore_category";
import AddToWhitelist from "../pages/add-to-whitelist";
import ExploreAllNFTs from "../pages/explore_allnfts";
import Settings from "../pages/settings";

export default function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/explore/:category" element={<ExploreCategory />} />
      <Route path="/user/:id" element={<Profile />} />
      <Route path="/asset/:contract/:id" element={<Artwork />} />
      <Route path="/collection/:id" element={<CollectionPage />} />
      <Route path="/all_nfts" element={<ExploreAllNFTs />} />
      <Route path="/settings/" element={<Settings />} />
      <Route path="/create" element={<CreateArt />} />
      <Route
        path="/create-collection"
        element={<CreateCollection></CreateCollection>}
      />
      <Route path="/my_collections" element={<MyCollection></MyCollection>} />
      <Route
        path="/search/:category/:search"
        element={<SearchPage></SearchPage>}
      />
      <Route path="/watchlist" element={<WatchlistPage></WatchlistPage>} />
      <Route path="/favorites" element={<Favorites></Favorites>} />
      <Route path="/my_nfts" element={<MyNft></MyNft>} />
      <Route
        path="/add-to-whitelist"
        element={<AddToWhitelist></AddToWhitelist>}
      />
    </Routes>
  );
}
