import express from 'express';
import { calendar, oauth2Client } from '../config/googleCalendar';

const router = express.Router();

// Get Google Calendar events
router.get('/events', async (req, res) => {
    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
});

// Create new event
router.post('/events', async (req, res) => {
    try {
        const { summary, description, start, end } = req.body;
        const event = {
            summary,
            description,
            start: {
                dateTime: start,
                timeZone: 'UTC',
            },
            end: {
                dateTime: end,
                timeZone: 'UTC',
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create calendar event' });
    }
});

// Update event
router.put('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { summary, description, start, end } = req.body;
        const event = {
            summary,
            description,
            start: {
                dateTime: start,
                timeZone: 'UTC',
            },
            end: {
                dateTime: end,
                timeZone: 'UTC',
            },
        };

        const response = await calendar.events.update({
            calendarId: 'primary',
            eventId,
            requestBody: event,
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update calendar event' });
    }
});

// Delete event
router.delete('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        await calendar.events.delete({
            calendarId: 'primary',
            eventId,
        });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete calendar event' });
    }
});

// Get Google OAuth URL
router.get('/auth', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });

    res.json({ url: authUrl });
});

// Handle Google OAuth callback
router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        res.json({ message: 'Successfully authenticated with Google Calendar' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to authenticate with Google Calendar' });
    }
});

export default router; 