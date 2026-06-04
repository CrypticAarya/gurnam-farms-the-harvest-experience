import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export type NewsletterSubscriberInsert = {
  email: string;
};

export type NewsletterSubscriberRow = NewsletterSubscriberInsert & {
  id: number;
  created_at: string;
};

export type ReservationInsert = {
  full_name: string;
  phone_number: string;
  email: string;
  delivery_area: string;
  address: string;
  selected_vegetables: string[];
  notes?: string;
  profile_id?: string | null;
};

export type ReservationRow = ReservationInsert & {
  id: number;
  created_at: string;
};

export type HarvestReservationInsert = {
  name: string;
  email: string;
  phone: string;
  city: string;
  notes?: string;
};

export type HarvestReservationRow = HarvestReservationInsert & {
  id: number;
  profile_id?: string | null;
  created_at: string;
};

export type ContactSubmissionInsert = {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

export type ContactSubmissionRow = ContactSubmissionInsert & {
  id: number;
  profile_id?: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  city?: string | null;
  role: "admin" | "customer";
  created_at: string;
};

export type RecentActivityItem = {
  id: number;
  source: "contact" | "reservation" | "subscriber";
  title: string;
  email: string;
  created_at: string;
  details: string;
};

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function formatSupabaseError(err: any) {
  try {
    if (!err) return "Unknown Supabase error";
    const parts: string[] = [];
    if (err.message) parts.push(err.message);
    if (err.details) parts.push(String(err.details));
    if (err.hint) parts.push(String(err.hint));
    if (err.code) parts.push(`code=${err.code}`);
    return parts.join(" — ");
  } catch (e) {
    return String(err);
  }
}

function throwSupabaseError(err: any) {
  const msg = formatSupabaseError(err);
  logger.error("Supabase Error", { error: msg });
  throw new Error(msg);
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throwSupabaseError(error);
  return data.session;
}

// Check if user is admin based on profile role
export async function isAdmin(userId?: string) {
  try {
    logger.info("[isAdmin] Checking admin status", { userId });
    const profile = await getProfile(userId);
    const isAdminUser = profile?.role === "admin";
    logger.info("[isAdmin] Admin check result", {
      userId,
      profileExists: !!profile,
      role: profile?.role,
      isAdmin: isAdminUser,
    });
    return isAdminUser;
  } catch (error) {
    logger.error("[isAdmin] Error checking admin status", { err: String(error) });
    return false;
  }
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  const { data, error } = await supabase.from<Profile>("profiles").upsert(profile).select().maybeSingle();
  if (error) throwSupabaseError(error);
  return data as Profile | null;
}

export async function getProfile(userId?: string) {
  if (!userId) {
    const user = await supabase.auth.getUser();
    userId = user.data.user?.id ?? undefined;
  }

  if (!userId) {
    logger.warn("[getProfile] No userId provided or found");
    return null;
  }
  logger.info("[getProfile] Fetching profile", { userId });
  const { data, error } = await supabase.from<Profile>("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) {
    logger.error("[getProfile] Error fetching profile", { err: formatSupabaseError(error) });
    throwSupabaseError(error);
  }
  
  logger.info("[getProfile] Profile fetched", {
    id: data?.id,
    role: data?.role,
    exists: !!data,
  });
  return data ?? null;
}

export async function getUserRole(userId?: string) {
  const profile = await getProfile(userId);
  return profile?.role ?? null;
}

export async function signUpCustomer({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throwSupabaseError(error);
  }

  // Profile will be created automatically by Supabase trigger when the user
  // is confirmed in auth.users. The trigger sets:
  // - role='admin' if email is 'sarthakghoderao@gmail.com'
  // - role='customer' for all other emails
}

export async function signInCustomer({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throwSupabaseError(error);
}

export async function signInAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throwSupabaseError(error);
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throwSupabaseError(error);
}

export async function submitNewsletterSubscriber(
  subscriber: NewsletterSubscriberInsert
) {
  const { data, error } = await supabase
    .from<NewsletterSubscriberRow>("newsletter_subscribers")
    .insert(subscriber)
    .select();
  if (error) throwSupabaseError(error);
  return data;
}

async function getCurrentUserId() {
  const u = await supabase.auth.getUser();
  if (u.error) throwSupabaseError(u.error);
  return u.data.user?.id ?? null;
}

export async function submitHarvestReservation(
  reservation: HarvestReservationInsert
) {
  const profileId = await getCurrentUserId();
  const payload = { ...reservation, profile_id: profileId } as any;

  const { data, error } = await supabase
    .from<HarvestReservationRow>("harvest_reservations")
    .insert(payload)
    .select();
  if (error) throwSupabaseError(error);
  return data;
}

export async function submitContactSubmission(
  submission: ContactSubmissionInsert
) {
  const profileId = await getCurrentUserId();
  const payload = { ...submission, profile_id: profileId } as any;

  const { data, error } = await supabase
    .from<ContactSubmissionRow>("contact_submissions")
    .insert(payload)
    .select();
  if (error) throwSupabaseError(error);
  return data;
}

import { sendReservationConfirmation } from "@/services/email/emailService";

export async function submitReservation(reservation: ReservationInsert) {
  // Attach profile_id when available
  const profileId = await getCurrentUserId();
  const payload = { ...reservation, profile_id: profileId } as any;

  const { data, error } = await supabase
    .from<ReservationRow>("reservations")
    .insert(payload)
    .select();
  if (error) throwSupabaseError(error);

  const inserted = data?.[0];
  if (inserted) {
    // Try to create progress record (trigger may already create it)
    try {
      await createProgressForReservation(inserted.id as number);
    } catch (e) {
      logger.warn("[submitReservation] createProgressForReservation failed", { err: String(e) });
    }

    // Send confirmation email (best-effort)
    try {
      await sendReservationConfirmation({
        full_name: reservation.full_name,
        email: reservation.email,
        delivery_area: reservation.delivery_area,
        address: reservation.address,
        selected_vegetables: reservation.selected_vegetables,
      } as any);
    } catch (e) {
      logger.warn("[submitReservation] sendReservationConfirmation failed", { err: String(e) });
    }
  }

  return data;
}

export async function fetchReservations() {
  const { data, error } = await supabase
    .from<ReservationRow>("reservations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

export async function fetchContactSubmissions() {
  const { data, error } = await supabase
    .from<ContactSubmissionRow>("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

export async function fetchHarvestReservations() {
  const { data, error } = await supabase
    .from<HarvestReservationRow>("harvest_reservations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

export async function fetchNewsletterSubscribers() {
  const { data, error } = await supabase
    .from<NewsletterSubscriberRow>("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

export async function fetchDashboardCounts() {
  const contacts = await supabase
    .from<ContactSubmissionRow>("contact_submissions")
    .select("id", { count: "exact", head: true });
  const reservations = await supabase
    .from<HarvestReservationRow>("harvest_reservations")
    .select("id", { count: "exact", head: true });
  const subscribers = await supabase
    .from<NewsletterSubscriberRow>("newsletter_subscribers")
    .select("id", { count: "exact", head: true });

  if (contacts.error || reservations.error || subscribers.error) {
    throwSupabaseError(contacts.error ?? reservations.error ?? subscribers.error);
  }

  return {
    contactCount: contacts.count ?? 0,
    reservationCount: reservations.count ?? 0,
    subscriberCount: subscribers.count ?? 0,
  };
}

export async function fetchAdminMetrics() {
  try {
    // Total customers (unique profile_id from reservations)
    const customers = await supabase
      .from<ReservationRow>("reservations")
      .select("profile_id", { count: "exact", head: true })
      .not("profile_id", "is", null);

    // Total reservations
    const allReservations = await supabase
      .from<ReservationRow>("reservations")
      .select("id, status", { count: "exact", head: false });

    // Count by status
    const reservationsByStatus = allReservations.data?.reduce((acc: any, res) => {
      acc[res.status] = (acc[res.status] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

    if (customers.error || allReservations.error) {
      throwSupabaseError(customers.error ?? allReservations.error);
    }

    return {
      totalCustomers: customers.count ?? 0,
      totalReservations: allReservations.count ?? 0,
      activeDeliveries: (reservationsByStatus["confirmed"] ?? 0) + (reservationsByStatus["pending"] ?? 0),
      completedDeliveries: reservationsByStatus["completed"] ?? 0,
      pendingReservations: reservationsByStatus["pending"] ?? 0,
    };
  } catch (err) {
    logger.error("fetchAdminMetrics failed", { err: String(err) });
    return {
      totalCustomers: 0,
      totalReservations: 0,
      activeDeliveries: 0,
      completedDeliveries: 0,
      pendingReservations: 0,
    };
  }
}

export async function fetchRecentActivity(limit = 6) {
  const [contacts, reservations, subscribers] = await Promise.all([
    fetchContactSubmissions(),
    fetchHarvestReservations(),
    fetchNewsletterSubscribers(),
  ]);

  const activity = [
    ...contacts.map((item) => ({
      id: item.id,
      source: "contact" as const,
      title: item.name,
      email: item.email,
      details: item.message,
      created_at: item.created_at,
    })),
    ...reservations.map((item) => ({
      id: item.id,
      source: "reservation" as const,
      title: item.name,
      email: item.email,
      details: `${item.city} — ${item.notes ?? "No notes"}`,
      created_at: item.created_at,
    })),
    ...subscribers.map((item) => ({
      id: item.id,
      source: "subscriber" as const,
      title: item.email,
      email: item.email,
      details: "Newsletter signup",
      created_at: item.created_at,
    })),
  ];

  return activity
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

// Customer-scoped helpers
export async function fetchUserReservations(userId?: string) {
  if (!userId) userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from<ReservationRow>("reservations")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchUserEnquiries(userId?: string) {
  if (!userId) userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from<ContactSubmissionRow>("contact_submissions")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchReservationsByProfile(userId?: string) {
  if (!userId) userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from<ReservationRow>("reservations")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

// Admin helpers
export async function fetchAllCustomers() {
  const { data, error } = await supabase.from<Profile>("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Reservation progress types and helpers
export type ReservationProgressRow = {
  id: number;
  reservation_id: number;
  reservation_received: boolean;
  farm_preparation: boolean;
  harvest_ready: boolean;
  harvested: boolean;
  week_1_delivered: boolean;
  week_2_delivered: boolean;
  week_3_delivered: boolean;
  week_4_delivered: boolean;
  week_5_delivered: boolean;
  week_6_delivered: boolean;
  week_7_delivered: boolean;
  updated_at: string;
};

export async function createProgressForReservation(reservationId: number) {
  const { data, error } = await supabase
    .from<ReservationProgressRow>("reservation_progress")
    .insert({ reservation_id: reservationId, reservation_received: true })
    .select()
    .maybeSingle();
  if (error) {
    // If the trigger already created it, ignore conflict errors
    logger.warn("[createProgressForReservation] error creating progress", { err: formatSupabaseError(error) });
    return null;
  }
  return data ?? null;
}

export async function fetchProgressByReservation(reservationId: number) {
  const { data, error } = await supabase
    .from<ReservationProgressRow>("reservation_progress")
    .select("*")
    .eq("reservation_id", reservationId)
    .maybeSingle();
  if (error) throwSupabaseError(error);
  return data ?? null;
}

export async function updateReservationProgress(reservationId: number, updates: Partial<ReservationProgressRow>) {
  const payload = { ...updates, updated_at: new Date().toISOString() } as any;
  const { data, error } = await supabase
    .from<ReservationProgressRow>("reservation_progress")
    .update(payload)
    .eq("reservation_id", reservationId)
    .select()
    .maybeSingle();
  if (error) throwSupabaseError(error);
  return data ?? null;
}

