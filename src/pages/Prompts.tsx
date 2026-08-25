
import { useEffect, useMemo, useState } from "react";
import FiltersPanel from "@/components/filters/FiltersPanel";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { downloadCsv } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Sparkles, MapPin, Calendar, Loader2, Trash, LayoutGrid, List } from "lucide-react";
import { GenerationSettingsPanel } from "@/components/generate/GenerationSettingsPanel";
import { useToast } from "@/hooks/use-toast";
import { generateImage } from "@/services/imageGeneration";
import { PromptDetailsDialog } from "@/components/prompt/PromptDetailsDialog";
import { useSharedPromptGalleryState } from "@/hooks/useSharedPromptGalleryState";

interface Prompt {
  id: string;
  title: string | null;
  description: string | null;
  prompt: string;
  negative_prompt: string | null;
  country: string | null;
  year: number | null;
  has_full_hints: boolean | null;
  celebrity: boolean | null;
  approx_people_count: number | null;
  confidence: number | null;
  theme: string | null;
  real_event: string | null;
  manually_used: boolean | null;
  continent?: string | null;
  images?: { id: string; cost: number | null }[]; // joined images to infer usage
  [key: string]: unknown;
}

interface GenerationSettings {
  model: string;
  steps: number;
  cfgScale: number;
  width: number;
  height: number;
  imageType: 'webp' | 'png' | 'jpg';
}

const defaultSettings: GenerationSettings = {
  model: "bfl:4@1", // default Runware BFL model
  steps: 20,
  cfgScale: 2,
  width: 1568,
  height: 672,
  imageType: "webp",
};

const EXCLUDED_CSV_COLUMNS = new Set([
  "ai_generated",
  "auth_last_checked_at",
  "authenticity_confidence",
  "authenticity_verdict",
  "is_ready",
  "last_verified",
  "manually_used",
  "negative_prompt",
  "used",
  "verification_citations",
  "verification_explanation",
  "verification_models",
  "verification_report",
  "verification_source_count",
  "verification_sources",
  "verified_by",
]);

const Prompts = () => {
  const pageSizeOptions = [10, 25, 50, 100, 150, 200];
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState<number>(0);
  const { searchTerm, setSearchTerm, filters, setFilters } = useSharedPromptGalleryState();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [generationSettings, setGenerationSettings] =
    useState<GenerationSettings>(defaultSettings);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const zeroCostFilterActive = !!filters.zeroCostOnly;

  const relationalSelect = useMemo(() => {
    if (zeroCostFilterActive || (filters.usedStatus && filters.usedStatus !== 'all')) {
      return 'images!inner(id, cost, optimized_image_url)';
    }
    return 'images(id, cost, optimized_image_url)';
  }, [zeroCostFilterActive, filters.usedStatus]);

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

  const { data: filterOptionsData } = useQuery({
    queryKey: ['prompts-filter-options'],
    queryFn: async () => {
      const normalize = (rows: Record<string, unknown>[] | null | undefined, key: string) =>
        (rows ?? [])
          .map((row) => row[key] as string | null)
          .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
          .map((value) => value.trim())
          .sort((a, b) => a.localeCompare(b));

      const [themeResult, locationResult, continentResult] = await Promise.all([
        supabase
          .from('prompts')
          .select('theme')
          .not('theme', 'is', null),
        supabase
          .from('prompts')
          .select('country')
          .not('country', 'is', null),
        supabase
          .from('prompts')
          .select('continent:1_where_continent')
          .not('1_where_continent', 'is', null),
      ]);

      if (themeResult.error) throw themeResult.error;
      if (locationResult.error) throw locationResult.error;
      if (continentResult.error) throw continentResult.error;

      return {
        themes: normalize(themeResult.data, 'theme'),
        locations: normalize(locationResult.data, 'country'),
        continents: normalize(continentResult.data, 'continent'),
      } as const;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Fetch total count of prompts matching filters
  const { data: totalCountData } = useQuery({
    queryKey: ['prompts-count', filters, searchTerm],
    queryFn: async () => {
      const selectForCount = `id, ${relationalSelect}`;

      let query = supabase
        .from('prompts')
        .select(selectForCount, { count: 'exact', head: true });

      if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);
      if (filters.theme) query = query.eq('theme', filters.theme);
      if (filters.location) query = query.eq('country', filters.location);
      if (filters.continent) query = query.eq('1_where_continent', filters.continent);
      if (filters.yearRange) {
        const [minYear, maxYear] = filters.yearRange;
        query = query.gte('year', minYear).lte('year', maxYear);
      }
      if (filters.dateCreatedRange) {
        const [fromTs, toTs] = filters.dateCreatedRange;
        query = query
          .gte('created_at', new Date(fromTs).toISOString())
          .lte('created_at', new Date(toTs).toISOString());
      }
      if (filters.numberPeopleRange) {
        const [minP, maxP] = filters.numberPeopleRange;
        query = query.gte('approx_people_count', minP).lte('approx_people_count', maxP);
      }
      if (filters.confidenceRange) {
        const [minC, maxC] = filters.confidenceRange;
        query = query.gte('confidence', minC).lte('confidence', maxC);
      }
      if (filters.celebrityOnly) query = query.eq('celebrity', true);
      if (filters.realEventStatus === 'true') query = query.eq('real_event', 'true');
      else if (filters.realEventStatus === 'fictional') query = query.eq('real_event', 'false');
      if (filters.hasFullHints) query = query.eq('has_full_hints', true);
      if (filters.usedStatus === 'unused') {
        query = query.filter('images.id', 'is', null);
      } else if (filters.usedStatus === 'used') {
        query = query.filter('images.id', 'not.is', null).filter('images.optimized_image_url', 'not.is', null);
      } else if (filters.usedStatus === 'failed') {
        query = query
          .filter('images.id', 'not.is', null)
          .filter('images.optimized_image_url', 'is', null)
          .eq('manually_used', false);
      }
      if (zeroCostFilterActive) query = query.filter('images.cost', 'eq', 0);

      const { count, error } = await query;
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 30000,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const { data: prompts, isLoading, error } = useQuery({
    queryKey: ['prompts', page, pageSize, filters, searchTerm],
    queryFn: async () => {
      const imageSelect = relationalSelect;

      let query = supabase
        .from('prompts')
        .select(`id, title, description, prompt, negative_prompt, country, year, has_full_hints, confidence, theme, celebrity, approx_people_count, real_event, manually_used, continent:"1_where_continent", ${imageSelect}`)
        .order('created_at', { ascending: false });

      if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);
      if (filters.theme) query = query.eq('theme', filters.theme);
      if (filters.location) query = query.eq('country', filters.location);
      if (filters.continent) query = query.eq('1_where_continent', filters.continent);
      if (filters.yearRange) {
        const [minYear, maxYear] = filters.yearRange;
        query = query.gte('year', minYear).lte('year', maxYear);
      }
      if (filters.dateCreatedRange) {
        const [fromTs, toTs] = filters.dateCreatedRange;
        query = query
          .gte('created_at', new Date(fromTs).toISOString())
          .lte('created_at', new Date(toTs).toISOString());
      }
      if (filters.numberPeopleRange) {
        const [minP, maxP] = filters.numberPeopleRange;
        query = query.gte('approx_people_count', minP).lte('approx_people_count', maxP);
      }
      if (filters.confidenceRange) {
        const [minC, maxC] = filters.confidenceRange;
        query = query.gte('confidence', minC).lte('confidence', maxC);
      }
      if (filters.celebrityOnly) query = query.eq('celebrity', true);
      if (filters.realEventStatus === 'true') query = query.eq('real_event', 'true');
      else if (filters.realEventStatus === 'fictional') query = query.eq('real_event', 'false');
      if (filters.hasFullHints) query = query.eq('has_full_hints', true);
      if (filters.usedStatus === 'unused') {
        query = query.is('images', null);
      } else if (filters.usedStatus === 'used') {
        query = query.not('images', 'is', null).filter('images.optimized_image_url', 'not.is', null);
      } else if (filters.usedStatus === 'failed') {
        query = query
          .not('images', 'is', null)
          .filter('images.optimized_image_url', 'is', null)
          .eq('manually_used', false);
      }
      if (zeroCostFilterActive) query = query.filter('images.cost', 'eq', 0);

      query = query.range(page * pageSize, (page + 1) * pageSize - 1);

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching prompts:', error);
        throw error;
      }
      return data as Prompt[];
    },
    staleTime: 30000,
    retry: false,
    placeholderData: keepPreviousData,
  });

  // Selection helpers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedIds(new Set(filteredPrompts.map(p => p.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const applyPromptPatch = (promptId: string, updates: Partial<Prompt>) => {
    queryClient.setQueryData(
      ['prompts', page, pageSize, filters, searchTerm],
      (oldData: Prompt[] | undefined) =>
        oldData?.map((p) => (p.id === promptId ? { ...p, ...updates } : p))
    );
  };

  const handleDownloadSelectedEventsCsv = async () => {
    if (selectedIds.size === 0 || downloadingCsv) return;

    const ids = Array.from(selectedIds);

    try {
      setDownloadingCsv(true);

      const chunkSize = 100;
      const rows: Record<string, unknown>[] = [];

      for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .in('id', chunk)
          .limit(chunk.length);

        if (error) {
          throw error;
        }

        rows.push(...((data ?? []) as Record<string, unknown>[]));
      }

      const rowsById = rows.reduce<Map<string, Record<string, unknown>>>((acc, row) => {
        const id = String(row.id ?? '');
        if (id) acc.set(id, row);
        return acc;
      }, new Map());

      const orderedRows = ids
        .map((id) => rowsById.get(id))
        .filter((row): row is Record<string, unknown> => Boolean(row));

      if (orderedRows.length === 0) {
        return;
      }

      const headerSet = new Set<string>();
      for (const row of orderedRows) {
        Object.keys(row ?? {})
          .filter((key) => !EXCLUDED_CSV_COLUMNS.has(key))
          .forEach((key) => headerSet.add(key));
      }

      const headerOrder = [
        'id',
        ...Array.from(headerSet)
          .filter((key) => key !== 'id')
          .sort((a, b) => a.localeCompare(b)),
      ];

      const numericYears = orderedRows
        .map((row) => {
          const raw = row['year'];
          if (typeof raw === 'number' && Number.isFinite(raw)) {
            return raw;
          }
          if (typeof raw === 'string') {
            const trimmed = raw.trim();
            if (trimmed.length === 0) return null;
            const parsed = Number(trimmed);
            return Number.isFinite(parsed) ? parsed : null;
          }
          return null;
        })
        .filter((value): value is number => value !== null);

      const yearLabel = numericYears.length > 0
        ? (() => {
            const minYear = Math.min(...numericYears);
            const maxYear = Math.max(...numericYears);
            return `${minYear} to ${maxYear}`;
          })()
        : 'unknown to unknown';

      downloadCsv(`${yearLabel}.csv`, orderedRows, headerOrder);
    } catch (err) {
      console.error('Failed to download events CSV:', err);
    } finally {
      setDownloadingCsv(false);
    }
  };

  const handleGenerateSelected = async () => {
    if (selectedIds.size === 0) return;
    setBulkGenerating(true);
    // Sequential generation to avoid API throttling
    for (const prompt of filteredPrompts.filter(p => selectedIds.has(p.id))) {
      await handleGenerate(prompt, generationSettings);
    }
    setBulkGenerating(false);
    clearSelection();
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    // simple confirm to avoid accidental deletions
    const confirmDelete = window.confirm(`Delete ${selectedIds.size} selected prompt(s)? This cannot be undone.`);
    if (!confirmDelete) return;

    const ids = Array.from(selectedIds);
    let imageIdsToDelete: string[] = [];

    try {
      setBulkDeleting(true);

      const { data: relatedImageRows, error: relatedFetchError } = await supabase
        .from('images')
        .select('id')
        .in('prompt_id', ids);

      if (relatedFetchError) {
        console.error('Failed to fetch related images for selected prompts:', relatedFetchError);
      } else {
        const uniqueImageIds = new Set(
          (relatedImageRows ?? [])
            .map((row) => (typeof row.id === 'string' ? row.id.trim() : ''))
            .filter((value): value is string => Boolean(value?.length))
        );

        if (uniqueImageIds.size > 0) {
          const confirmCascade = window.confirm(
            `Also delete ${uniqueImageIds.size} related image${uniqueImageIds.size > 1 ? 's' : ''}? This cannot be undone.`
          );

          if (confirmCascade) {
            imageIdsToDelete = Array.from(uniqueImageIds);
          }
        }
      }

      const { error } = await supabase
        .from('prompts')
        .delete()
        .in('id', ids);

      if (error) throw error;

      // Optimistically update local cache for current page query
      queryClient.setQueryData(
        ['prompts', page, pageSize, filters, searchTerm],
        (oldData: Prompt[] | undefined) => oldData?.filter(p => !selectedIds.has(p.id))
      );

      // Invalidate list and count queries
      queryClient.invalidateQueries({ queryKey: ['prompts', page, pageSize, filters, searchTerm] });
      queryClient.invalidateQueries({ queryKey: ['prompts-count', filters, searchTerm] });

      if (imageIdsToDelete.length > 0) {
        const { error: imageDeleteError } = await supabase
          .from('images')
          .delete()
          .in('id', imageIdsToDelete);

        if (imageDeleteError) {
          console.error('Failed to delete related images:', imageDeleteError);
        } else {
          queryClient.invalidateQueries({ queryKey: ['images'] });
        }
      }

      toast({
        title: 'Deleted',
        description: `${ids.length} prompt${ids.length > 1 ? 's' : ''} deleted successfully`,
      });

      clearSelection();
    } catch (err) {
      console.error('Bulk delete error:', err);
      toast({
        title: 'Delete Failed',
        description: err instanceof Error ? err.message : 'There was an error deleting prompts',
        variant: 'destructive',
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  const filteredPrompts = useMemo(() => prompts || [], [prompts]);

  const themeOptions = useMemo(() => {
    const base = filterOptionsData?.themes ?? [];
    const fallback = filteredPrompts
      .map((prompt) => prompt.theme)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());
    const current = filters.theme && filters.theme.trim().length > 0 ? [filters.theme.trim()] : [];
    return Array.from(new Set([...base, ...fallback, ...current])).sort((a, b) => a.localeCompare(b));
  }, [filterOptionsData, filteredPrompts, filters.theme]);

  const locationOptions = useMemo(() => {
    const base = filterOptionsData?.locations ?? [];
    const fallback = filteredPrompts
      .map((prompt) => prompt.country)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());
    const current = filters.location && filters.location.trim().length > 0 ? [filters.location.trim()] : [];
    return Array.from(new Set([...base, ...fallback, ...current])).sort((a, b) => a.localeCompare(b));
  }, [filterOptionsData, filteredPrompts, filters.location]);

  const continentOptions = useMemo(() => {
    const base = filterOptionsData?.continents ?? [];
    const fallback = filteredPrompts
      .map((prompt) => prompt.continent)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());
    const current = filters.continent && filters.continent.trim().length > 0 ? [filters.continent.trim()] : [];
    return Array.from(new Set([...base, ...fallback, ...current])).sort((a, b) => a.localeCompare(b));
  }, [filterOptionsData, filteredPrompts, filters.continent]);

  const toggleRealEvent = async (prompt: Prompt, isRealEvent: boolean) => {
    console.log('Toggling real_event:', { promptId: prompt.id, currentValue: prompt.real_event, newValue: isRealEvent });
    
    try {
      const { data, error } = await supabase
        .from('prompts')
        .update({ real_event: isRealEvent ? 'true' : 'false' })
        .eq('id', prompt.id)
        .select()
        .single();
      
      console.log('Update response:', { data, error });
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      // Update the local state to reflect the change
      queryClient.setQueryData(
        ['prompts', page, pageSize, filters, searchTerm],
        (oldData: Prompt[] | undefined) => {
          const newData = oldData?.map(p =>
            p.id === prompt.id ? { ...p, real_event: isRealEvent ? 'true' : 'false' } : p
          );
          console.log('Updated local state:', newData?.find(p => p.id === prompt.id));
          return newData;
        }
      );
      
      toast({
        title: isRealEvent ? "Marked as Real Event" : "Marked as Not a Real Event",
        description: isRealEvent 
          ? "This prompt is now marked as a real event" 
          : "This prompt is no longer marked as a real event"
      });
    } catch (error) {
      console.error('Error updating prompt status:', error);
      toast({
        title: "Update Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async (prompt: Prompt, settings: GenerationSettings) => {
    setGeneratingId(prompt.id);
    
    toast({
      title: "Generation Started",
      description: `Generating image for: ${prompt.title || 'Untitled prompt'}`,
    });

    try {
      const result = await generateImage({
        promptId: prompt.id,
        prompt: prompt.prompt,
        title: prompt.title || undefined,
        description: prompt.description || undefined,
        negative_prompt: prompt.negative_prompt || undefined,
        model: settings.model,
        steps: settings.steps,
        cfgScale: settings.cfgScale,
        width: settings.width,
        height: settings.height,
        imageType: settings.imageType,
      });

      if (result.success) {
        toast({
          title: "Generation Complete",
          description: "Image has been generated and saved to gallery",
        });
        
        // Invalidate the images query to refresh the gallery
        queryClient.invalidateQueries({ queryKey: ['images'] });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating the image",
        variant: "destructive",
      });
    } finally {
      setGeneratingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading prompts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load prompts</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Prompt Library</h1>
          <p className="text-muted-foreground">
            {totalCountData ?? '...'} prompts available • Select a prompt to generate an image
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column for filters and settings */}
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
              <GenerationSettingsPanel
                settings={generationSettings}
                onSettingsChange={setGenerationSettings}
              />
            </div>
          </div>

          {/* Right column for prompts grid */}
          <div className="flex-1">
            <div className="mb-3 text-sm text-muted-foreground">
              Showing {totalCountData === undefined
                ? '...'
                : `${totalCountData.toLocaleString()} filtered result${totalCountData === 1 ? '' : 's'}`}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              {/* Pagination & Page size */}
              <div className="flex items-center gap-4 mb-2 sm:mb-0">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Prev</Button>
                <span className="text-sm">Page {page + 1} of {totalCountData && pageSize ? Math.max(1, Math.ceil(totalCountData / pageSize)) : '...'}</span>
                <Input
                  type="number"
                  min={1}
                  max={totalCountData && pageSize ? Math.max(1, Math.ceil(totalCountData / pageSize)) : 1}
                  value={page + 1}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (!Number.isNaN(val) && val >= 1 && totalCountData && pageSize && val <= Math.ceil(totalCountData / pageSize)) {
                      setPage(val - 1);
                    }
                  }}
                  className="w-16 px-2 py-1 border rounded text-sm"
                />
                <Button variant="outline" size="sm" disabled={prompts && prompts.length < pageSize} onClick={() => setPage(p => p + 1)}>Next</Button>
                <Select value={pageSize.toString()} onValueChange={v => { setPageSize(parseInt(v, 10)); setPage(0); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map(opt => (
                      <SelectItem key={opt} value={opt.toString()}>{opt}/page</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                <Button variant="secondary" size="sm" onClick={selectAllFiltered} disabled={filteredPrompts.length === 0}>Select All</Button>
                <Button variant="secondary" size="sm" onClick={clearSelection} disabled={selectedIds.size === 0}>Clear</Button>
                <Button size="sm" onClick={handleGenerateSelected} disabled={selectedIds.size === 0 || bulkGenerating}>
                  {bulkGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating ({selectedIds.size})
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate ({selectedIds.size})
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadSelectedEventsCsv}
                  disabled={selectedIds.size === 0 || downloadingCsv}
                >
                  {downloadingCsv ? 'Preparing CSV…' : `Download Selected (${selectedIds.size})`}
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={selectedIds.size === 0 || bulkDeleting}>
                  {bulkDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting ({selectedIds.size})
                    </>
                  ) : (
                    <>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete ({selectedIds.size})
                    </>
                  )}
                </Button>
              </div>
            </div>

            {!filteredPrompts || filteredPrompts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {searchTerm ? "No prompts found matching your search." : "No prompts available."}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
                {filteredPrompts.map((prompt) => (
                  <PromptDetailsDialog
                    key={prompt.id}
                    prompt={prompt}
                    onPromptUpdated={(updates) => applyPromptPatch(prompt.id, updates)}
                    trigger={
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={e => {
                          const target = e.target as HTMLElement;
                          if (target.closest("button") || target.closest("input[type='checkbox']")) {
                            e.preventDefault();
                            return;
                          }
                        }}
                      >
                        <Card className={`hover:shadow-lg transition-shadow relative group h-full flex flex-col ${viewMode === 'list' ? 'w-full' : ''}`}>
                          <Checkbox
                            className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm"
                            checked={selectedIds.has(prompt.id)}
                            onCheckedChange={() => toggleSelect(prompt.id)}
                            onClick={e => e.stopPropagation()}
                          />
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2">
                                  {prompt.title || 'Untitled Prompt'}
                                </CardTitle>
                                {prompt.description && (
                                  <CardDescription className="mt-2 line-clamp-3">
                                    {prompt.description}
                                  </CardDescription>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`real-event-${prompt.id}`}
                                    checked={prompt.real_event === 'true'}
                                    onCheckedChange={(checked) => toggleRealEvent(prompt, checked)}
                                    className="data-[state=checked]:bg-green-500"
                                  />
                                  <Label htmlFor={`real-event-${prompt.id}`} className="text-xs">
                                    {prompt.real_event === 'true' ? 'Real Event' : 'Not Real'}
                                  </Label>
                                </div>
                                <Badge variant={prompt.real_event === 'true' ? 'success' : 'destructive'} className="shrink-0">
                                  {prompt.real_event === 'true' ? 'Real' : 'Fictional'}
                                </Badge>
                                {typeof prompt.confidence === 'number' && (
                                  <Badge variant="outline" className="shrink-0">Confidence: {prompt.confidence}</Badge>
                                )}
                                {(prompt.images && prompt.images.length > 0) && (
                                  <Badge variant="success" className="shrink-0">
                                    Used
                                  </Badge>
                                )}
                                {prompt.manually_used && (
                                  <Badge variant="outline" className="shrink-0">
                                    Marked OK
                                  </Badge>
                                )}
                                {prompt.has_full_hints && (
                                  <Badge variant="secondary" className="shrink-0">
                                    Complete
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between">
                            <p className="text-sm text-muted-foreground line-clamp-3 bg-muted p-2 rounded mb-4">
                              {prompt.prompt}
                            </p>
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2 text-xs">
                                {prompt.country && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {prompt.country}
                                  </div>
                                )}
                                {prompt.year && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {prompt.year}
                                  </div>
                                )}
                                {prompt.theme && (
                                  <Badge variant="outline" className="text-xs">
                                    {prompt.theme}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                onClick={e => { e.stopPropagation(); handleGenerate(prompt, generationSettings); }}
                                disabled={generatingId === prompt.id}
                                className="w-full"
                              >
                                {generatingId === prompt.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Image
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
;

export default Prompts;
