<template>
  <div
    class="flex-row items-center"
    :class="variant === 'desktop' ? 'hidden lg:flex' : 'flex lg:hidden'"
  >
    <div
      v-if="variant === 'desktop'"
      class="flex flex-row items-center gap-1 rounded-full border border-[#f3f4f6]/25 bg-[#121212]/35 text-[#f3f4f6] transition-[width,border-color,box-shadow] duration-300 ease-in-out focus-within:border-[#239ced] focus-within:shadow-[0_0_0_2px_rgba(35,156,237,0.35)]"
      :class="{
        'w-[40px] cursor-pointer px-2 py-1': collapsed && !focused,
        'w-[180px] min-[1440px]:w-[220px]': !collapsed && !focused,
        'w-[260px] min-[1440px]:w-[320px]': focused,
        'cursor-text px-3 py-1': !collapsed || focused,
      }"
      @click="onFieldClick"
      :role="collapsed && !focused ? 'button' : 'search'"
      :tabindex="collapsed && !focused ? 0 : -1"
      :aria-label="collapsed && !focused ? 'Apri ricerca' : 'Ricerca nel sito'"
      @keydown.enter.self.prevent="onFieldClick"
      @keydown.space.self.prevent="onFieldClick"
    >
      <q-icon name="search" size="20px" class="text-[#239ced]" />
      <input
        ref="input"
        v-model="query"
        type="search"
        class="min-w-0 border-0 bg-transparent text-sm leading-6 text-[#f3f4f6] outline-none placeholder:text-[#f3f4f6]/50 [font-family:'Roboto_Variable',sans-serif] [&::-webkit-search-cancel-button]:hidden"
        :class="collapsed && !focused ? 'pointer-events-none w-0 flex-[0_1_0] opacity-0' : 'w-auto flex-1 opacity-100'"
        placeholder="Cerca nel sito..."
        aria-label="Cerca nel sito"
        :tabindex="collapsed ? -1 : 0"
        @focus="open"
        @blur="onBlur"
        @input="onInput"
        @keydown.esc="close"
        @keydown.enter="goToFirst"
      />
      <q-btn
        v-if="query"
        flat
        dense
        round
        size="sm"
        icon="close"
        class="!text-[#f3f4f6]/70"
        aria-label="Cancella ricerca"
        @click.stop="reset"
      />
    </div>

    <q-btn
      v-else
      flat
      round
      icon="search"
      class="text-[#f3f4f6]"
      aria-label="Apri ricerca"
    />

    <q-menu
      v-model="menuOpen"
      class="!max-w-[94vw] !rounded-xl !border !border-[#239ced]/40 !bg-[#121212] !shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
      :no-parent-event="variant === 'desktop'"
      no-focus
      no-refocus
      :anchor="variant === 'mobile' ? 'bottom right' : 'bottom middle'"
      :self="variant === 'mobile' ? 'top right' : 'top middle'"
      :offset="[0, 8]"
      @show="onMenuShow"
    >
      <div class="w-[min(400px,92vw)] p-2 text-[#f3f4f6]">
        <div v-if="variant === 'mobile'" class="mb-1 flex w-full cursor-text flex-row items-center gap-1 rounded-full border border-[#f3f4f6]/25 bg-[#1e198f]/25 px-3 py-1 text-[#f3f4f6] transition-[border-color,box-shadow] duration-300 ease-in-out focus-within:border-[#239ced] focus-within:shadow-[0_0_0_2px_rgba(35,156,237,0.35)]">
          <q-icon name="search" size="20px" class="text-[#239ced]" />
          <input
            ref="mobileInput"
            v-model="query"
            type="search"
            class="min-w-0 flex-1 border-0 bg-transparent text-sm leading-6 text-[#f3f4f6] outline-none placeholder:text-[#f3f4f6]/50 [font-family:'Roboto_Variable',sans-serif] [&::-webkit-search-cancel-button]:hidden"
            placeholder="Cerca nel sito..."
            aria-label="Cerca nel sito"
            @input="onInput"
            @keydown.esc="close"
            @keydown.enter="goToFirst"
          />
          <q-btn
            v-if="query"
            flat
            dense
            round
            size="sm"
            icon="close"
            class="!text-[#f3f4f6]/70"
            aria-label="Cancella ricerca"
            @click.stop="reset"
          />
        </div>

        <div v-if="loading" class="flex flex-row items-center justify-center p-4 text-center text-sm text-[#f3f4f6]/65 [font-family:'Roboto_Variable',sans-serif]">
          <q-spinner color="secondary" size="2em" :thickness="5" />
        </div>
        <div v-else-if="error" class="flex flex-row items-center justify-center p-4 text-center text-sm text-[#f3f4f6]/65 [font-family:'Roboto_Variable',sans-serif]">
          <q-icon name="error_outline" color="accent" size="20px" class="q-mr-sm" />
          <span>Impossibile caricare i contenuti</span>
        </div>
        <div v-else-if="query.trim().length < 2" class="flex flex-row items-center justify-center p-4 text-center text-sm text-[#f3f4f6]/65 [font-family:'Roboto_Variable',sans-serif]">
          Digita almeno 2 caratteri per iniziare la ricerca
        </div>
        <div v-else-if="results.length === 0" class="flex flex-row items-center justify-center p-4 text-center text-sm text-[#f3f4f6]/65 [font-family:'Roboto_Variable',sans-serif]">
          <q-icon name="search_off" color="accent" size="20px" class="q-mr-sm" />
          <span>Nessun risultato per &quot;{{ query }}&quot;</span>
        </div>
        <q-list v-else dense class="max-h-[60vh] overflow-y-auto bg-transparent">
          <q-item
            v-for="group in results"
            :key="group.key"
            v-ripple
            clickable
            class="rounded-lg transition-colors duration-200 hover:bg-[#1e198f] focus:bg-[#1e198f]"
            @click="go(group.primary)"
          >
            <q-item-section avatar>
              <q-icon :name="iconFor(group.primary)" class="text-[#239ced]" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-[#f3f4f6] font-medium [font-family:'Roboto_Variable',sans-serif]">
                {{ group.primary.name }}
                <span v-if="group.count > 1" class="ml-1.5 inline-block rounded-full bg-[#239ced] px-[7px] py-px align-middle text-[11px] font-semibold text-[#f3f4f6]">+{{ group.count - 1 }}</span>
              </q-item-label>
              <q-item-label caption lines="1" class="!text-[#f3f4f6]/60">
                {{ group.primary.description }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption class="!text-[#239ced] capitalize [font-family:'Roboto_Variable',sans-serif]">
                {{ folderName(group.primary) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick } from 'vue';
import type { PropType } from 'vue';

import type { Mappings } from '@/contracts/Mappings';
import type { Resource } from '@/contracts/Resource';
import { useResourceStore } from '@/stores/Resources';
import { slugify } from '@/utils/format';
import { SearchEngine } from '@/utils/search';

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 8;
const DEBOUNCE_MS = 250;
const COLLAPSE_BREAKPOINT = 1280;
const HOME_SECTIONS = ['team', 'video', 'carosello', 'news'] as const;

interface SearchGroup {
  key: string;
  primary: Resource;
  count: number;
}

export default defineComponent({
  name: 'HeaderSearch',

  props: {
    variant: {
      type: String as PropType<'desktop' | 'mobile'>,
      default: 'desktop',
    },
  },

  setup() {
    return {
      resourceStore: useResourceStore(),
    };
  },

  data() {
    return {
      query: '',
      results: [] as SearchGroup[],
      menuOpen: false,
      loading: false,
      loaded: false,
      error: false,
      focused: false,
      collapsed: false,
      debounce: undefined as ReturnType<typeof setTimeout> | undefined,
      idleHandle: undefined as number | undefined,
      idleFallback: undefined as ReturnType<typeof setTimeout> | undefined,
      onResize: null as (() => void) | null,
      mappings: inject('mappings') as Mappings,
    };
  },

  watch: {
    $route() {
      this.close();
      this.reset();
    },
  },

  mounted() {
    const prefetch = () => void this.ensureLoaded();

    if ('requestIdleCallback' in window) {
      this.idleHandle = window.requestIdleCallback(prefetch);
    } else {
      this.idleFallback = setTimeout(prefetch, 1500);
    }

    if (this.variant === 'desktop') {
      this.onResize = () => this.updateCollapsed();
      this.updateCollapsed();
      window.addEventListener('resize', this.onResize);
    }
  },

  beforeUnmount() {
    if (this.debounce) clearTimeout(this.debounce);
    if (this.idleHandle !== undefined && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(this.idleHandle);
    }
    if (this.idleFallback) clearTimeout(this.idleFallback);

    if (this.variant === 'desktop' && this.onResize) {
      window.removeEventListener('resize', this.onResize);
    }
  },

  methods: {
    onInput() {
      this.menuOpen = true;
      void this.ensureLoaded();

      if (this.debounce) clearTimeout(this.debounce);

      this.debounce = setTimeout(() => this.runSearch(), DEBOUNCE_MS);
    },
    runSearch() {
      const query = this.query.trim();

      if (!this.loaded || query.length < MIN_QUERY_LENGTH) {
        this.results = [];
        return;
      }

      const matches = SearchEngine(this.resourceStore._searchable, query);
      const groups = new Map<string, SearchGroup>();

      for (const resource of matches) {
        const key = resource.name.trim().toLowerCase();
        const existing = groups.get(key);

        if (existing) {
          existing.count++;
        } else {
          groups.set(key, { key, primary: resource, count: 1 });
        }
      }

      this.results = [...groups.values()].slice(0, MAX_RESULTS);
    },
    async ensureLoaded() {
      if (this.loaded || this.loading) return;

      this.loading = true;
      this.error = false;

      try {
        await this.resourceStore.getContent();
        this.loaded = true;
        this.runSearch();
      } catch {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    open() {
      this.focused = true;
      this.menuOpen = true;
      void this.ensureLoaded();
    },
    close() {
      this.menuOpen = false;
    },
    updateCollapsed() {
      this.collapsed = window.innerWidth < COLLAPSE_BREAKPOINT;
    },
    onFieldClick() {
      if (this.collapsed && !this.focused) {
        (this.$refs.input as HTMLInputElement | undefined)?.focus();
        return;
      }

      this.focusInput();
    },
    onBlur() {
      this.focused = false;
    },
    reset() {
      this.query = '';
      this.results = [];
    },
    go(resource: Resource) {
      this.close();
      this.reset();
      void this.$router.push({ path: this.urlFor(resource), force: true });
    },
    goToFirst() {
      const [first] = this.results;

      if (first) this.go(first.primary);
    },
    focusInput() {
      (this.$refs.input as HTMLInputElement | undefined)?.focus();
    },
    onMenuShow() {
      void this.ensureLoaded();

      if (this.variant !== 'mobile') return;

      void nextTick(() => {
        (this.$refs.mobileInput as HTMLInputElement | undefined)?.focus();
      });
    },
    urlFor(resource: Resource): string {
      const defaults = this.mappings?.defaults ?? {};
      const section = HOME_SECTIONS.find((key) => defaults[key]?.id === resource.fid);

      if (section) return `/index/${section}`;
      if (defaults['galleria']?.id === resource.fid) return `/gallery/${resource.id}`;

      return `/post/${resource.id}/${slugify(resource.name)}`;
    },
    folderName(resource: Resource): string {
      return this.resourceStore._names[resource.fid] ?? '';
    },
    iconFor(resource: Resource): string {
      const defaults = this.mappings?.defaults ?? {};

      if (defaults['news']?.id === resource.fid) return 'newspaper';
      if (defaults['team']?.id === resource.fid) return 'diversity_3';
      if (defaults['video']?.id === resource.fid) return 'play_circle';
      if (defaults['galleria']?.id === resource.fid) return 'photo_library';
      if (defaults['carosello']?.id === resource.fid) return 'image';

      return 'article';
    },
  },
});
</script>
