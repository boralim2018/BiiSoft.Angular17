
import { Injectable } from '@angular/core';
import { CacheFactory } from 'cachefactory'; //http://www.pseudobry.com/CacheFactory/3.0.0/index.html

@Injectable({
    providedIn: "root"
})
export class CacheService {

    private cacheFactory: CacheFactory = new CacheFactory();
    cache: any;
    private cacheName = 'bii-cache';
    constructor() {
        this.createCache(this.cacheName);
    }

    private createCache(cacheName: string) {
        // Check whether cache metadata has been initialized
        // on every page refresh.
        if (!this.cacheFactory.exists(cacheName)) {
            // Create the cache metadata. Any previously saved
            // data will be loaded.
            this.cache = this.cacheFactory.createCache(cacheName, {
                storageMode: 'localStorage',//default memory
                // Items expire after 24 hour
                maxAge: 24 * 60 * 60 * 1000,
                // Items will be deleted from the cache as soon as they expire
                deleteOnExpire: 'aggressive',
                // Completely remove the prefix to save the most space
                storagePrefix: '',
            });
        }
    }

    set(key: string, obj: any) { this.cache.put(key, obj); }
    get(key: string) { return this.cache.get(key); }
    remove(key: string) { this.cache.remove(key); }
    removeAll() { this.cache.removeAll(); }
    destroy() { this.cacheFactory.destroy(this.cacheName); }
    destroyAll() { this.cacheFactory.destroyAll(); }
}
