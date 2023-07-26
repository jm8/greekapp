import adapter from '@sveltejs/adapter-static';
import {
    vitePreprocess
} from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/greekapp' : '/'
        },
        adapter: adapter({
			fallback: 'index.html'
		})
    }
};

export default config;