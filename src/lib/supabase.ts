import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { VEGETABLES } from "@/lib/config";

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
  quantity?: number;
  status?: string;
  profile_id?: string | null;
};

export type ReservationRow = ReservationInsert & {
  id: number;
  created_at: string;
};

export type ContactSubmissionInsert = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactSubmissionRow = ContactSubmissionInsert & {
  id: number;
  profile_id?: string | null;
  status: "New" | "Contacted" | "Closed";
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  city?: string | null;
  role: "admin" | "customer";
  avatar_url?: string | null;
  auth_provider?: string | null;
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

const ADMIN_EMAILS = ["sarthakghoderao@gmail.com"];

// Check if user is admin based on profile role in database
export async function isAdmin(userId?: string) {
  try {
    const profile = await getProfile(userId);
    
    logger.info("[isAdmin] Admin check result", {
      userId,
      role: profile?.role,
      isAdmin: profile?.role === "admin",
    });

    return profile?.role === "admin";
  } catch (error) {
    logger.error("[isAdmin] Error checking admin status", { err: String(error) });
    return false;
  }
}

// Sign in with Google OAuth
export async function signInWithGoogle(redirectTo?: string) {
  const targetRedirect = redirectTo || (window.location.origin + "/login");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: targetRedirect,
    },
  });
  if (error) throwSupabaseError(error);
  return data;
}

// Listen to auth state changes (crucial for handling OAuth redirect callback)
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => {
    data.subscription.unsubscribe();
  };
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  const { data, error } = await supabase.from("profiles").upsert(profile).select().maybeSingle();
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
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
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

  return data;
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
    .from("newsletter_subscribers")
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

export async function submitContactSubmission(
  submission: ContactSubmissionInsert
) {
  const currentUser = await supabase.auth.getUser();
  const profileId = currentUser.data.user?.id ?? null;
  const payload = { ...submission, profile_id: profileId } as any;

  const { data, error } = await supabase
    .from("contact_submissions")
    .insert(payload)
    .select();
  if (error) throwSupabaseError(error);
  return data;
}

export async function updateContactSubmissionStatus(
  id: number,
  status: "New" | "Contacted" | "Closed"
) {
  const { data, error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throwSupabaseError(error);
  return data as ContactSubmissionRow | null;
}

import { sendReservationConfirmation } from "@/services/email/emailService";

export async function submitReservation(reservation: ReservationInsert) {
  // Validate and filter vegetables
  const validVegetables = new Set(VEGETABLES.winter);
  const cleanVegetables = [...new Set(reservation.selected_vegetables)].filter(v => validVegetables.has(v));
  
  if (cleanVegetables.length === 0) {
    throw new Error("Invalid reservation: At least one valid Winter vegetable must be selected.");
  }
  
  const payload = { 
    ...reservation, 
    selected_vegetables: cleanVegetables 
  } as any;

  const { data, error } = await supabase
    .from("reservations")
    .insert(payload)
    .select();
  if (error) throwSupabaseError(error);

  const inserted = data?.[0];
  if (inserted) {
    // Send confirmation email via server function (best-effort)
    try {
      const { sendReservationConfirmationEmail } = await import("@/lib/api/email.functions");
      const result = await sendReservationConfirmationEmail({
        data: {
          full_name: reservation.full_name,
          email: reservation.email,
          delivery_area: reservation.delivery_area,
          address: reservation.address,
          selected_vegetables: reservation.selected_vegetables,
        },
      });
      if (!result.ok) {
        logger.warn("[submitReservation] Email send failed", { message: result.message });
      } else {
        logger.info("[submitReservation] Confirmation email queued", { id: result.id });
      }
    } catch (e) {
      logger.warn("[submitReservation] Email function error", { err: String(e) });
    }
  }

  return data;
}

export async function fetchReservations() {
  const { data, error } = await supabase
    .from("reservations")
    .select("id, full_name, phone_number, email, delivery_area, address, selected_vegetables, notes, quantity, status, profile_id, created_at")
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

export async function fetchContactSubmissions() {
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

export async function fetchNewsletterSubscribers() {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

export async function fetchDashboardCounts() {
  const contacts = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact", head: true });
  const reservations = await supabase
    .from("reservations")
    .select("id", { count: "exact", head: true });
  const subscribers = await supabase
    .from("newsletter_subscribers")
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
    // Total customers (unique email from reservations)
    const customers = await supabase
      .from("reservations")
      .select("email", { count: "exact", head: true })
      .not("email", "is", null);

    // Total reservations
    const allReservations = await supabase
      .from("reservations")
      .select("id", { count: "exact", head: false });

    if (customers.error || allReservations.error) {
      throwSupabaseError(customers.error ?? allReservations.error);
    }

    return {
      totalCustomers: customers.count ?? 0,
      totalReservations: allReservations.count ?? 0,
      pendingReservations: 0,
      confirmedReservations: 0,
      deliveredReservations: 0,
    };
  } catch (err) {
    logger.error("fetchAdminMetrics failed", { err: String(err) });
    return {
      totalCustomers: 0,
      totalReservations: 0,
      pendingReservations: 0,
      confirmedReservations: 0,
      deliveredReservations: 0,
    };
  }
}

export async function fetchRecentActivity(limit = 6) {
  const [contacts, reservations, subscribers] = await Promise.all([
    fetchContactSubmissions(),
    fetchReservations(),
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
      title: item.full_name,
      email: item.email,
      details: `${item.delivery_area} — ${item.address}`,
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
  if (!userId) userId = (await getCurrentUserId()) ?? undefined;
  if (!userId) return [];
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchUserEnquiries(userId?: string) {
  if (!userId) userId = (await getCurrentUserId()) ?? undefined;
  if (!userId) return [];
  const profile = await getProfile(userId);
  if (!profile || !profile.email) return [];
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .eq("email", profile.email)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchReservationsByProfile(userId?: string) {
  if (!userId) userId = (await getCurrentUserId()) ?? undefined;
  if (!userId) return [];
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}

// Admin helpers
export async function fetchAllCustomers() {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateReservationDetails(reservationId: number, updates: Partial<ReservationRow>) {
  const { data, error } = await supabase
    .from("reservations")
    .update(updates as any)
    .eq("id", reservationId)
    .select()
    .maybeSingle();
  if (error) throwSupabaseError(error);
  return data ?? null;
}

