import type { Theme } from '🍎/state/preferences.svelte.ts';

export type Wallpaper = {
	name: string;
	type: 'standalone' | 'automatic' | 'dynamic';

	thumbnail: string;

	image?: string;

	/** Timestamps definition in terms of when a new wallpaper should take effect */
	timestamps?: {
		wallpaper?: Record<number, string>;
		theme?: Record<number, Theme['scheme']>;
	};
};

const optimized_wallpapers = import.meta.glob('../../assets/wallpapers/*.{webp,jpg}', {
	eager: true,
	query: { w: 3000, quality: 98, format: 'webp' },
}) as Record<string, any>;

const wallpaperThumbnails = import.meta.glob('../../assets/wallpapers/*.{webp,jpg}', {
	eager: true,
	query: { w: 800, format: 'webp' },
}) as Record<string, any>;

const create_wallpapers_config = <TConfig = string>(
	wallpaper_config: Record<keyof TConfig, Wallpaper>,
): Partial<Record<keyof TConfig, Wallpaper>> => {
	const optimized_wallpapers_arr = Object.entries(optimized_wallpapers);
	const result: Partial<Record<keyof TConfig, Wallpaper>> = {};

	for (const [wallpaperName, config] of Object.entries(wallpaper_config)) {
		const key = wallpaperName as keyof TConfig;
		const wallpaper = wallpaper_config[key];
		const thumbnail = config.thumbnail;

		const thumbnailMatch = Object.entries(wallpaperThumbnails).find(([path]) =>
			path.includes(thumbnail),
		);
		const imageMatch = optimized_wallpapers_arr.find(([path]) => path.includes(thumbnail));

		if (!thumbnailMatch || !imageMatch) continue;

		wallpaper.thumbnail = (thumbnailMatch[1] as any).default;
		wallpaper.image = (imageMatch[1] as any).default;

		if (wallpaper.type !== 'standalone' && config.timestamps?.wallpaper) {
			for (const [time, imgName] of Object.entries(config.timestamps.wallpaper)) {
				const match = optimized_wallpapers_arr.find(([path]) => path.includes(imgName as string));
				if (match) {
					wallpaper.timestamps!.wallpaper![+time] = (match[1] as any).default;
				}
			}
		}

		result[key] = wallpaper;
	}

	return result;
};

export const wallpapers_config = create_wallpapers_config({
	mojave: {
		name: 'Mojave',
		type: 'dynamic',
		thumbnail: 'mojave-2',
		timestamps: {
			wallpaper: {
				7: 'mojave-2',
				18: 'mojave-1',
			},
			theme: {
				7: 'light',
				18: 'dark',
			},
		},
	},

	'custom-1': { name: 'Wallpaper 1', type: 'standalone', thumbnail: 'custom-1' },
	'custom-2': { name: 'Wallpaper 2', type: 'standalone', thumbnail: 'custom-2' },
	'custom-5': { name: 'Wallpaper 3', type: 'standalone', thumbnail: 'custom-5' },
	'custom-6': { name: 'Wallpaper 4', type: 'standalone', thumbnail: 'custom-6' },
	'custom-7': { name: 'Wallpaper 5', type: 'standalone', thumbnail: 'custom-7' },
	'custom-8': { name: 'Wallpaper 6', type: 'standalone', thumbnail: 'custom-8' },
	'custom-9': { name: 'Wallpaper 7', type: 'standalone', thumbnail: 'custom-9' },
	'custom-10': { name: 'Wallpaper 8', type: 'standalone', thumbnail: 'custom-10' },
	'custom-11': { name: 'Wallpaper 9', type: 'standalone', thumbnail: 'custom-11' },
	'custom-13': { name: 'Wallpaper 10', type: 'standalone', thumbnail: 'custom-13' },
	'custom-14': { name: 'Wallpaper 11', type: 'standalone', thumbnail: 'custom-14' },
	'custom-15': { name: 'Wallpaper 12', type: 'standalone', thumbnail: 'custom-15' },
	'custom-16': { name: 'Wallpaper 13', type: 'standalone', thumbnail: 'custom-16' },
	'custom-17': { name: 'Wallpaper 14', type: 'standalone', thumbnail: 'custom-17' },
	'custom-18': { name: 'Wallpaper 15', type: 'standalone', thumbnail: 'custom-18' },
	'custom-19': { name: 'Wallpaper 16', type: 'standalone', thumbnail: 'custom-19' },
	'custom-20': { name: 'Wallpaper 17', type: 'standalone', thumbnail: 'custom-20' },
	'custom-21': { name: 'Wallpaper 18', type: 'standalone', thumbnail: 'custom-21' },
	'custom-22': { name: 'Wallpaper 19', type: 'standalone', thumbnail: 'custom-22' },
	'custom-23': { name: 'Wallpaper 20', type: 'standalone', thumbnail: 'custom-23' },
	'custom-tree': { name: 'Tree', type: 'standalone', thumbnail: 'custom-tree' },
	'custom-valley': { name: 'Valley', type: 'standalone', thumbnail: 'custom-valley' },
});

export type WallpaperID = keyof typeof wallpapers_config;
