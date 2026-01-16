import { createContext, useContext, useState, ReactNode } from "react";

interface Favourite {
  id: number;
  name: string;
}

interface FavouritesContextType {
  favourites: Favourite[];
  addFavourite: (fav: Favourite) => void;
  removeFavourite: (id: number) => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(
  undefined
);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<Favourite[]>([]);

  const addFavourite = (fav: Favourite) => {
    setFavourites((prev) => {
      if (prev.find((f) => f.id === fav.id)) return prev;
      return [...prev, fav];
    });
  };

  const removeFavourite = (id: number) => {
    setFavourites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error("useFavourites must be used within FavouritesProvider");
  }
  return ctx;
};


