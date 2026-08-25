import { useState, useMemo, useCallback, useEffect } from "react";
import { downloadCsv } from "@/lib/csv";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FiltersPanel from "@/components/filters/FiltersPanel";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, MapPin, Eye, Zap, Loader2, FileImage, Maximize2, LayoutGrid, List, Search } from "lucide-react";
import { useSharedPromptGalleryState } from "@/hooks/useSharedPromptGalleryState";

interface Image {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  optimized_image_url: string | null;
  desktop_image_url?: string | null;
  mobile_image_url: string | null;
  thumbnail_image_url: string | null;
  country: string | null;
  year: number | null;
  model: string | null;
  created_at: string;
  prompt: string;
  width: number | null;
  height: number | null;
  cost: number | null;
  cfg_scale: number | null;
  steps: number | null;
  // Additional fields for filtering
  theme: string | null;
  approx_people_count: number | null;
  confidence: number | null;
  celebrity: boolean | null;
  real_event: boolean | null;
  has_full_hints: boolean | null;
  ready: boolean | null;
  aspect_ratio: string | null;
  accuracy_score: Record<string, any> | null;
  desktop_size_kb: number | null;
  original_size_kb: number | null;
  output_format: string | null;
  binary?: string | null;
  continent?: string | null;
}

const MODEL_NAME_MAP: Record<string, string> = {
  "bfl:1@1": "BFL FLUX1 Pro",
  "bfl:2@1": "BFL FLUX1.1 Pro",
  "bfl:2@2": "BFL FLUX1.1 Pro Ultra",
  "bfl:3@1": "BFL FLUX Kontext Pro",
  "bfl:4@1": "BFL FLUX Kontext Max",
  "runware:100@1": "Runware 100",
  "rundiffusion:130@100": "RunDiffusion 130",
  "fal-ai/imagen4/preview": "Imagen 4 (FAL)",
  "fal-ai/fast-sdxl": "Fast SDXL (FAL)",
  "fal-ai/sd-turbo": "SD Turbo (FAL)",
  "runware": "Runware",
};

const getModelDisplayName = (model?: string | null): string | null => {
  if (!model) return null;
  if (MODEL_NAME_MAP[model]) return MODEL_NAME_MAP[model];
  if (model.startsWith("reve:")) {
    const version = model.split(":")[1] ?? "";
    return `REVE ${version.toUpperCase()}`.trim();
  }
  return model;
};

const formatCostDisplay = (cost: number | null, model?: string | null): string => {
  if (cost === null || cost === undefined) return "—";
  if (isReveModel(model)) {
    const precision = Number.isInteger(cost) ? 0 : cost < 0.01 ? 4 : 2;
    const displayValue = cost.toFixed(precision);
    const numericValue = Number(displayValue);
    const isSingular = Math.abs(numericValue - 1) < Number.EPSILON;
    return `${displayValue} credit${isSingular ? '' : 's'}`;
  }
  const precision = cost < 0.01 ? 4 : 2;
  return `$${cost.toFixed(precision)}`;
};

const FALLBACK_IMAGE_URL = 'https://picsum.photos/400/400?random=fallback';
const FULLSCREEN_FALLBACK_URL = 'https://picsum.photos/800/600?random=fallback';

const formatCreditsTotal = (value: number): string => {
  const precision = Number.isInteger(value) ? 0 : value < 1 ? 4 : 2;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: precision === 0 ? 0 : 2,
    maximumFractionDigits: precision,
  });
};

const formatDollarTotal = (value: number): string => {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getImageSource = (image: Image): string | null => {
  return image.optimized_image_url ?? null;
};

const isReveModel = (model?: string | null): boolean => !!model && model.startsWith('reve:');

const sortByCreatedAtDesc = (images: Image[]): Image[] =>
  [...images].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

// Local storage key for cached images
const LOCAL_IMAGES_KEY = 'historify_cached_images';

// Component to display image size information
const ImageSizeDisplay = ({ image }: { image: Image }) => {
  const originalSize = typeof image.original_size_kb === 'number' ? `${image.original_size_kb} KB` : null;
  const optimizedSize = typeof image.desktop_size_kb === 'number' ? `${image.desktop_size_kb} KB` : null;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <FileImage className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Image Sizes:</span>
      </div>
      <div className="pl-6 space-y-1">
        {originalSize && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Original:</span>
            <span className="font-mono">{originalSize}</span>
          </div>
        )}
        {optimizedSize && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Optimized:</span>
            <span className="font-mono">{optimizedSize}</span>
          </div>
        )}
        {!originalSize && !optimizedSize && (
          <span className="text-muted-foreground text-sm">Size information not available</span>
        )}
      </div>
    </div>
  );
};

const Gallery = () => {
  const pageSizeOptions = [10, 25, 50, 75, 100];
  const { searchTerm, setSearchTerm, filters, setFilters } = useSharedPromptGalleryState();
  const activeFilters = useMemo(() => filters, [filters]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [fullscreenImage, setFullscreenImage] = useState<Image | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const applyFilters = useCallback((query: any, term?: string) => {
    let filteredQuery = query;
    if (activeFilters.theme) {
      filteredQuery = filteredQuery.eq('theme', activeFilters.theme);
    }
    if (activeFilters.location) {
      filteredQuery = filteredQuery.eq('country', activeFilters.location);
    }
    if (activeFilters.continent) {
      filteredQuery = filteredQuery.eq('1_where_continent', activeFilters.continent);
    }
    if (activeFilters.dateCreatedRange) {
      const [fromTs, toTs] = activeFilters.dateCreatedRange;
      filteredQuery = filteredQuery
        .gte('created_at', new Date(fromTs).toISOString())
        .lte('created_at', new Date(toTs).toISOString());
    }
    if (activeFilters.numberPeopleRange) {
      const [minP, maxP] = activeFilters.numberPeopleRange;
      filteredQuery = filteredQuery
        .gte('approx_people_count', minP)
        .lte('approx_people_count', maxP);
    }
    if (activeFilters.confidenceRange) {
      const [minC, maxC] = activeFilters.confidenceRange;
      filteredQuery = filteredQuery
        .gte('confidence', minC)
        .lte('confidence', maxC);
    }
    if (activeFilters.celebrityOnly) {
      filteredQuery = filteredQuery.eq('celebrity', true);
    }
    if (activeFilters.realEventStatus === 'true') {
      filteredQuery = filteredQuery.eq('real_event', true);
    } else if (activeFilters.realEventStatus === 'fictional') {
      filteredQuery = filteredQuery.eq('real_event', false);
    }
    if (activeFilters.hasFullHints) {
      filteredQuery = filteredQuery.eq('has_full_hints', true);
    }
    if (activeFilters.zeroCostOnly) {
      filteredQuery = filteredQuery.eq('cost', 0);
    }
    if (activeFilters.imageStatus === 'with_image') {
      filteredQuery = filteredQuery.not('optimized_image_url', 'is', null).neq('optimized_image_url', '');
    } else if (activeFilters.imageStatus === 'missing_image') {
      filteredQuery = filteredQuery.or('optimized_image_url.is.null,optimized_image_url.eq.');
    }
    if (term) {
      filteredQuery = filteredQuery.ilike('title', `%${term}%`);
    }
    return filteredQuery;
  }, [activeFilters]);

  const { data: yearBoundsData } = useQuery({
    queryKey: ['images-year-bounds'],
    queryFn: async () => {
      const minQuery = supabase
        .from('images')
        .select('year')
        .not('year', 'is', null)
        .order('year', { ascending: true })
        .limit(1);

      const maxQuery = supabase
        .from('images')
        .select('year')
        .not('year', 'is', null)
        .order('year', { ascending: false })
        .limit(1);

      const [{ data: minData, error: minError }, { data: maxData, error: maxError }] = await Promise.all([minQuery, maxQuery]);

      if (minError) throw minError;
      if (maxError) throw maxError;

      const minYear = minData?.[0]?.year ?? null;
      const maxYear = maxData?.[0]?.year ?? null;

      if (minYear === null || maxYear === null) return null;

      return { minYear, maxYear };
    },
    staleTime: 30000,
    retry: false,
  });

  const { data: filterOptionsData } = useQuery({
    queryKey: ['images-filter-options'],
    queryFn: async () => {
      const normalize = (rows: any[] | null | undefined, key: string) =>
        (rows ?? [])
          .map((row) => row[key] as string | null)
          .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
          .map((value) => value.trim())
          .sort((a, b) => a.localeCompare(b));

      const [themeResult, locationResult, continentResult] = await Promise.all([
        supabase
          .from('images')
          .select('theme')
          .not('theme', 'is', null),
        supabase
          .from('images')
          .select('country')
          .not('country', 'is', null),
        supabase
          .from('images')
          .select('1_where_continent')
          .not('1_where_continent', 'is', null),
      ]);

      if (themeResult.error) throw themeResult.error;
      if (locationResult.error) throw locationResult.error;
      if (continentResult.error) throw continentResult.error;

      return {
        themes: normalize(themeResult.data, 'theme'),
        locations: normalize(locationResult.data, 'country'),
        continents: normalize(continentResult.data, '1_where_continent'),
      } as const;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!yearBoundsData) return;
    setFilters((prev) => {
      const minYear = yearBoundsData.minYear;
      const maxYear = yearBoundsData.maxYear;
      const bounds: [number, number] =
        minYear <= maxYear ? [minYear, maxYear] : [maxYear, minYear];

      if (!prev.yearRange) {
        return { ...prev, yearRange: bounds };
      }

      const [prevMin, prevMax] = prev.yearRange;
      const clampedMin = Math.max(bounds[0], Math.min(bounds[1], prevMin));
      const clampedMax = Math.max(bounds[0], Math.min(bounds[1], prevMax));
      const sorted: [number, number] =
        clampedMin <= clampedMax ? [clampedMin, clampedMax] : [clampedMax, clampedMin];
      if (sorted[0] === prevMin && sorted[1] === prevMax) return prev;
      return { ...prev, yearRange: sorted };
    });
  }, [yearBoundsData, setFilters]);

  // Query for total count of images matching filters
  const { data: totalCountData } = useQuery({
    queryKey: ['images-count', activeFilters, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('images')
        .select('id', { count: 'exact', head: true });
      query = applyFilters(query, searchTerm);
      const { count, error } = await query;
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 30000,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const { data: totalsData, isLoading: totalsLoading, error: totalsError } = useQuery({
    queryKey: ['images-totals', activeFilters, searchTerm],
    queryFn: async () => {
      const { data, error } = await applyFilters(
        supabase.from('images').select('cost, model'),
        searchTerm
      );

      if (error) throw error;

      const paidImages = (data ?? []).filter((row: { cost: number | null; model: string | null }): row is { cost: number; model: string | null } =>
        typeof row.cost === 'number' && row.cost > 0
      );

      const totalCredits = paidImages.reduce((sum: number, row: { cost: number; model: string | null }) => {
        return row.model?.startsWith('reve:') ? sum + row.cost : sum;
      }, 0);

      const totalDollars = paidImages.reduce((sum: number, row: { cost: number; model: string | null }) => {
        return row.model?.startsWith('reve:') ? sum : sum + row.cost;
      }, 0);

      return { totalCredits, totalDollars };
    },
    staleTime: 30000,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const { data: images, isLoading, error } = useQuery({
    queryKey: ['images', page, pageSize, activeFilters, searchTerm],
    queryFn: async () => {
      try {
        const primaryColumns = [
          'id',
          'title',
          'description',
          'optimized_image_url',
          'country',
          'year',
          'model',
          'created_at',
          'prompt',
          'width',
          'height',
          'cost',
          'cfg_scale',
          'steps',
          'theme',
          'approx_people_count',
          'confidence',
          'celebrity',
          'real_event',
          'has_full_hints',
          'ready',
          'aspect_ratio',
          'desktop_size_kb',
          'original_size_kb',
          'output_format',
          'continent:"1_where_continent"',
        ].join(',');
        const fallbackColumns = [
          'id',
          'title',
          'description',
          'optimized_image_url',
          'created_at',
          'ready',
          'prompt',
          'model',
          'cost',
          'output_format',
          'continent:"1_where_continent"',
        ].join(',');

        const rangeStart = page * pageSize;
        const rangeEnd = (page + 1) * pageSize - 1;

        const buildQuery = (columns: string, withOrder: boolean) => {
          let q = supabase.from('images').select(columns);
          q = applyFilters(q, searchTerm);
          if (withOrder) {
            q = q.order('created_at', { ascending: false });
          }
          return q.range(rangeStart, rangeEnd).returns<Image[]>();
        };

        const { data, error } = await buildQuery(primaryColumns, true);
        if (error) {
          if ((error as { code?: string })?.code === '57014') {
            const { data: fallbackData, error: fallbackError } = await buildQuery(fallbackColumns, false);
            if (fallbackError) {
              throw new Error('Failed to fetch images – Supabase unavailable');
            }
            return sortByCreatedAtDesc(fallbackData ?? []);
          }
          throw new Error('Failed to fetch images – Supabase unavailable');
        }
        return sortByCreatedAtDesc(data ?? []);
      } catch (e) {
        throw e;
      }
    },
    staleTime: 30000, // 30 seconds
    retry: false, // Don't retry on failure
    placeholderData: keepPreviousData,
  });

    // No longer filter out by ready status
  // Filtering now handled in Supabase query
  const countsEnabled = typeof totalCountData === 'number';
  const displayImages = useMemo(() => {
    if (!images) return [];
    return sortByCreatedAtDesc(images);
  }, [images]);

  const themeOptions = useMemo(() => {
    const base = filterOptionsData?.themes ?? [];
    const fallback = displayImages
      .map((image) => image.theme)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());
    const current = activeFilters.theme && activeFilters.theme.trim().length > 0 ? [activeFilters.theme.trim()] : [];
    return Array.from(new Set([...base, ...fallback, ...current])).sort((a, b) => a.localeCompare(b));
  }, [filterOptionsData, displayImages, activeFilters.theme]);

  const locationOptions = useMemo(() => {
    const base = filterOptionsData?.locations ?? [];
    const fallback = displayImages
      .map((image) => image.country)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());
    const current = activeFilters.location && activeFilters.location.trim().length > 0 ? [activeFilters.location.trim()] : [];
    return Array.from(new Set([...base, ...fallback, ...current])).sort((a, b) => a.localeCompare(b));
  }, [filterOptionsData, displayImages, activeFilters.location]);

  const continentOptions = useMemo(() => {
    const base = filterOptionsData?.continents ?? [];
    const fallback = displayImages
      .map((image) => image.continent)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());
    const current = activeFilters.continent && activeFilters.continent.trim().length > 0 ? [activeFilters.continent.trim()] : [];
    return Array.from(new Set([...base, ...fallback, ...current])).sort((a, b) => a.localeCompare(b));
  }, [filterOptionsData, displayImages, activeFilters.continent]);

  const canDownloadImages = displayImages.length > 0;
  const hasSelection = selectedIds.size > 0;

  const selectAllFiltered = useCallback(() => {
    if (!canDownloadImages) return;
    setSelectedIds(new Set(displayImages.map((image) => image.id)));
  }, [canDownloadImages, displayImages]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const totalPages = useMemo(() => {
    if (!totalCountData || !pageSize) return null;
    return Math.max(1, Math.ceil(totalCountData / pageSize));
  }, [totalCountData, pageSize]);

  const handleDownloadSelectedEventsCsv = async () => {
    if (!hasSelection || downloadingCsv) return;

    const ids = Array.from(selectedIds);

    try {
      setDownloadingCsv(true);

      const { data, error } = await supabase
        .from('images')
        .select('*')
        .in('id', ids);

      if (error) {
        throw error;
      }

      const rows = (data ?? []) as Record<string, unknown>[];

      if (rows.length === 0) {
        return;
      }

      const headerSet = new Set<string>();
      for (const row of rows) {
        Object.keys(row ?? {}).forEach((key) => headerSet.add(key));
      }

      const headerOrder = [
        'id',
        ...Array.from(headerSet)
          .filter((key) => key !== 'id')
          .sort((a, b) => a.localeCompare(b)),
      ];

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadCsv(`events-${timestamp}.csv`, rows, headerOrder);
    } catch (err) {
      console.error('Failed to download events CSV:', err);
    } finally {
      setDownloadingCsv(false);
    }
  };

  // Bulk actions for selected images
  const handleDeleteSelected = async () => {
    if (!hasSelection) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected image(s)?`)) return;

    const ids = Array.from(selectedIds);
    let promptIdsToDelete: string[] = [];

    try {
      const { data: relatedImageRows, error: relatedFetchError } = await supabase
        .from('images')
        .select('prompt_id')
        .in('id', ids);

      if (relatedFetchError) {
        console.error('Failed to fetch related prompts for selected images:', relatedFetchError);
      } else {
        const uniquePromptIds = new Set(
          (relatedImageRows ?? [])
            .map((row) => (typeof row.prompt_id === 'string' ? row.prompt_id.trim() : ''))
            .filter((value): value is string => Boolean(value?.length))
        );

        if (uniquePromptIds.size > 0) {
          const confirmCascade = window.confirm(
            `Also delete ${uniquePromptIds.size} related prompt${uniquePromptIds.size > 1 ? 's' : ''}? This cannot be undone.`
          );

          if (confirmCascade) {
            promptIdsToDelete = Array.from(uniquePromptIds);
          }
        }
      }

      const { error } = await supabase
        .from('images')
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Delete error:', error);
        return;
      }

      setSelectedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['images'] });

      if (promptIdsToDelete.length > 0) {
        const { error: promptDeleteError } = await supabase
          .from('prompts')
          .delete()
          .in('id', promptIdsToDelete);

        if (promptDeleteError) {
          console.error('Failed to delete related prompts:', promptDeleteError);
        } else {
          queryClient.invalidateQueries({ queryKey: ['prompts'] });
        }
      }
    } catch (err) {
      console.error('Unexpected error during image deletion:', err);
    }
  };

  const handleToggleReady = async () => {
    if (!hasSelection) return;
    const selectedImages = images?.filter(img => selectedIds.has(img.id)) || [];
    const updatePromises = selectedImages.map(img =>
      supabase.from('images').update({ ready: !img.ready }).eq('id', img.id)
    );
    await Promise.all(updatePromises);
    queryClient.invalidateQueries({ queryKey: ['images'] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load gallery</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-4 space-y-2">
          <div className="flex flex-wrap items-start gap-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Total Credits</div>
              <div className="text-lg font-semibold text-foreground">
                {totalsLoading ? '…' : totalsData ? formatCreditsTotal(totalsData.totalCredits) : '—'}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Total USD</div>
              <div className="text-lg font-semibold text-foreground">
                {totalsLoading ? '…' : totalsData ? formatDollarTotal(totalsData.totalDollars) : '—'}
              </div>
            </div>
          </div>
          {countsEnabled && (
            <div className="text-sm text-muted-foreground">
              Total images: {typeof totalCountData === 'number' ? totalCountData : '...'}
            </div>
          )}
          {totalsError && (
            <div className="text-xs text-destructive">Failed to load totals.</div>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Image Gallery</h1>
          <p className="text-muted-foreground">
            {totalCountData ?? '...'} images available • Select an image to view details
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[350px] flex-shrink-0">
            <div className="space-y-6 sticky top-6">
              <FiltersPanel
                state={filters}
                onApply={setFilters}
                onClear={() => setFilters({})}
                themeOptions={themeOptions}
                locationOptions={locationOptions}
                continentOptions={continentOptions}
                yearBounds={yearBoundsData}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-4 mb-2 sm:mb-0">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Prev</Button>
                <span className="text-sm">Page {page + 1} of {totalPages ?? '...'}</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages ?? 1}
                  value={page + 1}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 1 && totalPages && val <= totalPages) {
                      setPage(val - 1);
                    }
                  }}
                  className="w-16 px-2 py-1 border rounded text-sm ml-2"
                  style={{ width: '60px' }}
                />
                <Button variant="outline" size="sm" disabled={images && images.length < pageSize} onClick={() => setPage(p => p + 1)}>Next</Button>
                <Select value={pageSize.toString()} onValueChange={v => { setPageSize(parseInt(v)); setPage(0); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map(opt => <SelectItem key={opt} value={opt.toString()}>{opt}/page</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="secondary" size="sm" onClick={selectAllFiltered} disabled={!canDownloadImages}>Select All</Button>
                <Button variant="secondary" size="sm" onClick={clearSelection} disabled={!hasSelection}>Clear</Button>
                <Button variant="outline" size="sm" onClick={handleToggleReady} disabled={!hasSelection}>Toggle Ready</Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadSelectedEventsCsv}
                  disabled={!hasSelection || downloadingCsv}
                >
                  {downloadingCsv ? 'Preparing CSV…' : 'Download Selected CSV'}
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={!hasSelection}>
                  Delete Selected ({selectedIds.size})
                </Button>
              </div>
            </div>

            {!canDownloadImages ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No images yet</h3>
                <p className="text-muted-foreground">Generate your first image from the Prompts page!</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-4"}>
                {displayImages.map((image) => {
                  const imageSrc = getImageSource(image);
                  const isSelected = selectedIds.has(image.id);
                  return (
                    <Dialog key={image.id}>
                      <DialogTrigger asChild>
                        <Card className={`cursor-pointer hover:shadow-lg transition-all group relative ${viewMode === 'list' ? 'w-full' : ''}`}>
                          <CardContent className="p-0">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => toggleSelect(image.id, checked === true)}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-2 left-2 z-10 bg-background/80 rounded"
                            />
                            <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-2">
                              {image.ready ? (
                                <Badge className="bg-green-500 text-white">Ready</Badge>
                              ) : (
                                <Badge className="bg-red-500 text-white">Not Ready</Badge>
                              )}
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setFullscreenImage(image);
                                }}
                                title="View fullscreen"
                              >
                                <Maximize2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt={image.title || 'Generated image'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    console.error('Image failed to load:', image.id);
                                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Zap className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-sm line-clamp-2 mb-2">
                                {image.title || 'Untitled'}
                              </h3>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  {new Date(image.created_at).toLocaleDateString()}
                                </div>
                                {image.model && (
                                  <Badge variant="outline" className="text-xs">
                                    {getModelDisplayName(image.model) ?? image.model}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-end justify-between text-xs">
                                <div className="text-sm font-semibold text-foreground">
                                  {formatCostDisplay(image.cost, image.model)}
                                </div>
                                {image.model && (
                                  <span className="text-[11px] text-muted-foreground font-mono">
                                    {image.model}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{image.title || 'Untitled Image'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={image.title || 'Generated image'}
                                className="w-full rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = FULLSCREEN_FALLBACK_URL;
                                }}
                              />
                            ) : (
                              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                <Zap className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            {image.description && (
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">{image.description}</p>
                              </div>
                            )}

                            <div>
                              <h4 className="font-semibold mb-2">Prompt</h4>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{image.prompt}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="flex items-center gap-1 font-medium">
                                  <MapPin className="h-4 w-4" />
                                  Location
                                </div>
                                <p className="text-muted-foreground">{image.country ?? 'Not specified'}</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-1 font-medium">
                                  <CalendarDays className="h-4 w-4" />
                                  Year
                                </div>
                                <p className="text-muted-foreground">{image.year ?? 'Not specified'}</p>
                              </div>
                              <div className="col-span-2">
                                <div className="border-t border-border pt-4">
                                  <ImageSizeDisplay image={image} />
                                </div>
                              </div>
                              {image.width && image.height ? (
                                <div>
                                  <div className="font-medium">Dimensions</div>
                                  <p className="text-muted-foreground">{image.width} × {image.height}</p>
                                </div>
                              ) : null}
                              {image.model ? (
                                <div>
                                  <div className="font-medium">Model</div>
                                  <p className="text-muted-foreground">{image.model}</p>
                                </div>
                              ) : null}
                              {image.output_format && (
                                <div>
                                  <div className="font-medium">Format</div>
                                  <p className="text-muted-foreground">{image.output_format.toUpperCase()}</p>
                                </div>
                              )}
                              {typeof image.cfg_scale === 'number' && (
                                <div>
                                  <div className="font-medium">CFG Scale</div>
                                  <p className="text-muted-foreground">{image.cfg_scale}</p>
                                </div>
                              )}
                              {typeof image.steps === 'number' && (
                                <div>
                                  <div className="font-medium">Steps</div>
                                  <p className="text-muted-foreground">{image.steps}</p>
                                </div>
                              )}
                              {image.aspect_ratio && (
                                <div>
                                  <div className="font-medium">Aspect Ratio</div>
                                  <p className="text-muted-foreground">{image.aspect_ratio}</p>
                                </div>
                              )}
                              {image.cost !== null && (
                                <div>
                                  <div className="font-medium">{isReveModel(image.model) ? 'Credits' : 'Cost'}</div>
                                  <p className="text-muted-foreground">{formatCostDisplay(image.cost, image.model)}</p>
                                </div>
                              )}
                            </div>

                            {image.accuracy_score?.source === 'reve' && (
                              <div className="border border-dashed border-border rounded-lg p-4 space-y-2">
                                <h4 className="font-semibold text-sm">REVE Details</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <div className="font-medium">Request ID</div>
                                    <p className="text-muted-foreground">{image.accuracy_score.request_id ?? '—'}</p>
                                  </div>
                                  <div>
                                    <div className="font-medium">Credits Used</div>
                                    <p className="text-muted-foreground">{image.cost ?? image.accuracy_score.credits_used ?? '—'}</p>
                                  </div>
                                  <div>
                                    <div className="font-medium">Credits Remaining</div>
                                    <p className="text-muted-foreground">{image.accuracy_score.credits_remaining ?? '—'}</p>
                                  </div>
                                  <div>
                                    <div className="font-medium">Source</div>
                                    <p className="text-muted-foreground">{image.accuracy_score.source}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground">
                              Created: {new Date(image.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!fullscreenImage}
        onOpenChange={(open) => {
          if (!open) setFullscreenImage(null);
        }}
      >
        <DialogContent className="sm:max-w-[95vw] bg-black/90 border-0 p-0">
          {fullscreenImage && (
            <div className="flex items-center justify-center">
              <img
                src={getImageSource(fullscreenImage) ?? FULLSCREEN_FALLBACK_URL}
                alt={fullscreenImage.title || 'Fullscreen image'}
                className="h-[90vh] w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FULLSCREEN_FALLBACK_URL;
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
