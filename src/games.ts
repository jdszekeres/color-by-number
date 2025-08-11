import info from "../drawings/info.json";
import { Item } from "./types";

const count = info.total_pages;

// Async function that loads games one page at a time and yields results immediately
export async function* loadGamesIncrementallyGenerator(): AsyncGenerator<{
    games: Item[],
    pageNumber: number,
    totalPages: number
}, void, unknown> {
    for (let i = 1; i <= count; i++) {
        try {
            const module = await import(`../drawings/page_${i}.json`);
            const pageGames = module.default as Item[];
            yield {
                games: pageGames,
                pageNumber: i,
                totalPages: count
            };
        } catch (error) {
            console.error(`Failed to load page ${i}:`, error);
            yield {
                games: [],
                pageNumber: i,
                totalPages: count
            };
        }
    }
}

// Simple function to load games with a callback - sequential loading for reliability
export async function loadGamesWithProgress(
    onPageLoaded: (newGames: Item[], pageNumber: number, totalPages: number) => void
): Promise<Item[]> {
    const allGames: Item[] = [];

    // Load pages one by one to ensure proper order and immediate callbacks
    for (let i = 1; i <= count; i++) {
        try {
            const module = await import(`../drawings/page_${i}.json`);
            const pageGames = module.default as Item[];
            allGames.push(...pageGames);

            // Call callback immediately after each page loads
            onPageLoaded(pageGames, i, count);
        } catch (error) {
            console.error(`Failed to load page ${i}:`, error);
            onPageLoaded([], i, count);
        }
    }

    return allGames;
}

// Async function to load games incrementally, calling callback as each page loads
export async function loadGamesIncrementally(
    onPageLoaded: (games: Item[], pageNumber: number, totalPages: number) => void
): Promise<Item[]> {
    const allGames: Item[] = [];

    // Load pages sequentially to show progress
    for (let i = 1; i <= count; i++) {
        try {
            const module = await import(`../drawings/page_${i}.json`);
            const pageGames = module.default as Item[];
            allGames.push(...pageGames);

            // Call the callback with current games after each page loads
            onPageLoaded([...allGames], i, count);
        } catch (error) {
            console.error(`Failed to load page ${i}:`, error);
        }
    }

    return allGames;
}

// Async function to load all games in parallel (fastest)
export async function loadGames(): Promise<Item[]> {
    // Create an array of promises for parallel loading
    const loadPromises: Promise<Item[] | null>[] = [];

    for (let i = 1; i <= count; i++) {
        const loadPromise = import(`../drawings/page_${i}.json`)
            .then(module => module.default as Item[]) // Each file contains an array of items
            .catch(error => {
                console.error(`Failed to load page ${i}:`, error);
                return null; // Return null for failed loads
            });
        loadPromises.push(loadPromise);
    }

    // Wait for all pages to load in parallel
    const results = await Promise.all(loadPromises);

    // Filter out null values (failed loads) and flatten the arrays
    const games = results
        .filter((pageGames): pageGames is Item[] => pageGames !== null)
        .flat(); // Flatten the array of arrays into a single array

    return games;
}

// Async function to load games one by one (slower but uses less memory)
export async function loadGamesSequentially(): Promise<Item[]> {
    const games: Item[] = [];

    for (let i = 1; i <= count; i++) {
        try {
            const module = await import(`../drawings/page_${i}.json`);
            const pageGames = module.default as Item[]; // Each file contains an array
            games.push(...pageGames); // Spread the array to add individual items
        } catch (error) {
            console.error(`Failed to load page ${i}:`, error);
        }
    }

    return games;
}

// Async generator for loading games on-demand
export async function* loadGamesLazily(): AsyncGenerator<Item, void, unknown> {
    for (let i = 1; i <= count; i++) {
        try {
            const module = await import(`../drawings/page_${i}.json`);
            const pageGames = module.default as Item[]; // Each file contains an array
            for (const game of pageGames) {
                yield game; // Yield individual games
            }
        } catch (error) {
            console.error(`Failed to load page ${i}:`, error);
        }
    }
}

// For backwards compatibility, export a promise that loads all games
export const games = loadGames();