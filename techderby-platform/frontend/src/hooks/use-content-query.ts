import { useQuery } from '@tanstack/react-query';
import { fetchEvents, fetchInsightBySlug, fetchInsights, fetchPartners, fetchProgrammes } from '../services/content-service';

export const useEvents = () => useQuery({ queryKey: ['events'], queryFn: fetchEvents });
export const usePartners = () => useQuery({ queryKey: ['partners'], queryFn: fetchPartners });
export const useInsights = () => useQuery({ queryKey: ['insights'], queryFn: fetchInsights });
export const useInsightBySlug = (slug: string) =>
	useQuery({
		queryKey: ['insight', slug],
		queryFn: () => fetchInsightBySlug(slug),
		enabled: slug.trim().length > 0,
	});
export const useProgrammes = () => useQuery({ queryKey: ['programmes'], queryFn: fetchProgrammes });
