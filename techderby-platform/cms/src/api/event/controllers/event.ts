import { factories } from '@strapi/strapi';
import { notifyEventSubscribers } from '../content-types/event/lifecycles';

const EVENT_UID = 'api::event.event';
const ADMIN_ROLES = new Set(['admin', 'super-admin']);
const MAX_EVENT_IMAGE_SIZE = 8 * 1024 * 1024;
const EVENT_IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

class EventInputError extends Error {}

async function requireAdmin(ctx: any) {
  const userId = ctx.state.user?.id;
  if (!userId) {
    ctx.unauthorized('You must be logged in.');
    return null;
  }

  const user = await strapi.db.connection('up_users').where({ id: userId }).first();
  const memberRole = user?.memberRole ?? user?.member_role;
  if (!ADMIN_ROLES.has(memberRole)) {
    ctx.forbidden('Administrator access is required.');
    return null;
  }

  return user;
}

function field(value: unknown) {
  return String(Array.isArray(value) ? value[0] ?? '' : value ?? '').trim();
}

function makeSlug(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function uniqueSlug(title: string) {
  const base = makeSlug(title) || `event-${Date.now()}`;
  let slug = base;
  let suffix = 2;

  while (await strapi.db.query(EVENT_UID).findOne({ where: { slug }, select: ['id'] })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function isSupportedLink(value: string) {
  if (!value || value.startsWith('/')) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseEventData(body: Record<string, unknown> = {}) {
  const title = field(body.title);
  const description = field(body.description);
  const date = field(body.date);
  const venue = field(body.venue);
  const eventSource = field(body.eventSource) || 'tech-derby';
  const theme = field(body.theme);
  const shortLine = field(body.shortLine);
  const registrationLink = field(body.registrationLink);
  const agenda = field(body.agenda);

  if (!title || !description || !date || !venue) {
    throw new EventInputError('Title, description, date and venue are required.');
  }
  if (title.length > 200) throw new EventInputError('The title must be 200 characters or fewer.');
  if (description.length > 10_000) throw new EventInputError('The description is too long.');
  if (shortLine.length > 500) throw new EventInputError('The short summary must be 500 characters or fewer.');
  if (/[<>]/.test(agenda)) throw new EventInputError('Use plain text or Markdown for the agenda; HTML is not allowed.');
  if (!['tech-derby', 'other'].includes(eventSource)) throw new EventInputError('Invalid event source.');
  if (!isSupportedLink(registrationLink)) {
    throw new EventInputError('The registration link must be an HTTP(S) URL or a site-relative path.');
  }

  const eventDate = new Date(date);
  if (Number.isNaN(eventDate.getTime())) throw new EventInputError('Enter a valid event date and time.');

  return {
    title,
    description,
    date: eventDate.toISOString(),
    venue,
    eventSource,
    theme: theme || null,
    shortLine: shortLine || null,
    eventRegistrationLink: registrationLink || null,
    registrationLink: registrationLink || null,
    agenda: agenda || null,
  };
}

function uploadedImage(ctx: any) {
  const supplied =
    ctx.request.files?.featuredImage ??
    ctx.request.files?.image ??
    ctx.request.files?.files;
  return (Array.isArray(supplied) ? supplied[0] : supplied) as any;
}

function storeEventImage(image: any) {
  if (!image) throw new EventInputError("Upload a featured image using the 'featuredImage' form-data field.");

  const mimeType = String(image.mimetype ?? image.type ?? '');
  const extension = EVENT_IMAGE_EXTENSIONS[mimeType];
  if (!extension) throw new EventInputError('Only JPEG, PNG and WebP event images are allowed.');
  if (Number(image.size ?? 0) > MAX_EVENT_IMAGE_SIZE) {
    throw new EventInputError('The featured image must be 8 MB or smaller.');
  }

  const sourcePath = image.filepath ?? image.path;
  if (!sourcePath) throw new EventInputError('The uploaded image could not be read.');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');

  const uploadDir = path.join(strapi.dirs.static.public, 'uploads', 'events');
  fs.mkdirSync(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`;
  const destination = path.join(uploadDir, filename);
  fs.copyFileSync(sourcePath, destination);

  return {
    publicPath: `/uploads/events/${filename}`,
    destination,
  };
}

function removeStoredFile(destination?: string) {
  if (!destination) return;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  if (fs.existsSync(destination)) fs.unlinkSync(destination);
}

function removeOldEventImage(publicPath?: string | null) {
  if (!publicPath?.startsWith('/uploads/events/')) return;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  const filename = path.basename(publicPath);
  const destination = path.join(strapi.dirs.static.public, 'uploads', 'events', filename);
  if (fs.existsSync(destination)) fs.unlinkSync(destination);
}

export default factories.createCoreController(EVENT_UID, ({ strapi }) => ({
  async listForAdmin(ctx) {
    if (!(await requireAdmin(ctx))) return;

    const documents = strapi.documents(EVENT_UID) as any;
    const events = await documents.findMany({
      status: 'published',
      sort: { date: 'asc' },
    });

    ctx.body = { data: events };
  },

  async createForAdmin(ctx) {
    if (!(await requireAdmin(ctx))) return;

    let storedImage: { publicPath: string; destination: string } | undefined;
    try {
      const data = parseEventData(ctx.request.body);
      storedImage = storeEventImage(uploadedImage(ctx));
      const documents = strapi.documents(EVENT_UID) as any;
      const created = await documents.create({
        status: 'published',
        data: {
          ...data,
          slug: await uniqueSlug(data.title),
          featuredImage: storedImage.publicPath,
        },
      });

      ctx.status = 201;
      ctx.body = { data: created };
    } catch (error) {
      removeStoredFile(storedImage?.destination);
      if (error instanceof EventInputError) return ctx.badRequest(error.message);
      strapi.log.error('[events] Failed to create event from the dashboard', error);
      return ctx.internalServerError('The event could not be created.');
    }
  },

  async updateForAdmin(ctx) {
    if (!(await requireAdmin(ctx))) return;

    const documentId = field(ctx.params?.documentId);
    if (!documentId) return ctx.badRequest('An event document ID is required.');

    const documents = strapi.documents(EVENT_UID) as any;
    const existing =
      await documents.findOne({ documentId, status: 'published' }) ??
      await documents.findOne({ documentId, status: 'draft' });
    if (!existing) return ctx.notFound('Event not found.');

    let storedImage: { publicPath: string; destination: string } | undefined;
    try {
      const data = parseEventData(ctx.request.body);
      const image = uploadedImage(ctx);
      if (image) storedImage = storeEventImage(image);

      await documents.update({
        documentId,
        data: {
          ...data,
          slug: existing.slug,
          featuredImage: storedImage?.publicPath ?? existing.featuredImage,
          // Prevent the publish lifecycle from treating this edit as a brand-new event.
          // A dedicated branded update notification is sent immediately after publish.
          mailingListNotifiedAt: existing.mailingListNotifiedAt ?? new Date().toISOString(),
        },
      });
      await documents.publish({ documentId });
      const updated = await documents.findOne({ documentId, status: 'published' });
      await notifyEventSubscribers(updated, {
        shouldNotify: true,
        force: true,
        kind: 'updated',
      });

      if (storedImage && existing.featuredImage !== storedImage.publicPath) {
        removeOldEventImage(existing.featuredImage);
      }

      ctx.body = { data: updated };
    } catch (error) {
      removeStoredFile(storedImage?.destination);
      if (error instanceof EventInputError) return ctx.badRequest(error.message);
      strapi.log.error(`[events] Failed to update event ${documentId} from the dashboard`, error);
      return ctx.internalServerError('The event could not be updated.');
    }
  },
}));
