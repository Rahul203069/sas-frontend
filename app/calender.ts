//@ts-nocheck
"use server"


import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';




  export async function bookSlot(
  dateString: string,
  title:string,
  description:string,
  calendarMetadata: {
    access_token?: string;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
  }
) {
  const auth = new google.auth.OAuth2(
    process.env.ID,
    process.env.SECRET,
    process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/google-calendar/callback'
  );

  auth.setCredentials(calendarMetadata);

  const calendar = google.calendar({ version: 'v3', auth });

  const start = new Date(dateString);
  const end = new Date(start.getTime() + 15 * 60 * 1000); // 15 minutes duration

  const event = {
    summary: title,
    description: description,
    start: {
      dateTime: start.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: 'UTC',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    console.log('Event created:', response.data);
    return { success: true, eventId: response.data.id };
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    return { error: 'Unable to book slot' };
  }
}

