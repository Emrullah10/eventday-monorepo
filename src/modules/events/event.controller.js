const EventService = require('./event.service');

class EventController {
  async create(req, res) {
    try {
      // In a real app, organizerId would come from authenticated req.user
      const eventData = { ...req.body, organizerId: req.user?.id || req.body.organizerId };
      const event = await EventService.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async list(req, res) {
    try {
      const events = await EventService.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDetail(req, res) {
    try {
      const event = await EventService.getEventById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new EventController();
