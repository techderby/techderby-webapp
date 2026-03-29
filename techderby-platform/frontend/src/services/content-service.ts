import { z } from 'zod';
import { apiClient } from '../lib/api';
import type { Event, Insight, Partner, Programme } from '../types/content';

const preSeedAcceleratorEvent: Event = {
  id: 999001,
  title: 'TECH DERBY PRE-SEED ACCELERATOR',
  slug: 'tech-derby-pre-seed-accelerator',
  description:
    'An 8-week, clarity-led accelerator that takes early-stage founders from busy activity to validated learning, traction, and funding readiness.',
  date: '2026-04-10T09:00:00.000Z',
  venue: 'Game Changers Lab, Cavendish Building, University of Derby',
  eventSource: 'tech-derby',
  theme: 'Innovation',
  shortLine: 'Build with evidence. Pitch with confidence.',
  eventRegistrationLink: '/tech-derby-accelerator',
  agendaItems: [
    'Programme window: April 10 to May 29',
    'Cohort size: small by design (quality over volume)',
    'Mode of delivery: in-person',
    'Focus: validated learning, traction, and funding readiness',
  ],
};

const eventSpeakerCardSchema = z.object({
  name: z.string(),
  role: z.string(),
  organisation: z.string(),
  credibilityLine: z.string(),
  talkTitle: z.string(),
  outcomes: z.array(z.string()),
});

const eventSchema: z.ZodType<Event, z.ZodTypeDef, unknown> = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string(),
  venue: z.string(),
  eventSource: z.string().nullable().optional(),
  theme: z.string().nullable().optional(),
  shortLine: z.string().nullable().optional(),
  eventRegistrationLink: z.string().nullable().optional(),
  agenda: z.string().nullable().optional(),
  agendaItems: z.preprocess((value) => {
    if (!Array.isArray(value)) return undefined;
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }, z.array(z.string()).optional()),
  speakers: z.preprocess((value) => {
    if (!Array.isArray(value)) return undefined;
    return value
      .map((speaker) =>
        typeof speaker === 'string'
          ? speaker
          : (speaker as { name?: string })?.name,
      )
      .filter((speaker): speaker is string => Boolean(speaker));
  }, z.array(z.string()).optional()),
  speakerCards: z.preprocess((value) => {
    if (!Array.isArray(value)) return undefined;
    return value;
  }, z.array(eventSpeakerCardSchema).optional()),
  registrationLink: z.string().nullable().optional(),
});

const partnerSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.preprocess((value) => {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return undefined;

    const media = value as {
      url?: unknown;
      data?: {
        attributes?: {
          url?: unknown;
        };
      };
    };

    if (typeof media.url === 'string') return media.url;
    const nestedUrl = media.data?.attributes?.url;
    return typeof nestedUrl === 'string' ? nestedUrl : undefined;
  }, z.string().optional()),
  description: z.string(),
  website: z.string().optional(),
  partnerType: z.string().optional(),
  category: z.string().optional().default('community'),
});

const insightSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  featuredImage: z.preprocess((value) => {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';

    const media = value as {
      url?: unknown;
      data?:
        | {
            url?: unknown;
            attributes?: { url?: unknown };
          }
        | null;
    };

    if (typeof media.url === 'string') return media.url;
    if (typeof media.data?.url === 'string') return media.data.url;
    const nestedUrl = media.data?.attributes?.url;
    return typeof nestedUrl === 'string' ? nestedUrl : '';
  }, z.string()),
  content: z.string().optional().default(''),
  author: z.string().optional().default('Tech Derby'),
  tags: z.preprocess((value) => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    return [];
  }, z.array(z.string()).default([])),
  category: z.string().optional().default('General'),
  createdAt: z.string().optional(),
  publishedAt: z.string().optional(),
});

const programmeSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
});

function normalizeResponse<T>(payload: unknown, schema: z.ZodType<T, z.ZodTypeDef, unknown>): T[] {
  if (Array.isArray(payload)) {
    return z.array(schema).parse(payload);
  }

  const data = (payload as { data?: unknown })?.data;
  if (Array.isArray(data)) {
    type StrapiRecord = { id: number; attributes?: Record<string, unknown> } & Record<string, unknown>;
    return z.array(schema).parse(
      (data as StrapiRecord[]).map((item) => ({ id: item.id, ...(item.attributes ?? item) })),
    );
  }

  return [];
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await apiClient.getEvents();
  const events = normalizeResponse(response.data, eventSchema);
  const hasPreSeed = events.some((event) => event.slug === preSeedAcceleratorEvent.slug);
  return hasPreSeed ? events : [preSeedAcceleratorEvent, ...events];
}

export async function fetchPartners(): Promise<Partner[]> {
  const response = await apiClient.getPartners();
  return normalizeResponse(response.data, partnerSchema);
}

export async function fetchInsights(): Promise<Insight[]> {
  const response = await apiClient.getInsights();
  return normalizeResponse(response.data, insightSchema);
}

export async function fetchInsightBySlug(slug: string): Promise<Insight | null> {
  const response = await apiClient.getInsightBySlug(slug);
  const items = normalizeResponse(response.data, insightSchema);
  return items[0] ?? null;
}

export async function fetchProgrammes(): Promise<Programme[]> {
  const response = await apiClient.getProgrammes();
  return normalizeResponse(response.data, programmeSchema);
}

export async function createMailingListSubscription(email: string): Promise<void> {
  await apiClient.createMailingListSubscription(email);
}
